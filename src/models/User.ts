export interface IUser {
    id: string;
    email: string;
    password: string;
    role: 'artist' | 'organizer';
    created_at: string;
    updated_at: string;
}
