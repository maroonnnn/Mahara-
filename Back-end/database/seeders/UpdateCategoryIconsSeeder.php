<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class UpdateCategoryIconsSeeder extends Seeder
{
    public function run(): void
    {
        $icons = [
            'graphics-design' => '🎨',
            'programming-tech' => '💻',
            'digital-marketing' => '📈',
            'video-animation' => '🎬',
            'writing-translation' => '✍️',
            'music-audio' => '🎵',
            'business' => '💼',
            'data' => '📊',
        ];

        foreach ($icons as $slug => $icon) {
            Category::where('slug', $slug)->update([
                'icon' => $icon,
                'is_active' => true
            ]);
        }

        $this->command->info('Category icons updated successfully!');
    }
}

