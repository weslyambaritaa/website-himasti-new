<?php

namespace Tests\Feature\Routes;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PublicRouteRedirectTest extends TestCase
{
    use DatabaseMigrations;

    #[Test]
    public function route_event_redirect_ke_kegiatan(): void
    {
        $this->get('/event')
            ->assertRedirect('/kegiatan');
    }

    #[Test]
    public function route_event_slug_redirect_mempertahankan_slug(): void
    {
        $this->get('/event/seminar-teknologi')
            ->assertRedirect('/kegiatan/seminar-teknologi');
    }

    #[Test]
    public function route_profil_redirect_ke_root(): void
    {
        $this->get('/profil')
            ->assertRedirect('/');
    }
}
