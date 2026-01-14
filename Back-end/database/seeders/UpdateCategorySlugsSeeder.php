<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class UpdateCategorySlugsSeeder extends Seeder
{
    public function run(): void
    {
        // Map Arabic names to English slugs
        $categoryMappings = [
            'البرمجة والتقنية' => [
                'slug' => 'programming-tech',
                'name' => 'البرمجة والتقنية',
                'name_en' => 'Programming & Tech',
                'description' => 'Build your digital products with expert programmers and developers',
            ],
            'التصميم الجرافيكي' => [
                'slug' => 'graphics-design',
                'name' => 'التصميم الجرافيكي',
                'name_en' => 'Graphics & Design',
                'description' => 'Stand out from the crowd with creative graphic design services',
            ],
            'تحليل البيانات' => [
                'slug' => 'data',
                'name' => 'تحليل البيانات',
                'name_en' => 'Data',
                'description' => 'Learn your business with data analytics & insights',
            ],
            'التسويق الرقمي' => [
                'slug' => 'digital-marketing',
                'name' => 'التسويق الرقمي',
                'name_en' => 'Digital Marketing',
                'description' => 'Build your brand. Grow your business.',
            ],
            'الدعم الفني' => [
                'slug' => 'business',
                'name' => 'الدعم الفني',
                'name_en' => 'Business',
                'description' => 'Consultants for any business need',
            ],
            'الفيديو والأنيميشن' => [
                'slug' => 'video-animation',
                'name' => 'الفيديو والأنيميشن',
                'name_en' => 'Video & Animation',
                'description' => 'Bring your story to life with creative videos',
            ],
        ];

        foreach ($categoryMappings as $arabicName => $data) {
            $category = Category::where('name', $arabicName)->first();
            
            if ($category) {
                $category->update([
                    'slug' => $data['slug'],
                    'name' => $data['name'],
                    'description' => $data['description'] ?? $category->description,
                ]);
                $this->command->info("Updated category: {$arabicName} -> {$data['slug']}");
            } else {
                // Create if doesn't exist
                Category::create([
                    'slug' => $data['slug'],
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'is_active' => true,
                ]);
                $this->command->info("Created category: {$data['name']} -> {$data['slug']}");
            }
        }

        $this->command->info('Category slugs updated successfully!');
    }
}
