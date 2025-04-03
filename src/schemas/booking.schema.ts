import { z } from "zod";

export const createBookingSchema = z.object({
    artistId: z.string().uuid(),
    eventId: z.string().uuid()
});

export const updateBookingSchema = z.object({
    status: z.enum(['confirmed', 'canceled', 'pending']),
    message: z.string().optional()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
