<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    /**
     * Create a new offer by freelancer on an open project.
     */
    public function store(Request $request, Project $project)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can place offers'], 403);
        }

        if ($project->status !== 'open') {
            return response()->json(['message' => 'Project is not open for offers'], 422);
        }

        if ($project->client_id === $user->id) {
            return response()->json(['message' => 'You cannot bid on your own project'], 422);
        }

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'delivery_days' => 'required|integer|min:1',
            'cover_message' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Allow maximum of 2 offers from the same freelancer on the same project
        $offersCountForThisProject = Offer::where('project_id', $project->id)
            ->where('freelancer_id', $user->id)
            ->count();

        if ($offersCountForThisProject >= 2) {
            return response()->json([
                'message' => 'You can submit a maximum of 2 offers on this project'
            ], 422);
        }

        $offer = Offer::create([
            'project_id' => $project->id,
            'freelancer_id' => $user->id,
            'amount' => $request->amount,
            'delivery_days' => $request->delivery_days,
            'cover_message' => $request->cover_message,
        ]);

        // Create notification for the project owner (client)
        $project->load('client');
        if ($project->client) {
            Notification::create([
                'user_id' => $project->client_id,
                'type' => 'offer_submitted',
                'title' => 'New offer on your project',
                'message' => "Freelancer {$user->name} submitted a new offer on your project: {$project->title}",
                'related_type' => 'project',
                'related_id' => $project->id,
            ]);
        }

        return response()->json(['message' => 'Offer submitted successfully', 'offer' => $offer], 201);
    }

    /**
     * View freelancer's offers with status of each offer and associated project.
     */
    public function myOffers(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can access their offers'], 403);
        }

        $offers = Offer::with(['project.category'])
            ->where('freelancer_id', $user->id)
            ->latest()
            ->paginate(10);

        return response()->json($offers);
    }

    /**
     * View all offers submitted on a specific project (from client's perspective).
     */
    public function projectOffers(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner can view its offers'], 403);
        }

        $offers = Offer::with(['freelancer.freelancerProfile'])
            ->where('project_id', $project->id)
            ->orderBy('amount', 'asc')
            ->get();

        return response()->json([
            'project' => $project->load('category'),
            'offers' => $offers,
            'offers_count' => $offers->count(),
        ]);
    }

    /**
     * Accept a specific offer by the client and pay from wallet with amount reservation.
     */
    public function acceptOffer(Project $project, Offer $offer, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner (client) can accept offers'], 403);
        }

        if ($project->status !== 'open') {
            return response()->json(['message' => 'Project is not open'], 422);
        }

        if ($offer->project_id !== $project->id || $offer->status !== 'pending') {
            return response()->json(['message' => 'Invalid offer'], 422);
        }

        $wallet = $user->wallet;
        if (! $wallet || $wallet->balance < $offer->amount) {
            return response()->json(['message' => 'Insufficient wallet balance'], 422);
        }

        DB::transaction(function () use ($project, $offer, $wallet) {
            $wallet->decrement('balance', $offer->amount);

            Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'payment',
                'amount' => $offer->amount,
                'status' => 'completed',
                'reference_type' => 'project',
                'reference_id' => $project->id,
                'details' => ['offer_id' => $offer->id],
            ]);

            // Update selected offer status and reject the rest
            $offer->update(['status' => 'accepted']);
            Offer::where('project_id', $project->id)
                ->where('id', '<>', $offer->id)
                ->update(['status' => 'rejected']);

            $project->update([
                'accepted_offer_id' => $offer->id,
                'status' => 'in_progress',
            ]);

            // Create notification for the freelancer
            $offer->load('freelancer');
            if ($offer->freelancer) {
                Notification::create([
                    'user_id' => $offer->freelancer_id,
                    'type' => 'offer_accepted',
                    'title' => 'Your offer has been accepted',
                    'message' => "Your offer on project: {$project->title} has been accepted. You can now start working!",
                    'related_type' => 'project',
                    'related_id' => $project->id,
                ]);
            }
        });

        return response()->json(['message' => 'Offer accepted and payment captured']);
    }
}

