<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\DivisionMemberController;
use App\Http\Controllers\Admin\DocumentationController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\InstagramPostController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\OrganizationProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\WorkProgramController;
use App\Http\Controllers\App\HakAkses\HakAksesController;
use App\Http\Controllers\App\Home\HomeController;
use App\Http\Controllers\App\Todo\TodoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Public\LandingPageController;
use App\Http\Controllers\Public\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:req-limit', 'handle.inertia'])->group(function () {
    // Public Routes
    Route::get('/', [LandingPageController::class, 'index'])->name('public.home');
    Route::get('/berita', [PublicContentController::class, 'newsIndex'])->name('public.news.index');
    Route::get('/berita/{slug}', [PublicContentController::class, 'newsDetail'])->name('public.news.show');
    Route::get('/kegiatan', [PublicContentController::class, 'eventIndex'])->name('public.event.index');
    Route::get('/kegiatan/{slug}', [PublicContentController::class, 'eventDetail'])->name('public.event.show');
    Route::get('/dokumentasi', [PublicContentController::class, 'documentationIndex'])->name('public.documentation.index');
    Route::get('/dokumentasi/{slug}', [PublicContentController::class, 'documentationDetail'])->name('public.documentation.show');
    Route::get('/divisi', [PublicContentController::class, 'divisionIndex'])->name('public.division.index');
    Route::get('/divisi/{slug}', [PublicContentController::class, 'divisionDetail'])->name('public.division.show');
    Route::get('/program-kerja', [PublicContentController::class, 'workProgramIndex'])->name('work-programs.index');
    Route::get('/program-kerja/{slug}', [PublicContentController::class, 'workProgramDetail'])->name('work-programs.show');
    Route::get('/layanan', [PublicContentController::class, 'serviceIndex'])->name('public.service.index');
    Route::redirect('/profil', '/')->name('public.profile');
    Route::redirect('/event', '/kegiatan')->name('legacy.public.event.index');
    Route::get('/event/{slug}', function (string $slug) {
        return redirect()->route('public.event.show', ['slug' => $slug]);
    })->name('legacy.public.event.show');

    // SSO Routes
    Route::group(['prefix' => 'sso'], function () {
        Route::get('/callback', [AuthController::class, 'ssoCallback'])->name('sso.callback');
    });

    // Authentication Routes
    Route::prefix('auth')->group(function () {
        // Login Routes
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login-check', [AuthController::class, 'postLoginCheck'])->name('auth.login-check');
        Route::post('/login-post', [AuthController::class, 'postLogin'])->name('auth.login-post');

        // Logout Route
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');

        // TOTP Routes
        Route::get('/totp', [AuthController::class, 'totp'])->name('auth.totp');
        Route::post('/totp-post', [AuthController::class, 'postTotp'])->name('auth.totp-post');
    });

    // Protected Routes
    Route::group(['middleware' => 'check.auth'], function () {
        Route::get('/admin', function () {
            return redirect()->route('home');
        })->name('admin.index');
        Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('home');
        Route::get('/dashboard', [HomeController::class, 'index'])->name('legacy.dashboard');

        // Hak Akses Routes
        Route::prefix('admin/hak-akses')->group(function () {
            Route::get('/', [HakAksesController::class, 'index'])->name('hak-akses');
            Route::post('/change', [HakAksesController::class, 'postChange'])->name('hak-akses.change-post');
            Route::post('/delete', [HakAksesController::class, 'postDelete'])->name('hak-akses.delete-post');
            Route::post('/delete-selected', [HakAksesController::class, 'postDeleteSelected'])->name('hak-akses.delete-selected-post');
        });
        Route::get('/hak-akses', function () {
            return redirect()->route('hak-akses');
        })->name('legacy.hak-akses');

        // Todo Routes
        Route::prefix('admin/todo')->group(function () {
            Route::get('/', [TodoController::class, 'index'])->name('todo');
            Route::post('/change', [TodoController::class, 'postChange'])->name('todo.change-post');
            Route::post('/delete', [TodoController::class, 'postDelete'])->name('todo.delete-post');
        });
        Route::get('/todo', function () {
            return redirect()->route('todo');
        })->name('legacy.todo');

        Route::get('/admin/profil-organisasi', [OrganizationProfileController::class, 'edit'])->name('admin.organization-profile.edit');
        Route::put('/admin/profil-organisasi', [OrganizationProfileController::class, 'update'])->name('admin.organization-profile.update');

        Route::post('/admin/banner/reorder', [BannerController::class, 'reorder'])->name('admin.banner.reorder');
        Route::resource('/admin/banner', BannerController::class)->names('admin.banner')->except('show');
        Route::resource('/admin/berita', NewsController::class)->names('admin.news')->parameters(['berita' => 'news'])->except('show');
        Route::resource('/admin/event', EventController::class)->names('admin.event')->parameters(['event' => 'event'])->except('show');
        Route::post('/admin/divisi/reorder', [DivisionController::class, 'reorder'])->name('admin.division.reorder');
        Route::resource('/admin/divisi', DivisionController::class)->names('admin.division')->parameters(['divisi' => 'division'])->except('show');
        Route::post('/admin/anggota-divisi/reorder', [DivisionMemberController::class, 'reorder'])->name('admin.division-member.reorder');
        Route::resource('/admin/anggota-divisi', DivisionMemberController::class)->names('admin.division-member')->parameters(['anggota-divisi' => 'divisionMember'])->except('show');
        Route::post('/admin/program-kerja/reorder', [WorkProgramController::class, 'reorder'])->name('admin.work-programs.reorder');
        Route::resource('/admin/program-kerja', WorkProgramController::class)->names('admin.work-programs')->parameters(['program-kerja' => 'workProgram'])->except('show');
        Route::resource('/admin/dokumentasi', DocumentationController::class)->names('admin.documentation')->parameters(['dokumentasi' => 'documentation'])->except('show');
        Route::post('/admin/instagram-post/reorder', [InstagramPostController::class, 'reorder'])->name('admin.instagram-post.reorder');
        Route::resource('/admin/instagram-post', InstagramPostController::class)->names('admin.instagram-post')->parameters(['instagram-post' => 'instagramPost'])->except('show');
        Route::post('/admin/layanan/reorder', [ServiceController::class, 'reorder'])->name('admin.service.reorder');
        Route::resource('/admin/layanan', ServiceController::class)->names('admin.service')->parameters(['layanan' => 'service'])->except('show');
        Route::get('/admin/pengaturan', [SettingController::class, 'edit'])->name('admin.settings.edit');
        Route::put('/admin/pengaturan', [SettingController::class, 'update'])->name('admin.settings.update');
    });
});
