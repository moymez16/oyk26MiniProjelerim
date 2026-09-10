export type EventSummary = {
    ulid: string;
    name: string;
    description: string;
    long_description: string | null;
    location: string | null;
    cover_url: string | null;
    starts_on: string;
    ends_on: string | null;
    status: string;
    status_label: string;
    is_owner: boolean;
    can_manage_participants: boolean;
    can_moderate?: boolean;
    accepts_new_content?: boolean;
    allows_content_after_close?: boolean;
    viewer_participant_ulid?: string | null;
    participants_count: number;
};

export type ParticipantSummary = {
    ulid: string;
    name: string;
    email: string | null;
    role: string;
    status: string;
    status_label?: string;
    is_owner: boolean;
    photo_url?: string | null;
    can_delete?: boolean;
    can_invite?: boolean;
    can_revoke?: boolean;
};

export type ProfileLink = {
    label: string;
    url: string;
};

export type EventDetail = Omit<EventSummary, 'participants_count'> & {
    participants: ParticipantSummary[];
};

export type EventFormValues = {
    ulid: string;
    name: string;
    description: string;
    long_description: string | null;
    location: string | null;
    cover_url?: string | null;
    starts_on: string;
    ends_on: string | null;
    status?: string;
    allows_content_after_close?: boolean;
};
