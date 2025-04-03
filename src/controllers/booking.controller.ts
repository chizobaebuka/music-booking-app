import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { createBookingSchema, updateBookingSchema } from "../schemas/booking.schema";
import { ZodError } from "zod";

export class BookingController {
    private bookingService: BookingService;

    constructor() {
        this.bookingService = new BookingService();
    }

    createBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const validatedData = createBookingSchema.parse(req.body);
            const organizerId = req.user?.id;

            if (!organizerId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            const booking = await this.bookingService.createBooking(organizerId, validatedData);
            res.status(201).json({ message: "Booking created successfully", booking });
        } catch (error) {
            console.error('Booking creation error:', error);

            if (error instanceof ZodError) {
                res.status(400).json({ error: "Validation error", details: error.errors });
                return;
            }

            // Handle specific error messages from service
            if (error instanceof Error) {
                switch (error.message) {
                    case 'Event not found or unauthorized':
                        res.status(403).json({ error: "You are not authorized to create bookings for this event" });
                        return;
                    case 'Artist not found':
                        res.status(404).json({ error: "Artist not found" });
                        return;
                }
            }

            // Handle Supabase errors
            if (typeof error === 'object' && error !== null && 'code' in error) {
                const supabaseError = error as { code: string; message?: string };
                if (supabaseError.code === '23503') { // Foreign key violation
                    res.status(400).json({ error: "Invalid artist or event ID" });
                    return;
                }
                if (supabaseError.code === '23505') { // Unique constraint violation
                    res.status(409).json({ error: "Booking already exists" });
                    return;
                }
            }

            res.status(500).json({ error: "Failed to create booking" });
        }
    };

    getBookings = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            
            const bookings = await this.bookingService.getBookings(userId!, userRole!);
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch bookings" });
        }
    };

    getBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            
            const booking = await this.bookingService.getBooking(id, userId!);
            if (!booking) {
                res.status(404).json({ error: "Booking not found" });
                return;
            }
            res.json(booking);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch booking" });
        }
    };

    updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const validatedData = updateBookingSchema.parse(req.body);
            const artistId = req.user?.id;

            const booking = await this.bookingService.updateBookingStatus(
                id,
                artistId!,
                validatedData
            );
            res.json({ message: "Booking status updated successfully", booking });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Validation error", details: error.errors });
                return;
            }
            res.status(500).json({ error: "Failed to update booking status" });
        }
    };

    deleteBooking = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;

            const booking = await this.bookingService.cancelBooking(id, userId!, userRole!);
            res.json({ message: "Booking canceled successfully", booking });
        } catch (error) {
            res.status(500).json({ error: "Failed to cancel booking" });
        }
    };

    // deleteBooking = async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const { id } = req.params;  
    //         const userId = req.user?.id;
    //         const userRole = req.user?.role;
    //         await this.bookingService.cancelBooking(id, userId!, userRole!);
    //         res.json({ message: "Booking deleted successfully" });
    //     } catch (error) {
    //         res.status(500).json({ error: "Failed to delete booking" });
    //     }
    // }
}
