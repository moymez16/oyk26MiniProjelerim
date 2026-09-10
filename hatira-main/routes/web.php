<?php

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\YearbookController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::delete('notifications', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');

    Route::get('yearbook', [YearbookController::class, 'show'])
        ->name('yearbook.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/events.php';
