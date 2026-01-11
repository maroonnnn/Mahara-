<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {--email=} {--password=} {--name=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user account';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $password = $this->option('password');
        $name = $this->option('name');

        // If not provided via options, ask interactively
        if (!$name) {
            $name = $this->ask('Enter admin name', 'Admin');
        }

        if (!$email) {
            $email = $this->ask('Enter admin email');
        }

        // Validate email
        $validator = Validator::make(['email' => $email], [
            'email' => 'required|email|unique:users,email',
        ]);

        if ($validator->fails()) {
            $this->error('Invalid email or email already exists!');
            return 1;
        }

        if (!$password) {
            $password = $this->secret('Enter admin password (min 8 characters)');
            $passwordConfirmation = $this->secret('Confirm password');

            if ($password !== $passwordConfirmation) {
                $this->error('Passwords do not match!');
                return 1;
            }

            if (strlen($password) < 8) {
                $this->error('Password must be at least 8 characters!');
                return 1;
            }
        }

        // Check if admin already exists
        if (User::where('email', $email)->exists()) {
            $this->error('User with this email already exists!');
            return 1;
        }

        // Create admin user
        try {
            $admin = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);

            // Create wallet for admin
            Wallet::create([
                'user_id' => $admin->id,
                'balance' => 0,
            ]);

            $this->info('✅ Admin user created successfully!');
            $this->table(
                ['Field', 'Value'],
                [
                    ['ID', $admin->id],
                    ['Name', $admin->name],
                    ['Email', $admin->email],
                    ['Role', $admin->role],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            $this->error('Failed to create admin user: ' . $e->getMessage());
            return 1;
        }
    }
}
