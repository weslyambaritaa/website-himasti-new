<?php

namespace Tests\Feature\Controllers\Admin;

use App\Http\Controllers\Admin\BannerController;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Http\Requests\Admin\UpdateBannerRequest;
use App\Models\Banner;
use App\Services\BannerService;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class BannerControllerAuthorizationTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
    }

    #[Test]
    public function akun_dengan_akses_banner_dapat_mengakses_seluruh_crud_banner(): void
    {
        $controller = app(BannerController::class);
        $auth = (object) [
            'id' => 'user-banner',
            'username' => 'ifs-banner',
            'akses' => ['Banner'],
        ];

        $indexRequest = Request::create('/admin/banner', 'GET');
        $indexRequest->attributes->set('auth', $auth);
        $this->assertInstanceOf(Response::class, $controller->index($indexRequest));

        $createRequest = Request::create('/admin/banner/create', 'GET');
        $createRequest->attributes->set('auth', $auth);
        $this->assertInstanceOf(Response::class, $controller->create($createRequest));

        $storeRequest = StoreBannerRequest::create('/admin/banner', 'POST', [
            'title' => 'Banner Baru',
            'subtitle' => 'Subtitle',
            'button_text' => 'Lihat',
            'button_url' => 'https://himasti.test',
            'order_number' => 1,
            'is_shown' => true,
        ], [], [
            'image' => UploadedFile::fake()->image('banner.jpg'),
        ]);
        $storeRequest->attributes->set('auth', $auth);
        $storeRequest->setContainer($this->app);
        $storeRequest->setRedirector($this->app['redirect']);
        $storeRequest->validateResolved();
        $storeResponse = $controller->store($storeRequest);
        $this->assertEquals(302, $storeResponse->getStatusCode());

        $banner = Banner::query()->firstOrFail();

        $editRequest = Request::create("/admin/banner/{$banner->id}/edit", 'GET');
        $editRequest->attributes->set('auth', $auth);
        $this->assertInstanceOf(Response::class, $controller->edit($editRequest, $banner));

        $updateRequest = UpdateBannerRequest::create("/admin/banner/{$banner->id}", 'POST', [
            '_method' => 'PUT',
            'title' => 'Banner Update',
            'subtitle' => 'Subtitle Update',
            'button_text' => 'Cek',
            'button_url' => 'https://himasti.test/update',
            'order_number' => 2,
            'is_shown' => false,
        ], [], [
            'image' => UploadedFile::fake()->image('banner-update.jpg'),
        ]);
        $updateRequest->attributes->set('auth', $auth);
        $updateRequest->setContainer($this->app);
        $updateRequest->setRedirector($this->app['redirect']);
        $updateRequest->validateResolved();
        $updateResponse = $controller->update($updateRequest, $banner->fresh());
        $this->assertEquals(302, $updateResponse->getStatusCode());

        $destroyRequest = Request::create("/admin/banner/{$banner->id}", 'DELETE');
        $destroyRequest->attributes->set('auth', $auth);
        $destroyResponse = $controller->destroy($destroyRequest, $banner->fresh());
        $this->assertEquals(302, $destroyResponse->getStatusCode());
    }

    #[Test]
    public function akun_dengan_admin_tetapi_tanpa_banner_tidak_dapat_membuka_banner(): void
    {
        $request = Request::create('/admin/banner', 'GET');
        $request->attributes->set('auth', (object) [
            'id' => 'user-admin',
            'username' => 'ifs-admin',
            'akses' => ['Admin'],
        ]);

        try {
            app(BannerController::class)->index($request);
            $this->fail('Banner seharusnya menghasilkan 403 untuk Admin tanpa akses Banner.');
        } catch (HttpException $exception) {
            $this->assertSame(403, $exception->getStatusCode());
        }
    }

    #[Test]
    public function banner_tanpa_input_urutan_otomatis_diletakkan_di_akhir_dan_bisa_diurutkan_ulang(): void
    {
        $service = app(BannerService::class);

        $first = Banner::query()->create([
            'title' => 'Banner Pertama',
            'order_number' => 1,
            'is_shown' => true,
        ]);

        $second = $service->create([
            'title' => 'Banner Kedua',
            'is_shown' => true,
        ], null);

        $this->assertSame(2, $second->order_number);

        $service->reorder([$second->id, $first->id]);

        $this->assertSame(1, $second->fresh()->order_number);
        $this->assertSame(2, $first->fresh()->order_number);
    }
}
