export interface IBooking {
    id: string;
    artist_id: string;
    event_id: string;
    status: "pending" | "confirmed" | "canceled";
    created_at?: Date;
    updated_at?: Date;
}
