<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * عرض قائمة جميع التصنيفات المتاحة.
     */
    public function index(Request $request)
    {
        $categories = Category::orderBy('name')->get();
        
        return response()->json($categories);
    }

    /**
     * عرض تفاصيل تصنيف واحد.
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * إنشاء تصنيف جديد (Admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'slug' => 'nullable|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'is_active' => 'boolean',
        ]);

        // Auto-generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ], 201);
    }

    /**
     * تحديث تصنيف (Admin only).
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:categories,name,' . $category->id,
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
            'is_active' => 'boolean',
        ]);

        // Auto-generate slug if name changed but slug not provided
        if (isset($validated['name']) && !isset($validated['slug'])) {
            $validated['slug'] = \Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }

    /**
     * حذف تصنيف (Admin only).
     */
    public function destroy(Category $category)
    {
        // Check if category has projects
        $projectsCount = $category->projects()->count();
        
        if ($projectsCount > 0) {
            return response()->json([
                'message' => 'Cannot delete category with active projects',
                'projects_count' => $projectsCount
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }

    /**
     * Get categories with project counts (Admin).
     */
    public function adminIndex(Request $request)
    {
        $categories = Category::withCount('projects')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}

