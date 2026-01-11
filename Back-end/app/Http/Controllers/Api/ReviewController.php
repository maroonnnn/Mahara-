<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreelancerProfile;
use App\Models\Project;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * إنشاء تقييم لمشروع مكتمل من قِبل العميل.
     */
    public function createReview(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner (client) can review'], 403);
        }

        if ($project->status !== 'completed' || ! $project->acceptedOffer) {
            return response()->json(['message' => 'Project must be completed before review'], 422);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // منع تكرار التقييم لنفس المشروع
        $existing = Review::where('project_id', $project->id)->first();
        if ($existing) {
            return response()->json(['message' => 'Project already reviewed'], 422);
        }

        $freelancerId = $project->acceptedOffer->freelancer_id;

        $review = Review::create([
            'project_id' => $project->id,
            'client_id' => $user->id,
            'freelancer_id' => $freelancerId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // تحديث متوسط تقييم المستقل وعدد التقييمات
        $this->updateFreelancerStats($freelancerId);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review->load(['client', 'freelancer']),
        ], 201);
    }

    /**
     * الحصول على تقييمات مستقل معين.
     */
    public function getFreelancerReviews(Request $request, $freelancerId)
    {
        $reviews = Review::where('freelancer_id', $freelancerId)
            ->with(['client', 'project'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * الحصول على تقييم مشروع معين.
     */
    public function getProjectReview(Project $project)
    {
        $review = Review::where('project_id', $project->id)
            ->with(['client', 'freelancer'])
            ->first();

        if (!$review) {
            return response()->json(['message' => 'No review found for this project'], 404);
        }

        return response()->json($review);
    }

    /**
     * التحقق من إمكانية تقييم المشروع.
     */
    public function canReview(Project $project, Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['can_review' => false, 'reason' => 'Not authorized']);
        }

        if ($project->status !== 'completed' || !$project->acceptedOffer) {
            return response()->json(['can_review' => false, 'reason' => 'Project not completed']);
        }

        $existing = Review::where('project_id', $project->id)->first();
        if ($existing) {
            return response()->json(['can_review' => false, 'reason' => 'Already reviewed', 'review' => $existing]);
        }

        return response()->json([
            'can_review' => true,
            'project' => [
                'id' => $project->id,
                'title' => $project->title,
                'freelancer' => $project->acceptedOffer->freelancer ?? null,
            ]
        ]);
    }

    /**
     * تحديث تقييم موجود.
     */
    public function updateReview(Review $review, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $review->client_id !== $user->id) {
            return response()->json(['message' => 'Only the review author can update'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $review->update($request->only(['rating', 'comment']));

        // تحديث متوسط تقييم المستقل
        $this->updateFreelancerStats($review->freelancer_id);

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->load(['client', 'freelancer', 'project']),
        ]);
    }

    /**
     * حذف تقييم.
     */
    public function deleteReview(Review $review, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $review->client_id !== $user->id) {
            return response()->json(['message' => 'Only the review author can delete'], 403);
        }

        $freelancerId = $review->freelancer_id;
        $review->delete();

        // تحديث متوسط تقييم المستقل
        $this->updateFreelancerStats($freelancerId);

        return response()->json(['message' => 'Review deleted successfully']);
    }

    /**
     * تحديث متوسط تقييم المستقل وعدد التقييمات.
     */
    private function updateFreelancerStats(int $freelancerId): void
    {
        $profile = FreelancerProfile::where('user_id', $freelancerId)->first();

        if (! $profile) {
            return;
        }

        $average = Review::where('freelancer_id', $freelancerId)->avg('rating');
        $count = Review::where('freelancer_id', $freelancerId)->count();

        $profile->update([
            'average_rating' => round($average ?? 0, 2),
            'total_reviews' => $count,
        ]);
    }
}

