<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('freelancer_profiles', function (Blueprint $table) {
            $table->string('github_url')->nullable()->after('hourly_rate');
            $table->string('portfolio_url')->nullable()->after('github_url');
            $table->string('linkedin_url')->nullable()->after('portfolio_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('freelancer_profiles', function (Blueprint $table) {
            $table->dropColumn(['github_url', 'portfolio_url', 'linkedin_url']);
        });
    }
};
