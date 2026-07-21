<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('organization_profiles')) {
            return;
        }

        Schema::create('organization_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('short_name')->nullable();
            $table->text('description')->nullable();
            $table->text('history')->nullable();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->string('logo')->nullable();
            $table->text('chairman_message')->nullable();
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Tabel singleton tidak dihapus otomatis pada jalur non-destruktif.
    }
};
