<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Requests\Admin\StoreInstagramPostRequest;
use App\Models\InstagramPost;
use App\Services\InstagramPostService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class InstagramPostControllerTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    #[Test]
    public function create_postingan_instagram_berhasil_dan_gambar_tersimpan(): void
    {
        $post = app(InstagramPostService::class)->create([
            'title' => 'Postingan Baru',
            'instagram_url' => 'https://instagram.com/p/baru',
            'order_number' => 1,
            'is_shown' => true,
            'published_at' => '2026-07-01 10:00:00',
        ], UploadedFile::fake()->image('post.jpg'));

        $this->assertSame('Postingan Baru', $post->title);
        Storage::disk('public')->assertExists($post->image);
    }

    #[Test]
    public function update_postingan_instagram_membersihkan_gambar_lama(): void
    {
        $oldImage = UploadedFile::fake()->image('old.jpg')->store('instagram-posts', 'public');
        $post = InstagramPost::query()->create([
            'title' => 'Postingan Lama',
            'instagram_url' => 'https://instagram.com/p/lama',
            'image' => $oldImage,
            'order_number' => 1,
            'is_shown' => false,
            'published_at' => now(),
        ]);

        $updated = app(InstagramPostService::class)->update($post, [
            'title' => 'Postingan Baru',
            'instagram_url' => 'https://instagram.com/p/baru',
            'order_number' => 2,
            'is_shown' => true,
            'published_at' => '2026-07-02 10:00:00',
        ], UploadedFile::fake()->image('new.jpg'));

        $this->assertSame('Postingan Baru', $updated->title);
        $this->assertTrue($updated->is_shown);
        Storage::disk('public')->assertMissing($oldImage);
        Storage::disk('public')->assertExists($updated->image);
    }

    #[Test]
    public function delete_postingan_instagram_membersihkan_gambar(): void
    {
        $image = UploadedFile::fake()->image('hapus.jpg')->store('instagram-posts', 'public');
        $post = InstagramPost::query()->create([
            'title' => 'Postingan Hapus',
            'instagram_url' => 'https://instagram.com/p/hapus',
            'image' => $image,
            'order_number' => 1,
            'is_shown' => true,
        ]);

        app(InstagramPostService::class)->delete($post);

        Storage::disk('public')->assertMissing($image);
        $this->assertDatabaseMissing('instagram_posts', ['id' => $post->id]);
    }

    #[Test]
    public function validasi_url_postingan_instagram_berfungsi(): void
    {
        $request = new StoreInstagramPostRequest;
        $validator = validator([
            'instagram_url' => 'bukan-url',
            'is_shown' => 'foo',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('instagram_url', $validator->errors()->toArray());
        $this->assertArrayHasKey('is_shown', $validator->errors()->toArray());
    }

    #[Test]
    public function filter_status_tampil_berfungsi(): void
    {
        InstagramPost::query()->create([
            'title' => 'Ditampilkan',
            'instagram_url' => 'https://instagram.com/p/tampil',
            'order_number' => 1,
            'is_shown' => true,
        ]);
        InstagramPost::query()->create([
            'title' => 'Disembunyikan',
            'instagram_url' => 'https://instagram.com/p/sembunyi',
            'order_number' => 2,
            'is_shown' => false,
        ]);

        $result = app(InstagramPostService::class)->paginate([
            'is_shown' => 'true',
        ]);

        $this->assertCount(1, $result->items());
        $this->assertSame('Ditampilkan', $result->items()[0]->title);
    }

    #[Test]
    public function postingan_instagram_hidden_tidak_tampil_di_landing_page(): void
    {
        InstagramPost::query()->create([
            'title' => 'Postingan Tampil',
            'instagram_url' => 'https://instagram.com/p/tampil',
            'order_number' => 1,
            'is_shown' => true,
        ]);
        InstagramPost::query()->create([
            'title' => 'Postingan Hidden',
            'instagram_url' => 'https://instagram.com/p/hidden',
            'order_number' => 2,
            'is_shown' => false,
        ]);

        $this->get(route('public.home'))
            ->assertOk()
            ->assertSee('Postingan Tampil')
            ->assertDontSee('Postingan Hidden');
    }

    #[Test]
    public function postingan_instagram_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $service = app(InstagramPostService::class);

        $first = InstagramPost::query()->create([
            'title' => 'Postingan Pertama',
            'instagram_url' => 'https://instagram.com/p/pertama',
            'order_number' => 1,
            'is_shown' => true,
        ]);

        $second = $service->create([
            'title' => 'Postingan Kedua',
            'instagram_url' => 'https://instagram.com/p/kedua',
            'is_shown' => true,
        ], null);

        $this->assertSame(2, $second->order_number);

        $service->reorder([$second->id, $first->id]);

        $this->assertSame(1, $second->fresh()->order_number);
        $this->assertSame(2, $first->fresh()->order_number);
    }
}
