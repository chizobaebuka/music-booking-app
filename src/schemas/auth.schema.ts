import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["artist", "organizer"])
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const userIdSchema = z.string().uuid();

export const userUpdateSchema = z.object({
    email: z.string().email().optional(),
    role: z.enum(["artist", "organizer"]).optional(),
    // Add other updatable fields here
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;