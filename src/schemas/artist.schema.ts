import { z } from "zod";

export const createArtistProfileSchema = z.object({
    stageName: z.string().min(2),
    bio: z.string().optional(),
    genres: z.array(z.string()),
    availability: z.array(z.string())
});

export const updateArtistProfileSchema = createArtistProfileSchema.partial();

export type CreateArtistProfileInput = z.infer<typeof createArtistProfileSchema>;
export type UpdateArtistProfileInput = z.infer<typeof updateArtistProfileSchema>;