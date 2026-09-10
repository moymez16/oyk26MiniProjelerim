<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateNotificationPreferenceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPreferenceController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('settings/notifications', [
            'preferences' => [
                'new_impression' => $user->wantsNotification('new_impression'),
                'new_memory' => $user->wantsNotification('new_memory'),
                'new_participant' => $user->wantsNotification('new_participant'),
            ],
        ]);
    }

    public function update(UpdateNotificationPreferenceRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->forceFill([
            'notification_preferences' => [
                'new_impression' => $request->boolean('new_impression'),
                'new_memory' => $request->boolean('new_memory'),
                'new_participant' => $request->boolean('new_participant'),
            ],
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Notification preferences saved.')]);

        return back();
    }
}
