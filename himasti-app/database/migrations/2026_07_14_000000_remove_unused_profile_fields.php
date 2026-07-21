<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('organization_profiles')) {
            Schema::table('organization_profiles', function (Blueprint $table) {
                $columns = array_values(array_filter(
                    ['history', 'chairman_message', 'youtube_url'],
                    fn (string $column) => Schema::hasColumn('organization_profiles', $column)
                ));

                if ($columns !== []) {
                    $table->dropColumn($columns);
                }
            });
        }

        if (Schema::hasTable('settings')) {
            DB::table('settings')->where('key', 'youtube_url')->delete();
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('organization_profiles')) {
            return;
        }

        Schema::table('organization_profiles', function (Blueprint $table) {
            if (! Schema::hasColumn('organization_profiles', 'history')) {
                $table->text('history')->nullable();
            }

            if (! Schema::hasColumn('organization_profiles', 'chairman_message')) {
                $table->text('chairman_message')->nullable();
            }

            if (! Schema::hasColumn('organization_profiles', 'youtube_url')) {
                $table->string('youtube_url')->nullable();
            }
        });
    }
};
