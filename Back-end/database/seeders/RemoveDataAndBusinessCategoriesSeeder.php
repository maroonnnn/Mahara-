<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class RemoveDataAndBusinessCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // Remove Data category
        $dataCategory = Category::where('slug', 'data')->first();
        if ($dataCategory) {
            // Check if it has projects
            $projectsCount = $dataCategory->projects()->count();
            if ($projectsCount > 0) {
                $this->command->warn("Category 'Data' has {$projectsCount} projects. Cannot delete.");
            } else {
                $dataCategory->delete();
                $this->command->info("Deleted category: Data");
            }
        }

        // Remove Business category
        $businessCategory = Category::where('slug', 'business')->first();
        if ($businessCategory) {
            // Check if it has projects
            $projectsCount = $businessCategory->projects()->count();
            if ($projectsCount > 0) {
                $this->command->warn("Category 'Business' has {$projectsCount} projects. Cannot delete.");
            } else {
                $businessCategory->delete();
                $this->command->info("Deleted category: Business");
            }
        }

        $this->command->info('Data and Business categories removal completed!');
    }
}
