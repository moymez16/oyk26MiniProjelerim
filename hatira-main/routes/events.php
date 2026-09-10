<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\Events\BulkParticipantController;
use App\Http\Controllers\Events\EventCoverController;
use App\Http\Controllers\Events\EventLeaveController;
use App\Http\Controllers\Events\EventOwnershipController;
use App\Http\Controllers\Events\EventStatusController;
use App\Http\Controllers\Events\ImpressionController;
use App\Http\Controllers\Events\ImpressionHideController;
use App\Http\Controllers\Events\MemoryController;
use App\Http\Controllers\Events\ModerationController;
use App\Http\Controllers\Events\ParticipantController;
use App\Http\Controllers\Events\ParticipantInvitationController;
use App\Http\Controllers\Events\ParticipantProfileController;
use App\Http\Controllers\Events\ProfileController;
use App\Http\Controllers\Events\ReportController;
use App\Http\Controllers\Events\YearbookController as EventYearbookController;
use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

Route::get('invitations/{token}', [InvitationController::class, 'show'])
    ->name('invitations.show');

Route::post('invitations/{token}', [InvitationController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('invitations.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('events', EventController::class);

    Route::get('events/{event}/participants', [ParticipantController::class, 'index'])
        ->name('events.participants.index')
        ->scopeBindings();

    Route::post('events/{event}/participants', [ParticipantController::class, 'store'])
        ->name('events.participants.store')
        ->scopeBindings();

    Route::delete('events/{event}/participants/{participant}', [ParticipantController::class, 'destroy'])
        ->name('events.participants.destroy')
        ->scopeBindings();

    Route::post('events/{event}/participants/bulk', [BulkParticipantController::class, 'store'])
        ->name('events.participants.bulk.store')
        ->scopeBindings();

    Route::post('events/{event}/participants/{participant}/invitation', [ParticipantInvitationController::class, 'store'])
        ->name('events.participants.invitation.store')
        ->scopeBindings();

    Route::delete('events/{event}/participants/{participant}/invitation', [ParticipantInvitationController::class, 'destroy'])
        ->name('events.participants.invitation.destroy')
        ->scopeBindings();

    Route::get('events/{event}/profile', [ProfileController::class, 'edit'])
        ->name('events.profile.edit')
        ->scopeBindings();

    Route::put('events/{event}/profile', [ProfileController::class, 'update'])
        ->name('events.profile.update')
        ->scopeBindings();

    Route::get('events/{event}/participants/{participant}', [ParticipantProfileController::class, 'show'])
        ->name('events.participants.show')
        ->scopeBindings();

    Route::put('events/{event}/cover', [EventCoverController::class, 'update'])
        ->name('events.cover.update')
        ->scopeBindings();

    Route::delete('events/{event}/cover', [EventCoverController::class, 'destroy'])
        ->name('events.cover.destroy')
        ->scopeBindings();

    Route::get('events/{event}/impressions', [ImpressionController::class, 'index'])
        ->name('events.impressions.index')
        ->scopeBindings();

    Route::post('events/{event}/participants/{participant}/impressions', [ImpressionController::class, 'store'])
        ->name('events.impressions.store')
        ->scopeBindings();

    Route::put('events/{event}/impressions/{impression}', [ImpressionController::class, 'update'])
        ->name('events.impressions.update')
        ->scopeBindings();

    Route::delete('events/{event}/impressions/{impression}', [ImpressionController::class, 'destroy'])
        ->name('events.impressions.destroy')
        ->scopeBindings();

    Route::get('events/{event}/memories', [MemoryController::class, 'index'])
        ->name('events.memories.index')
        ->scopeBindings();

    Route::post('events/{event}/memories', [MemoryController::class, 'store'])
        ->name('events.memories.store')
        ->scopeBindings();

    Route::put('events/{event}/memories/{memory}', [MemoryController::class, 'update'])
        ->name('events.memories.update')
        ->scopeBindings();

    Route::delete('events/{event}/memories/{memory}', [MemoryController::class, 'destroy'])
        ->name('events.memories.destroy')
        ->scopeBindings();

    Route::post('events/{event}/impressions/{impression}/report', [ReportController::class, 'storeImpression'])
        ->name('events.impressions.report')
        ->scopeBindings();

    Route::post('events/{event}/memories/{memory}/report', [ReportController::class, 'storeMemory'])
        ->name('events.memories.report')
        ->scopeBindings();

    Route::post('events/{event}/impressions/{impression}/hide', [ImpressionHideController::class, 'store'])
        ->name('events.impressions.hide')
        ->scopeBindings();

    Route::get('events/{event}/moderation', [ModerationController::class, 'index'])
        ->name('events.moderation.index')
        ->scopeBindings();

    Route::put('events/{event}/moderation/{report}', [ModerationController::class, 'update'])
        ->name('events.moderation.update')
        ->scopeBindings();

    Route::put('events/{event}/status', [EventStatusController::class, 'update'])
        ->name('events.status.update')
        ->scopeBindings();

    Route::put('events/{event}/owner', [EventOwnershipController::class, 'update'])
        ->name('events.owner.update')
        ->scopeBindings();

    Route::delete('events/{event}/participation', [EventLeaveController::class, 'destroy'])
        ->name('events.leave')
        ->scopeBindings();

    Route::post('events/{event}/participants/{participant}/leave', [EventLeaveController::class, 'store'])
        ->name('events.participants.leave')
        ->scopeBindings();

    Route::get('events/{event}/yearbook', [EventYearbookController::class, 'show'])
        ->name('events.yearbook.show')
        ->scopeBindings();
});
