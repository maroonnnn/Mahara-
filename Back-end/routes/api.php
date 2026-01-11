<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\FreelancerProfileController;
use App\Http\Controllers\Api\FreelancerPortfolioController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --- مسارات المصادقة (التسجيل والدخول) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- التصنيفات (متاحة للجميع) ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// --- ملفات المستقلين (متاحة للجميع للعرض) ---
Route::get('/freelancers/{id}/profile', [FreelancerProfileController::class, 'showPublic']);
Route::get('/freelancers/{freelancerId}/reviews', [ReviewController::class, 'getFreelancerReviews']);

// --- المشاريع المفتوحة (متاحة للجميع للعرض) ---
// يمكن للمستقلين رؤية المشاريع المفتوحة حتى بدون تسجيل دخول (اختياري)
Route::get('/projects/open', [ProjectController::class, 'openProjects']);

// عرض تفاصيل مشروع واحد (متاح للجميع للعرض)
Route::get('/projects/{project}', [ProjectController::class, 'show']);

// هذا المسار يتطلب أن يكون المستخدم مسجلاً دخوله
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// --- مسارات المستقل والعميل داخل المنصة ---
Route::middleware('auth:sanctum')->group(function () {

    // عروض المستقلين
    Route::middleware('role:freelancer')->group(function () {
        Route::post('/projects/{project}/offers', [OfferController::class, 'store']);
        Route::get('/freelancer/offers', [OfferController::class, 'myOffers']);
        
        // ملف تعريف المستقل
        Route::get('/freelancer/profile', [FreelancerProfileController::class, 'show']);
        Route::put('/freelancer/profile', [FreelancerProfileController::class, 'update']);
        
        // معرض أعمال المستقل (Portfolio)
        Route::get('/freelancer/portfolio', [FreelancerPortfolioController::class, 'index']);
        Route::post('/freelancer/portfolio', [FreelancerPortfolioController::class, 'store']);
        Route::put('/freelancer/portfolio/{freelancerPortfolio}', [FreelancerPortfolioController::class, 'update']);
        Route::delete('/freelancer/portfolio/{freelancerPortfolio}', [FreelancerPortfolioController::class, 'destroy']);
        
        // المشاريع النشطة للمستقل
        Route::get('/freelancer/active-projects', [ProjectController::class, 'activeProjects']);
        
        // المشاريع المكتملة للمستقل
        Route::get('/freelancer/completed-projects', [ProjectController::class, 'completedProjects']);
        
        // تسليم المشروع (Deliver Project)
        Route::post('/projects/{project}/deliver', [ProjectController::class, 'deliverProject']);
    });

    // عمليات العميل على المشروع
    Route::middleware('role:client')->group(function () {
        // إدارة المشاريع
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
        Route::get('/client/projects', [ProjectController::class, 'myProjects']);
        
        // إدارة العروض
        Route::get('/projects/{project}/offers', [OfferController::class, 'projectOffers']);
        Route::post('/projects/{project}/offers/{offer}/accept', [OfferController::class, 'acceptOffer']);
        
        // إدارة إنهاء المشروع والدفع
        Route::post('/projects/{project}/complete', [ProjectController::class, 'completeProject']);
        
        // إدارة التقييمات
        Route::post('/projects/{project}/reviews', [ReviewController::class, 'createReview']);
        Route::get('/projects/{project}/review', [ReviewController::class, 'getProjectReview']);
        Route::get('/projects/{project}/can-review', [ReviewController::class, 'canReview']);
        Route::put('/reviews/{review}', [ReviewController::class, 'updateReview']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'deleteReview']);
        
        // إدارة المشاريع
        Route::post('/projects/{project}/cancel', [ProjectController::class, 'cancel']);
    });

    // المحادثة بين العميل والمستقل بعد قبول العرض
    Route::get('/messages/conversations', [MessageController::class, 'conversations']);
    Route::get('/projects/{project}/messages', [MessageController::class, 'index']);
    Route::post('/projects/{project}/messages', [MessageController::class, 'store']);

    // نظام المحفظة
    Route::get('/wallet', [WalletController::class, 'show']);
    Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
        Route::get('/projects', [AdminController::class, 'getProjects']);
        Route::get('/transactions', [AdminController::class, 'getTransactions']);
        Route::get('/revenue', [AdminController::class, 'getRevenue']);
        Route::put('/users/{user}/status', [AdminController::class, 'updateUserStatus']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
        
        // Category Management
        Route::get('/categories', [CategoryController::class, 'adminIndex']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});

// هذا الكود المثال الذي يأتي مع لارافل، يمكنك حذفه أو تركه
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});