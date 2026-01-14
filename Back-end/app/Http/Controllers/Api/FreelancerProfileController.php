<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreelancerProfile;
use App\Models\Project;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FreelancerProfileController extends Controller
{
    /**
     * عرض ملف التعريف للمستقل الحالي.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can view their profile'], 403);
        }

        $profile = FreelancerProfile::with(['user', 'portfolioItems.category'])
            ->where('user_id', $user->id)
            ->first();

        if (! $profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        // Parse skills if it's a JSON string
        $skills = $profile->skills;
        if (is_string($skills)) {
            try {
                $skills = json_decode($skills, true);
            } catch (\Exception $e) {
                // If not valid JSON, keep as string
            }
        }

        return response()->json([
            'id' => $profile->id,
            'user_id' => $profile->user_id,
            'user' => [
                'id' => $profile->user->id,
                'name' => $profile->user->name,
                'email' => $profile->user->email,
                'created_at' => $profile->user->created_at,
            ],
            'display_name' => $profile->display_name,
            'title' => $profile->title,
            'bio' => $profile->bio,
            'skills' => $skills,
            'hourly_rate' => $profile->hourly_rate,
            'github_url' => $profile->github_url,
            'portfolio_url' => $profile->portfolio_url,
            'linkedin_url' => $profile->linkedin_url,
            'average_rating' => $profile->average_rating,
            'total_reviews' => $profile->total_reviews,
            'portfolioItems' => $profile->portfolioItems,
            'created_at' => $profile->created_at,
            'updated_at' => $profile->updated_at,
        ]);
    }

    /**
     * تحديث ملف التعريف للمستقل الحالي.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can update their profile'], 403);
        }

        $validator = Validator::make($request->all(), [
            'display_name' => 'nullable|string|max:191',
            'title' => 'nullable|string|max:191',
            'bio' => 'nullable|string|max:2000',
            'skills' => 'nullable|string|max:1000',
            'hourly_rate' => 'nullable|numeric|min:0',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profile = FreelancerProfile::where('user_id', $user->id)->first();

        if (! $profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->update($request->only([
            'display_name',
            'title',
            'bio',
            'skills',
            'hourly_rate',
            'github_url',
            'portfolio_url',
            'linkedin_url',
        ]));

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile->fresh(),
        ]);
    }

    /**
     * عرض ملف التعريف للمستقل للعامة (بدون مصادقة).
     * يمكن للعملاء رؤية ملف المستقل عند مراجعة العروض.
     */
    public function showPublic($id)
    {
        // البحث عن ملف المستقل باستخدام user_id
        $profile = FreelancerProfile::with([
            'user' => function($query) {
                // فقط المعلومات العامة للمستخدم
                $query->select('id', 'name', 'email', 'role', 'created_at');
            },
            'portfolioItems.category'
        ])
        ->where('user_id', $id)
        ->first();

        if (! $profile) {
            return response()->json(['message' => 'Freelancer profile not found'], 404);
        }

        // التأكد من أن المستخدم هو مستقل
        if ($profile->user->role !== 'freelancer') {
            return response()->json(['message' => 'User is not a freelancer'], 404);
        }

        // حساب الإحصائيات
        // المشاريع المكتملة: المشاريع التي قبل المستقل عرضه عليها
        $completedProjects = Project::whereHas('acceptedOffer', function($query) use ($id) {
                $query->where('freelancer_id', $id);
            })
            ->where('status', 'completed')
            ->count();

        // إجمالي الأرباح: مجموع مبالغ العروض المقبولة في المشاريع المكتملة
        $totalEarnings = Project::whereHas('acceptedOffer', function($query) use ($id) {
                $query->where('freelancer_id', $id);
            })
            ->where('status', 'completed')
            ->with('acceptedOffer')
            ->get()
            ->sum(function($project) {
                return $project->acceptedOffer ? $project->acceptedOffer->amount : 0;
            });

        // حساب التقييم المتوسط
        $avgRating = Review::where('freelancer_id', $id)
            ->avg('rating');

        $reviewsCount = Review::where('freelancer_id', $id)
            ->count();

        // تحويل المهارات من JSON string إلى array
        $skills = [];
        if ($profile->skills) {
            $skills = is_string($profile->skills) 
                ? json_decode($profile->skills, true) 
                : $profile->skills;
        }

        return response()->json([
            'data' => [
                'id' => $profile->id,
                'user_id' => $profile->user_id,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                    'email' => $profile->user->email,
                    'created_at' => $profile->user->created_at,
                ],
                'display_name' => $profile->display_name,
                'title' => $profile->title,
                'bio' => $profile->bio,
                'hourly_rate' => $profile->hourly_rate,
                'github_url' => $profile->github_url,
                'portfolio_url' => $profile->portfolio_url,
                'linkedin_url' => $profile->linkedin_url,
                'skills' => $skills,
                'rating' => round($avgRating, 1) ?: 0,
                'reviews_count' => $reviewsCount,
                'completed_projects' => $completedProjects,
                'total_earnings' => $totalEarnings,
                'portfolio_items' => $profile->portfolioItems->map(function($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'description' => $item->description,
                        'image_url' => $item->image_url,
                        'project_url' => $item->project_url,
                        'category' => $item->category ? [
                            'id' => $item->category->id,
                            'name' => $item->category->name,
                        ] : null,
                        'completion_date' => $item->completion_date,
                    ];
                }),
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ]
        ]);
    }
}

