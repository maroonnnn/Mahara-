<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users with optional filters
     */
    public function getUsers(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Get users with wallet and statistics
        $users = $query->with(['wallet'])->latest()->paginate(20);

        // Add statistics for each user
        $users->getCollection()->transform(function($user) {
            $stats = [];
            
            if ($user->role === 'client') {
                $stats['projects'] = Project::where('client_id', $user->id)->count();
                $stats['totalSpent'] = Transaction::whereHas('wallet', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->where('type', 'payment')->sum('amount');
            } elseif ($user->role === 'freelancer') {
                $stats['projects'] = Project::whereHas('acceptedOffer', function($q) use ($user) {
                    $q->where('freelancer_id', $user->id);
                })->count();
                $stats['totalEarned'] = Transaction::whereHas('wallet', function($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->where('type', 'deposit')->sum('amount');
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'balance' => $user->wallet ? $user->wallet->balance : 0,
                'projects' => $stats['projects'] ?? 0,
                'revenue' => $stats['totalSpent'] ?? $stats['totalEarned'] ?? 0,
                'stats' => $stats,
            ];
        });

        return response()->json($users);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(Request $request)
    {
        $totalUsers = User::count();
        $totalProjects = Project::count();
        $totalRevenue = Transaction::where('type', 'payment')->where('status', 'completed')->sum('amount');
        $activeProjects = Project::where('status', 'in_progress')->count();
        
        // Users this month
        $newUsersThisMonth = User::whereMonth('created_at', now()->month)
                                 ->whereYear('created_at', now()->year)
                                 ->count();
        
        $completedProjects = Project::where('status', 'completed')->count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        
        // Get total categories from database
        $totalCategories = \DB::table('categories')->count();

        // Recent users
        $recentUsers = User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']);

        // Recent projects
        $recentProjects = Project::with(['client', 'category'])
                                 ->latest()
                                 ->take(5)
                                 ->get();

        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProjects' => $totalProjects,
                'totalRevenue' => (float) $totalRevenue,
                'activeProjects' => $activeProjects,
                'newUsersThisMonth' => $newUsersThisMonth,
                'completedProjects' => $completedProjects,
                'pendingTransactions' => $pendingTransactions,
                'totalCategories' => $totalCategories,
            ],
            'recentUsers' => $recentUsers,
            'recentProjects' => $recentProjects,
        ]);
    }

    /**
     * Get all projects with optional filters
     */
    public function getProjects(Request $request)
    {
        $query = Project::with(['client', 'category', 'acceptedOffer.freelancer']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $projects = $query->latest()->paginate(20);

        return response()->json($projects);
    }

    /**
     * Get all transactions with optional filters
     */
    public function getTransactions(Request $request)
    {
        $query = Transaction::with(['wallet.user']);

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->latest()->paginate(20);

        return response()->json($transactions);
    }

    /**
     * Update user status (ban/unban)
     */
    public function updateUserStatus(Request $request, $userId)
    {
        $request->validate([
            'status' => 'required|in:active,suspended,banned',
        ]);

        $user = User::findOrFail($userId);
        
        // Prevent admins from suspending themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot modify your own status'], 403);
        }

        $user->status = $request->status;
        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        
        // Prevent admins from deleting themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        // Prevent deleting users with active projects
        if ($user->role === 'client') {
            $activeProjects = Project::where('client_id', $user->id)
                                    ->where('status', 'in_progress')
                                    ->count();
            if ($activeProjects > 0) {
                return response()->json([
                    'message' => 'Cannot delete user with active projects'
                ], 422);
            }
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get platform revenue statistics
     */
    public function getRevenue(Request $request)
    {
        // Get all completed transactions
        $allTransactions = Transaction::with('wallet.user')
            ->where('status', 'completed')
            ->latest()
            ->get();

        // Calculate deposit fees (no platform fee on deposits anymore)
        $deposits = $allTransactions->where('type', 'deposit')->map(function($transaction) {
            $details = is_string($transaction->details) ? json_decode($transaction->details, true) : ($transaction->details ?? []);
            $amount = abs((float) $transaction->amount);
            // No commission on deposits
            $fee = 0;
            
            return [
                'id' => $transaction->id,
                'date' => $transaction->created_at,
                'userName' => $transaction->wallet->user->name ?? 'N/A',
                'amount' => $amount,
                'fee' => $fee,
                'type' => $details['method'] ?? 'unknown',
            ];
        })->values();

        // Calculate withdrawal fees (no platform fee on withdrawals anymore)
        $withdrawals = $allTransactions->where('type', 'withdraw')->map(function($transaction) {
            $details = is_string($transaction->details) ? json_decode($transaction->details, true) : ($transaction->details ?? []);
            $amount = abs((float) $transaction->amount);
            // No commission on withdrawals – ignore any stored platform_fee
            $fee = 0;
            
            return [
                'id' => $transaction->id,
                'date' => $transaction->created_at,
                'userName' => $transaction->wallet->user->name ?? 'N/A',
                'amount' => $amount,
                'fee' => (float) $fee,
                'type' => $details['method'] ?? 'unknown',
            ];
        })->values();

        // Calculate project commissions (from completed payments)
        $commissions = $allTransactions->where('type', 'payment')->map(function($transaction) {
            $details = is_string($transaction->details) ? json_decode($transaction->details, true) : ($transaction->details ?? []);
            $amount = abs((float) $transaction->amount);
            $commission = $amount * 0.05; // 5% platform commission on projects
            
            return [
                'id' => $transaction->id,
                'date' => $transaction->created_at,
                'userName' => $transaction->wallet->user->name ?? 'N/A',
                'amount' => $amount,
                'fee' => $commission,
                'type' => 'project',
                'project' => $details['project'] ?? 'N/A',
            ];
        })->values();

        // Calculate totals
        $totalDepositFees = 0;
        $totalWithdrawalFees = 0;
        $totalCommissions = $commissions->sum('fee');
        $grandTotal = $totalDepositFees + $totalWithdrawalFees + $totalCommissions;

        return response()->json([
            'total' => $grandTotal,
            'depositFees' => $totalDepositFees,
            'withdrawalFees' => $totalWithdrawalFees,
            'commissions' => $totalCommissions,
            'deposits' => $deposits,
            'withdrawals' => $withdrawals,
            'commissionTransactions' => $commissions,
        ]);
    }

    /**
     * Get reports and analytics data
     */
    public function getReports(Request $request)
    {
        $period = $request->get('period', 'month');
        
        // Calculate date range based on period
        $now = now();
        switch ($period) {
            case 'week':
                $startDate = $now->copy()->startOfWeek();
                break;
            case 'quarter':
                $startDate = $now->copy()->startOfQuarter();
                break;
            case 'year':
                $startDate = $now->copy()->startOfYear();
                break;
            default: // month
                $startDate = $now->copy()->startOfMonth();
        }

        // Users statistics
        $totalUsers = User::count();
        $newUsers = User::where('created_at', '>=', $startDate)->count();
        $activeUsers = User::where('status', 'active')->count();
        
        // Calculate growth percentage (compare with previous period)
        $previousStartDate = $startDate->copy()->sub($period === 'week' ? 1 : ($period === 'month' ? 1 : ($period === 'quarter' ? 3 : 12)), $period === 'week' ? 'week' : ($period === 'month' ? 'month' : 'month'));
        $previousNewUsers = User::whereBetween('created_at', [$previousStartDate, $startDate])->count();
        $usersGrowth = $previousNewUsers > 0 ? round((($newUsers - $previousNewUsers) / $previousNewUsers) * 100) : 0;

        // Projects statistics
        $totalProjects = Project::count();
        $activeProjects = Project::where('status', 'in_progress')->count();
        $completedProjects = Project::where('status', 'completed')->count();
        $newProjects = Project::where('created_at', '>=', $startDate)->count();
        $previousNewProjects = Project::whereBetween('created_at', [$previousStartDate, $startDate])->count();
        $projectsGrowth = $previousNewProjects > 0 ? round((($newProjects - $previousNewProjects) / $previousNewProjects) * 100) : 0;

        // Revenue statistics
        $totalRevenue = Transaction::where('type', 'payment')
            ->where('status', 'completed')
            ->sum('amount');
        
        $thisPeriodRevenue = Transaction::where('type', 'payment')
            ->where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->sum('amount');
        
        $previousPeriodRevenue = Transaction::where('type', 'payment')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$previousStartDate, $startDate])
            ->sum('amount');
        
        $revenueGrowth = $previousPeriodRevenue > 0 ? round((($thisPeriodRevenue - $previousPeriodRevenue) / $previousPeriodRevenue) * 100) : 0;

        // Monthly trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = $now->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
            
            $monthRevenue = Transaction::where('type', 'payment')
                ->where('status', 'completed')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('amount');
            
            $monthlyTrends[] = [
                'month' => $monthStart->format('M'),
                'monthName' => $monthStart->format('F'),
                'revenue' => (float) $monthRevenue,
            ];
        }

        // Top categories by projects and revenue
        $categories = DB::table('categories')
            ->leftJoin('projects', 'categories.id', '=', 'projects.category_id')
            ->leftJoin('offers', function($join) {
                $join->on('projects.id', '=', 'offers.project_id')
                     ->where('offers.status', '=', 'accepted');
            })
            ->select(
                'categories.id',
                'categories.name',
                DB::raw('COUNT(DISTINCT projects.id) as projects_count'),
                DB::raw('COALESCE(SUM(offers.amount), 0) as revenue')
            )
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('projects_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function($category) {
                return [
                    'name' => $category->name,
                    'projects' => (int) $category->projects_count,
                    'revenue' => (float) $category->revenue,
                ];
            });

        return response()->json([
            'users' => [
                'total' => $totalUsers,
                'new' => $newUsers,
                'active' => $activeUsers,
                'growth' => $usersGrowth > 0 ? '+' . $usersGrowth . '%' : $usersGrowth . '%',
            ],
            'projects' => [
                'total' => $totalProjects,
                'active' => $activeProjects,
                'completed' => $completedProjects,
                'new' => $newProjects,
                'growth' => $projectsGrowth > 0 ? '+' . $projectsGrowth . '%' : $projectsGrowth . '%',
            ],
            'revenue' => [
                'total' => (float) $totalRevenue,
                'thisPeriod' => (float) $thisPeriodRevenue,
                'lastPeriod' => (float) $previousPeriodRevenue,
                'growth' => $revenueGrowth > 0 ? '+' . $revenueGrowth . '%' : $revenueGrowth . '%',
            ],
            'monthlyTrends' => $monthlyTrends,
            'topCategories' => $categories,
        ]);
    }
}
