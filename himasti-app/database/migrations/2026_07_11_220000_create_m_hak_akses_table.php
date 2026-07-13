<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('m_hak_akses')) {
            return;
        }

        Schema::create('m_hak_akses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->index();
            $table->text('akses');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Non-destruktif: tabel lama tidak dihapus otomatis.
    }
};
