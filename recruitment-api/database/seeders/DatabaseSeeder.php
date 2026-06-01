<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\JobOpening;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Data Cabang
        $branch1 = Branch::create([
            'name' => 'Cabang Jakarta Selatan',
            'location' => 'Jl. Sudirman No. 123, Jakarta'
        ]);

        $branch2 = Branch::create([
            'name' => 'Cabang Bandung',
            'location' => 'Jl. Dago No. 45, Bandung'
        ]);

        // 2. Buat User Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@rekrutmen.com',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
        ]);

        // 3. Buat User HRD
        User::create([
            'name' => 'Budi HRD',
            'email' => 'hrd@rekrutmen.com',
            'password' => Hash::make('password123'),
            'role' => 'HRD',
        ]);

        // 4. Buat User Pelamar (Contoh)
        User::create([
            'name' => 'Siti Pelamar',
            'email' => 'siti@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'PELAMAR',
        ]);

        // 5. Buat Lowongan Pekerjaan
        JobOpening::create([
            'title' => 'English Tutor for Kids',
            'description' => 'Mengajar anak-anak usia 5-12 tahun dengan metode fun learning.',
            'requirements' => 'S1 Pendidikan Bahasa Inggris, Ceria, Berpengalaman min 1 tahun.',
            'branch_id' => $branch1->id,
            'status' => 'open',
        ]);

        JobOpening::create([
            'title' => 'IELTS Preparation Coach',
            'description' => 'Membantu siswa mencapai skor IELTS minimal 7.0.',
            'requirements' => 'Skor IELTS pribadi min 8.0, Memahami teknik scoring IELTS.',
            'branch_id' => $branch2->id,
            'status' => 'open',
        ]);

        $this->command->info('Seed data berhasil dimasukkan!');
    }
}