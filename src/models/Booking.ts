export interface IBooking {
    id: string; // UUID
    artistId: string; // Foreign key → User
    eventId: string; // Foreign key → Event
    status: "pending" | "confirmed" | "canceled";
    createdAt?: Date;
    updatedAt?: Date;
}