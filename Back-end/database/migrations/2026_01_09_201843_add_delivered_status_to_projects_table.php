<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table with the new enum values
        // For MySQL, we can use MODIFY COLUMN
        if (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't enforce enums, so we just need to ensure the column accepts the new value
            // The application code will handle the validation
            // No migration needed for SQLite as it doesn't enforce enum constraints
        } else {
            // MySQL/MariaDB
            DB::statement("ALTER TABLE projects MODIFY COLUMN status ENUM('open', 'in_progress', 'delivered', 'completed', 'cancelled') DEFAULT 'open'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            // MySQL/MariaDB - Revert back to original enum values
            DB::statement("ALTER TABLE projects MODIFY COLUMN status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open'");
        }
    }
};
