import { EventRepository } from "../repositories/event.repository";
import { CreateEventInput, UpdateEventInput } from "../schemas/event.schema";
import { IEvent } from "../models/Event";

export class EventService {
    private eventRepo: EventRepository;

    constructor() {
        this.eventRepo = new EventRepository();
    }

    async createEvent(organizerId: string, data: CreateEventInput): Promise<IEvent> {
        try {
            console.log('Creating event with data:', { organizerId, ...data });
            
            if (!organizerId) {
                throw new Error('organizerId is required');
            }

            const event = await this.eventRepo.create({
                organizerId,
                name: data.name,
                description: data.description,
                location: data.location,
                date: new Date(data.date)
            });

            if (!event) {
                throw new Error('Failed to create event: No data returned');
            }

            console.log('Event created successfully:', event);
            return event;
        } catch (error) {
            // Log the raw error first
            console.error('Raw error:', error);
            
            console.error('🔴 Create event error:', {
                name: error instanceof Error ? error.name : typeof error,
                message: error instanceof Error ? error.message : JSON.stringify(error),
                stack: error instanceof Error ? error.stack : undefined,
                data: { organizerId, ...data }
            });
            
            // Always throw an Error object
            if (error instanceof Error) {
                throw error;
            }
            
            throw new Error(`Failed to create event: ${JSON.stringify(error)}`);
        }
    }

    async getEvent(id: string): Promise<IEvent> {
        const event = await this.eventRepo.findById(id);
        if (!event) {
            throw new Error("Event not found");
        }
        return event;
    }

    async getAllEvents(): Promise<IEvent[]> {
        return await this.eventRepo.findAll();
    }

    async updateEvent(id: string, organizerId: string, input: UpdateEventInput): Promise<IEvent> {
        const event = await this.eventRepo.findById(id);
        if (!event) {
            throw new Error("Event not found");
        }

        // Ensure organizer owns the event
        if (event.organizerId !== organizerId) {
            throw new Error("Unauthorized");
        }

        const updatedEvent = await this.eventRepo.update(id, {
            ...input,
            date: input.date ? new Date(input.date) : undefined
        });

        if (!updatedEvent) {
            throw new Error("Failed to update event");
        }

        return updatedEvent;
    }

    async deleteEvent(id: string, organizerId: string): Promise<void> {
        const event = await this.eventRepo.findById(id);
        if (!event) {
            throw new Error("Event not found");
        }

        // Ensure organizer owns the event
        if (event.organizerId !== organizerId) {
            throw new Error("Unauthorized");
        }

        await this.eventRepo.delete(id);
    }
}
