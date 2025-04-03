export interface IArtistProfile {
    id: string; // UUID
    userId: string; // Foreign key → User
    stageName: string;
    bio?: string;
    genres: string[]; // Array of genres
    availability: string[]; // Array of available dates
    created_at?: Date;
    updated_at?: Date;
}