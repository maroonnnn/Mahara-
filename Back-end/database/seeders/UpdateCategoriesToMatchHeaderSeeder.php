<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UpdateCategoriesToMatchHeaderSeeder extends Seeder
{
    public function run(): void
    {
        // Categories from data/categories.js that match the header
        $categories = [
            [
                'name' => 'Graphics & Design',
                'slug' => 'graphics-design',
                'description' => 'Stand out from the crowd with creative graphic design services',
                'icon' => '🎨',
            ],
            [
                'name' => 'Programming & Tech',
                'slug' => 'programming-tech',
                'description' => 'Build your digital products with expert programmers and developers',
                'icon' => '💻',
            ],
            [
                'name' => 'Digital Marketing',
                'slug' => 'digital-marketing',
                'description' => 'Build your brand. Grow your business.',
                'icon' => '📱',
            ],
            [
                'name' => 'Video & Animation',
                'slug' => 'video-animation',
                'description' => 'Bring your story to life with creative videos',
                'icon' => '🎥',
            ],
            [
                'name' => 'Writing & Translation',
                'slug' => 'writing-translation',
                'description' => 'Get your words across—in any language',
                'icon' => '✍️',
            ],
            [
                'name' => 'Music & Audio',
                'slug' => 'music-audio',
                'description' => 'Fill your life with music & sound',
                'icon' => '🎵',
            ],
            [
                'name' => 'Data',
                'slug' => 'data',
                'description' => 'Learn your business with data analytics & insights',
                'icon' => '📊',
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' => 'Consultants for any business need',
                'icon' => '💼',
            ],
        ];

        // Map old Arabic names to new English slugs
        $oldToNewMapping = [
            'البرمجة والتقنية' => 'programming-tech',
            'التصميم الجرافيكي' => 'graphics-design',
            'تحليل البيانات' => 'data',
            'التسويق الرقمي' => 'digital-marketing',
            'الدعم الفني' => 'business', // Technical Support maps to Business
            'الفيديو والأنيميشن' => 'video-animation',
        ];

        // First, update existing categories by matching old Arabic names
        foreach ($oldToNewMapping as $oldName => $newSlug) {
            $category = Category::where('name', $oldName)->first();
            if ($category) {
                $newCategoryData = collect($categories)->firstWhere('slug', $newSlug);
                if ($newCategoryData) {
                    $category->update([
                        'name' => $newCategoryData['name'],
                        'slug' => $newCategoryData['slug'],
                        'description' => $newCategoryData['description'],
                        'icon' => $newCategoryData['icon'],
                        'is_active' => true,
                    ]);
                    $this->command->info("Updated category: {$oldName} -> {$newCategoryData['name']}");
                }
            }
        }

        // Then, create any missing categories
        foreach ($categories as $categoryData) {
            $category = Category::where('slug', $categoryData['slug'])->first();
            if (!$category) {
                Category::create([
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug'],
                    'description' => $categoryData['description'],
                    'icon' => $categoryData['icon'],
                    'is_active' => true,
                ]);
                $this->command->info("Created category: {$categoryData['name']}");
            }
        }

        $this->command->info('Categories updated to match header categories!');
    }
}
