<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = $request->user()
            ->notifications()
            ->limit(40)
            ->get()
            ->map(fn (DatabaseNotification $notification): array => [
                'id' => $notification->id,
                'type' => $notification->data['type'] ?? $notification->type,
                'message' => $notification->data['message'] ?? '',
                'url' => $notification->data['url'] ?? null,
                'read_at' => $notification->read_at?->toIso8601String(),
                'created_at' => $notification->created_at?->toIso8601String(),
            ]);

        $request->user()->unreadNotifications->markAsRead();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()->notifications()->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Notifications cleared.')]);

        return back();
    }
}
