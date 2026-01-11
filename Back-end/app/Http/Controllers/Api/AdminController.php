<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Transaction;
use Illuminate\Http\Request;

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

        // Calculate deposit fees (10% platform fee on deposits)
        $deposits = $allTransactions->where('type', 'deposit')->map(function($transaction) {
            $details = is_string($transaction->details) ? json_decode($transaction->details, true) : ($transaction->details ?? []);
            $amount = abs((float) $transaction->amount);
            $fee = $amount * 0.10; // 10% platform fee
            
            return [
                'id' => $transaction->id,
                'date' => $transaction->created_at,
                'userName' => $transaction->wallet->user->name ?? 'N/A',
                'amount' => $amount,
                'fee' => $fee,
                'type' => $details['method'] ?? 'unknown',
            ];
        })->values();

        // Calculate withdrawal fees
        $withdrawals = $allTransactions->where('type', 'withdraw')->map(function($transaction) {
            $details = is_string($transaction->details) ? json_decode($transaction->details, true) : ($transaction->details ?? []);
            $amount = abs((float) $transaction->amount);
            // Withdrawal fee might be stored in details or calculated
            $fee = $details['platform_fee'] ?? 0;
            
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
            $commission = $amount * 0.20; // 20% platform commission on projects
            
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
        $totalDepositFees = $deposits->sum('fee');
        $totalWithdrawalFees = $withdrawals->sum('fee');
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
}
