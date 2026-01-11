<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        $adminEmail = 'admin@mahara.com';
        
        if (User::where('email', $adminEmail)->exists()) {
            $this->command->info('Admin user already exists!');
            return;
        }

        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => $adminEmail,
            'password' => Hash::make('admin123'), // Default password - change this!
            'role' => 'admin',
        ]);

        // Create wallet for admin
        Wallet::create([
            'user_id' => $admin->id,
            'balance' => 0,
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: ' . $adminEmail);
        $this->command->info('Password: admin123');
        $this->command->warn('⚠️  Please change the password after first login!');
    }
}
