export interface IEvent {
    id: string; // UUID
    organizerId: string; // Foreign key → User
    name: string;
    description: string;
    location: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}