<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * Get list of projects where the user can message (projects with accepted offers).
     */
    public function conversations(Request $request)
    {
        $user = $request->user();
        
        // Get projects where user can message:
        // 1. Projects where user is the client and has accepted offer
        // 2. Projects where user is the freelancer with accepted offer
        $projects = Project::where(function ($query) use ($user) {
            if ($user->role === 'client') {
                $query->where('client_id', $user->id)
                      ->whereNotNull('accepted_offer_id');
            } elseif ($user->role === 'freelancer') {
                $query->whereHas('acceptedOffer', function ($q) use ($user) {
                    $q->where('freelancer_id', $user->id);
                });
            }
        })
        ->with(['category', 'client', 'acceptedOffer.freelancer'])
        ->withCount('messages')
        ->with(['messages' => function ($query) {
            $query->latest()->limit(1);
        }])
        ->latest('updated_at')
        ->get();
        
        // Format response as conversations
        $conversations = $projects->map(function ($project) use ($user) {
            $otherUser = null;
            if ($user->role === 'client') {
                $otherUser = $project->acceptedOffer->freelancer ?? null;
            } else {
                $otherUser = $project->client;
            }
            
            $lastMessage = $project->messages->first();
            
            return [
                'id' => $project->id, // Use project ID as conversation ID
                'project_id' => $project->id,
                'project' => [
                    'id' => $project->id,
                    'title' => $project->title,
                    'status' => $project->status,
                ],
                'other_user' => $otherUser ? [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'email' => $otherUser->email,
                ] : null,
                'last_message' => $lastMessage ? [
                    'text' => $lastMessage->content,
                    'timestamp' => $lastMessage->created_at,
                    'sender_id' => $lastMessage->sender_id,
                ] : null,
                'unread_count' => Message::where('project_id', $project->id)
                    ->where('receiver_id', $user->id)
                    ->where('sender_id', '!=', $user->id) // Only count messages from others
                    ->count(), // Count all received messages as unread (can be improved with read_at field later)
                'updated_at' => $project->updated_at,
            ];
        });
        
        return response()->json($conversations);
    }

    /**
     * Get conversation for a project after offer acceptance.
     */
    public function index(Project $project, Request $request)
    {
        if (!$this->userCanAccessProject($project, $request->user()->id)) {
            return response()->json(['message' => 'You are not allowed to view this chat'], 403);
        }

        $messages = Message::where('project_id', $project->id)
            ->with(['sender', 'receiver'])
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    /**
     * Send a message between client and freelancer after offer acceptance.
     */
    public function store(Project $project, Request $request)
    {
        $user = $request->user();

        if (!$this->userCanAccessProject($project, $user->id)) {
            return response()->json(['message' => 'You are not allowed to send messages for this project'], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:3000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $receiverId = $this->resolveReceiverId($project, $user->id);

        if (!$receiverId) {
            return response()->json(['message' => 'Chat is not available for this project'], 422);
        }

        $message = Message::create([
            'project_id' => $project->id,
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
            'content' => $request->content,
        ]);

        // Create notification for the receiver
        $project->load(['client', 'acceptedOffer.freelancer']);
        $receiver = \App\Models\User::find($receiverId);
        
        if ($receiver) {
            $senderName = $user->name;
            $projectTitle = $project->title;
            $messagePreview = mb_substr($request->content, 0, 100);
            
            Notification::create([
                'user_id' => $receiverId,
                'type' => 'message_received',
                'title' => 'New message from ' . $senderName,
                'message' => "New message in project \"{$projectTitle}\": {$messagePreview}",
                'related_type' => 'project', // Store as project so we can navigate to the conversation
                'related_id' => $project->id, // Store project ID for navigation
            ]);
        }

        return response()->json(['message' => 'Message sent', 'data' => $message], 201);
    }

    /**
     * Check if user can participate in project conversation.
     */
    private function userCanAccessProject(Project $project, int $userId): bool
    {
        $freelancerId = optional($project->acceptedOffer)->freelancer_id;

        return $project->client_id === $userId
            || ($freelancerId && $freelancerId === $userId);
    }

    /**
     * Determine receiver based on current user role.
     */
    private function resolveReceiverId(Project $project, int $senderId): ?int
    {
        $freelancerId = optional($project->acceptedOffer)->freelancer_id;

        if (!$freelancerId) {
            return null;
        }

        if ($project->client_id === $senderId) {
            return $freelancerId;
        }

        return $project->client_id;
    }
}

