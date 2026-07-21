<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('organization_profiles')) {
            return;
        }

        Schema::table('organization_profiles', function (Blueprint $table) {
            if (! Schema::hasColumn('organization_profiles', 'tagline')) {
                $table->string('tagline')->nullable()->after('short_name');
            }

            if (! Schema::hasColumn('organization_profiles', 'cabinet_name')) {
                $table->string('cabinet_name')->nullable()->after('tagline');
            }

            if (! Schema::hasColumn('organization_profiles', 'period')) {
                $table->string('period')->nullable()->after('cabinet_name');
            }
        });
    }

    public function down(): void
    {
        // Perubahan non-destruktif ini tidak dihapus otomatis.
    }
};
