<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Project;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    /**
     * Create a new project by client.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can create projects'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:191',
            'description' => 'required|string|max:5000',
            'category_id' => 'required|exists:categories,id',
            'budget' => 'required|numeric|min:1',
            'duration_days' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
        $project = Project::create([
            'client_id' => $user->id,
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'budget' => $request->budget,
                'duration_days' => $request->duration_days ?? null,
            'status' => 'open',
        ]);

            // Load relationships safely
            $project->load(['category', 'client']);

        return response()->json([
            'message' => 'Project created successfully',
                'project' => $project,
        ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating project: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
                'user_id' => $user->id ?? null,
            ]);

            return response()->json([
                'message' => 'Error creating project: ' . $e->getMessage(),
                'error' => config('app.debug') ? $e->getTraceAsString() : 'Internal server error',
            ], 500);
        }
    }

    /**
     * Display list of open projects with filtering by category or budget.
     * Designed for freelancer interface to browse available opportunities.
     * 
     * This endpoint is available to everyone (with or without authentication) to view open projects.
     */
    public function openProjects(Request $request)
    {
        $query = Project::with(['category', 'client'])
            ->withCount('offers') // Add offer count for each project
            ->where('status', 'open');

        // Exclude freelancer's own projects (if logged in)
        // Freelancers should not see their own projects
        if ($request->user() && $request->user()->role === 'freelancer') {
            // We don't exclude anything - freelancers can see all open projects
            // But can add exclusion if freelancer is also a client
        }

        // Exclude client's own projects (if logged in as client)
        // This allows clients to see other clients' projects (for inspiration or review)
        if ($request->user() && $request->user()->role === 'client') {
            $query->where('client_id', '!=', $request->user()->id);
        }
        
        // Log for debugging
        \Log::info('Open projects query', [
            'user_id' => $request->user()?->id,
            'user_role' => $request->user()?->role,
            'total_open_projects' => Project::where('status', 'open')->count(),
            'filtered_count' => $query->count(),
        ]);

        // تصفية حسب الفئة
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        // تصفية حسب الميزانية الدنيا
        if ($request->filled('min_budget')) {
            $query->where('budget', '>=', $request->float('min_budget'));
        }

        // تصفية حسب الميزانية العليا
        if ($request->filled('max_budget')) {
            $query->where('budget', '<=', $request->float('max_budget'));
        }

        // البحث في العنوان والوصف
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // ترتيب المشاريع
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        
        if ($sortBy === 'budget') {
            $query->orderBy('budget', $sortOrder);
        } elseif ($sortBy === 'offers') {
            // ترتيب حسب عدد العروض (يستخدم withCount الذي تم إضافته مسبقاً)
            $query->orderBy('offers_count', $sortOrder);
        } else {
            // افتراضي: ترتيب حسب الأحدث
            $query->latest('created_at');
        }

        $projects = $query->paginate(20);

        return response()->json($projects);
    }

    /**
     * تحديث مشروع (فقط إذا كان مفتوحاً ولم يتم قبول أي عرض).
     */
    public function update(Request $request, Project $project)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner can update it'], 403);
        }

        // لا يمكن تعديل المشروع إذا تم قبول عرض أو إذا لم يكن مفتوحاً
        if ($project->status !== 'open' || $project->accepted_offer_id !== null) {
            return response()->json([
                'message' => 'Project cannot be updated. It must be open and have no accepted offers'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:191',
            'description' => 'sometimes|string|max:5000',
            'category_id' => 'sometimes|exists:categories,id',
            'budget' => 'sometimes|numeric|min:1',
            'duration_days' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project->update($request->only([
            'title',
            'description',
            'category_id',
            'budget',
            'duration_days',
        ]));

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project->fresh()->load(['category', 'client']),
        ]);
    }

    /**
     * حذف مشروع (فقط إذا كان مفتوحاً ولم يتم قبول أي عرض).
     */
    public function destroy(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner can delete it'], 403);
        }

        // لا يمكن حذف المشروع إذا تم قبول عرض أو إذا لم يكن مفتوحاً
        if ($project->status !== 'open' || $project->accepted_offer_id !== null) {
            return response()->json([
                'message' => 'Project cannot be deleted. It must be open and have no accepted offers'
            ], 422);
        }

        // حذف جميع العروض المرتبطة أولاً (سيتم حذفها تلقائياً بسبب cascade delete)
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    /**
     * عرض قائمة مشاريع العميل مع إمكانية التصفية حسب الحالة.
     */
    public function myProjects(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client') {
            return response()->json(['message' => 'Only clients can view their projects'], 403);
        }

        $query = Project::with(['category', 'acceptedOffer.freelancer'])
            ->where('client_id', $user->id);

        // تصفية حسب الحالة
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // تصفية حسب التصنيف
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        $projects = $query->latest()->paginate(10);

        return response()->json($projects);
    }

    /**
     * عرض تفاصيل مشروع واحد مع العروض المرتبطة به (للمراجعة قبل التقديم).
     */
    public function show(Project $project)
    {
        $project->load([
            'category',
            'client',
            'offers.freelancer.freelancerProfile',
            'acceptedOffer.freelancer',
        ]);

        return response()->json($project);
    }

    /**
     * تسليم المشروع من قِبل المستقل (يغير الحالة إلى delivered).
     */
    public function deliverProject(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can deliver projects'], 403);
        }

        if ($project->status !== 'in_progress' || ! $project->acceptedOffer) {
            return response()->json(['message' => 'Project is not in progress'], 422);
        }

        // التحقق من أن المستقل هو صاحب العرض المقبول
        if ($project->acceptedOffer->freelancer_id !== $user->id) {
            return response()->json(['message' => 'Only the assigned freelancer can deliver this project'], 403);
        }

        // تغيير حالة المشروع إلى delivered (في انتظار موافقة العميل)
        $project->update(['status' => 'delivered']);

        return response()->json([
            'message' => 'Project delivered successfully. Waiting for client approval.',
            'project' => $project->fresh()->load(['acceptedOffer.freelancer', 'client']),
        ]);
    }

    /**
     * إنهاء المشروع وتحويل المبلغ للمستقل (من قِبل العميل بعد الموافقة على التسليم).
     */
    public function completeProject(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner (client) can complete the project'], 403);
        }

        // السماح بإكمال المشروع إذا كان في حالة delivered أو in_progress
        if (!in_array($project->status, ['in_progress', 'delivered']) || ! $project->acceptedOffer) {
            return response()->json(['message' => 'Project cannot be completed in its current status'], 422);
        }

        $offer = $project->acceptedOffer;
        $freelancerWallet = $offer->freelancer->wallet;

        DB::transaction(function () use ($project, $offer, $freelancerWallet) {
            // تحويل المبلغ من حساب العميل (المحجوز) إلى حساب المستقل
            $freelancerWallet->increment('balance', $offer->amount);

            // تسجيل معاملة إيداع للمستقل
            Transaction::create([
                'wallet_id' => $freelancerWallet->id,
                'type' => 'deposit',
                'amount' => $offer->amount,
                'status' => 'completed',
                'reference_type' => 'project',
                'reference_id' => $project->id,
                'details' => ['offer_id' => $offer->id],
            ]);

            // تغيير حالة المشروع إلى completed
            $project->update(['status' => 'completed']);
        });

        return response()->json([
            'message' => 'Project completed and payment released to freelancer',
            'project' => $project->fresh()->load(['acceptedOffer.freelancer']),
        ]);
    }

    /**
     * إلغاء المشروع قبل البدء (أو أثناء التنفيذ) مع استرجاع المبلغ للعميل.
     */
    public function cancel(Project $project, Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'client' || $project->client_id !== $user->id) {
            return response()->json(['message' => 'Only the project owner (client) can cancel the project'], 403);
        }

        if (in_array($project->status, ['completed', 'cancelled'], true)) {
            return response()->json(['message' => 'Project is already finished'], 422);
        }

        // إذا لم يتم قبول عرض بعد، مجرد إلغاء.
        if (! $project->acceptedOffer || $project->status === 'open') {
            $project->update(['status' => 'cancelled']);
            return response()->json(['message' => 'Project cancelled']);
        }

        $offer = $project->acceptedOffer;
        $clientWallet = $user->wallet;

        DB::transaction(function () use ($project, $offer, $clientWallet) {
            $clientWallet->increment('balance', $offer->amount);

            Transaction::create([
                'wallet_id' => $clientWallet->id,
                'type' => 'refund',
                'amount' => $offer->amount,
                'status' => 'completed',
                'reference_type' => 'project',
                'reference_id' => $project->id,
                'details' => ['offer_id' => $offer->id],
            ]);

            $project->update(['status' => 'cancelled']);
            $offer->update(['status' => 'rejected']);
        });

        return response()->json(['message' => 'Project cancelled and refunded']);
    }

    /**
     * عرض المشاريع النشطة للمستقل (المشاريع التي تم قبول عرضه عليها).
     */
    public function activeProjects(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can view their active projects'], 403);
        }

        $projects = Project::with([
                'category',
                'client',
                'acceptedOffer',
            ])
            ->whereHas('acceptedOffer', function ($query) use ($user) {
                $query->where('freelancer_id', $user->id);
            })
            ->where('status', 'in_progress')
            ->latest()
            ->get();

        return response()->json($projects);
    }

    /**
     * عرض المشاريع المكتملة للمستقل مع التقييمات.
     * يشمل المشاريع التي تم تسليمها (delivered) والمكتملة (completed).
     */
    public function completedProjects(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'freelancer') {
            return response()->json(['message' => 'Only freelancers can view their completed projects'], 403);
        }

        $projects = Project::with([
                'category',
                'client',
                'acceptedOffer',
                'reviews',
            ])
            ->whereHas('acceptedOffer', function ($query) use ($user) {
                $query->where('freelancer_id', $user->id);
            })
            ->whereIn('status', ['delivered', 'completed'])
            ->latest()
            ->paginate(10);

        return response()->json($projects);
    }
}

