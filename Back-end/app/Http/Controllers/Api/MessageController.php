<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    /**
     * جلب قائمة المشاريع التي يمكن للمستخدم المراسلة فيها (المشاريع التي تم قبول عرض عليها).
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
                'unread_count' => 0, // TODO: Implement unread count
                'updated_at' => $project->updated_at,
            ];
        });
        
        return response()->json($conversations);
    }

    /**
     * جلب المحادثة الخاصة بمشروع بعد قبول العرض.
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
     * إرسال رسالة بين العميل والمستقل بعد قبول العرض.
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

        return response()->json(['message' => 'Message sent', 'data' => $message], 201);
    }

    /**
     * يتحقق من إمكانية المستخدم المشاركة في محادثة المشروع.
     */
    private function userCanAccessProject(Project $project, int $userId): bool
    {
        $freelancerId = optional($project->acceptedOffer)->freelancer_id;

        return $project->client_id === $userId
            || ($freelancerId && $freelancerId === $userId);
    }

    /**
     * تحديد المستقبل بناءً على دور المستخدم الحالي.
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

