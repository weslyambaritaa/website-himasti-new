<?php

namespace Tests\Unit\Helper;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HimastiModelsSeedCompatibilityTest extends TestCase
{
    #[Test]
    public function seeder_admin_lama_pada_himasti_models_tetap_tidak_berubah(): void
    {
        $seedFile = dirname(__DIR__, 4).DIRECTORY_SEPARATOR.'himasti-models'.DIRECTORY_SEPARATOR.'scripts'.DIRECTORY_SEPARATOR.'seed.ts';

        $this->assertFileExists($seedFile);

        $content = file_get_contents($seedFile);

        $this->assertStringContainsString('akses: "Admin"', $content);
        $this->assertStringContainsString('const user_id = "32035507-89b7-448e-96a0-af576139a1f6";', $content);
    }
}
