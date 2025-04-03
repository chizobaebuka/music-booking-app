
import { Request, Response } from "express";
import { ArtistService } from "../services/artist.service";
import { createArtistProfileSchema, updateArtistProfileSchema } from "../schemas/artist.schema";
import { ZodError } from "zod";

export class ArtistController {
    private artistService: ArtistService;

    constructor() {
        this.artistService = new ArtistService();
    }

    createProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('📝 Creating artist profile - Request body:', req.body);
            console.log('👤 User from token:', req.user);

            const validatedData = createArtistProfileSchema.parse(req.body);
            const userId = req.user?.id;

            if (!userId) {
                console.warn('❌ No user ID in token');
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            console.log('✅ Validation passed, creating profile for user:', userId);
            const profile = await this.artistService.createProfile(userId, validatedData);
            console.log('✅ Profile created successfully:', profile);
            
            res.status(201).json({ message: "Artist profile created", profile });
        } catch (error) {
            console.error('🔴 Create profile error:', {
                name: error instanceof Error ? error.name : 'Unknown Error',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace',
                body: req.body,
                userId: req.user?.id
            });

            if (error instanceof ZodError) {
                console.error('❌ Validation error:', error.errors);
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error && error.message === "Artist profile already exists") {
                res.status(409).json({ error: error.message });
                return;
            }
            
            res.status(500).json({ error: "Server error" });
        }
    };

    updateProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const validatedData = updateArtistProfileSchema.parse(req.body);

            if (!userId) {
                res.status(401).json({ error: "User ID not found in token" });
                return;
            }

            const updatedProfile = await this.artistService.updateProfile(id, userId, validatedData);
            res.json({ message: "Profile updated successfully", profile: updatedProfile });
        } catch (error) {
            console.error('Update profile error:', error);
            if (error instanceof ZodError) {
                res.status(400).json({ error: error.errors });
                return;
            }
            if (error instanceof Error && error.message === "Artist profile not found") {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof Error && error.message === "Unauthorized") {
                res.status(403).json({ error: "You are not authorized to update this profile" });
                return;
            }
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const profile = await this.artistService.getProfile(id);

            if (!profile) {
                res.status(404).json({ error: "Artist profile not found" });
                return;
            }

            res.json({ profile });
        } catch (error) {
            console.error('Get profile error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    getProfileByUserId = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const profile = await this.artistService.getProfileByUserId(userId);

            if (!profile) {
                res.status(404).json({ error: "Artist profile not found" });
                return;
            }

            res.json({ profile });
        } catch (error) {
            console.error('Get profile by user ID error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };

    getAllProfiles = async (_req: Request, res: Response): Promise<void> => {
        try {
            const profiles = await this.artistService.getAllProfiles();
            res.json({ profiles });
        } catch (error) {
            console.error('Get all profiles error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Server error" });
        }
    };
}

export default ArtistController;

