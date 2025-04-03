import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import { createEventSchema, updateEventSchema } from "../schemas/event.schema";
import { ZodError } from "zod";

export class EventController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            // Log the incoming request
            console.log('Creating event with request:', {
                body: req.body,
                user: req.user
            });

            const validatedData = createEventSchema.parse(req.body);
            const organizerId = req.user?.id;

            if (!organizerId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            const event = await this.eventService.createEvent(organizerId, validatedData);
            res.status(201).json({ message: "Event created successfully", event });
        } catch (error) {
            // Log the raw error first
            console.error('Raw controller error:', error);

            console.error('🔴 Controller error:', {
                name: error instanceof Error ? error.name : typeof error,
                message: error instanceof Error ? error.message : JSON.stringify(error),
                stack: error instanceof Error ? error.stack : undefined,
                body: req.body,
                userId: req.user?.id
            });

            if (error instanceof ZodError) {
                res.status(400).json({ 
                    error: "Validation error", 
                    details: error.errors 
                });
                return;
            }

            // Handle Supabase errors
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const supabaseError = error as { code: string; message?: string };
                if (supabaseError.code === '23505') { // Unique violation
                    res.status(409).json({ error: "Event already exists" });
                    return;
                }
                if (supabaseError.code === '23503') { // Foreign key violation
                    res.status(400).json({ error: "Invalid organizer ID" });
                    return;
                }
            }

            // Generic error response
            res.status(500).json({ 
                error: "Failed to create event",
                details: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    };

    getAllEvents = async (_req: Request, res: Response): Promise<void> => {
        try {
            const events = await this.eventService.getAllEvents();
            res.json(events);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch events" });
        }
    };

    getEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const event = await this.eventService.getEvent(req.params.id);
            res.json(event);
        } catch (error) {
            if (error instanceof Error && error.message === "Event not found") {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Failed to fetch event" });
        }
    };

    updateEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const organizerId = req.user?.id;
            const validatedData = updateEventSchema.parse(req.body);

            if (!organizerId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            const event = await this.eventService.updateEvent(id, organizerId, validatedData);
            res.json({ message: "Event updated successfully", event });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error) {
                if (error.message === "Event not found") {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === "Unauthorized") {
                    res.status(403).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: "Failed to update event" });
        }
    };

    deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const organizerId = req.user?.id;

            if (!organizerId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            await this.eventService.deleteEvent(id, organizerId);
            res.json({ message: "Event deleted successfully" });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Event not found") {
                    res.status(404).json({ error: error.message });
                    return;
                }
                if (error.message === "Unauthorized") {
                    res.status(403).json({ error: error.message });
                    return;
                }
            }
            res.status(500).json({ error: "Failed to delete event" });
        }
    };
}
