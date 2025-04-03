import { ArtistRepository } from "../repositories/artist.repository";
import { CreateArtistProfileInput, UpdateArtistProfileInput } from "../schemas/artist.schema";
import { IArtistProfile } from "../models/ArtistProfile";
import { supabase } from "../config/supabaseClient";

export class ArtistService {
    private artistRepo: ArtistRepository;

    constructor() {
        this.artistRepo = new ArtistRepository();
    }

    async createProfile(userId: string, data: CreateArtistProfileInput): Promise<IArtistProfile> {
        try {
            console.log('📝 Starting profile creation in service:', { userId, data });
            
            // Check if profile already exists
            const { data: existingProfile, error: checkError } = await supabase
                .from('artist_profiles')
                .select()
                .eq('user_id', userId)
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" which is what we want
                console.error('❌ Error checking existing profile:', checkError);
                throw new Error('Database error while checking profile');
            }

            if (existingProfile) {
                console.warn('❌ Profile already exists for user:', userId);
                throw new Error('Artist profile already exists');
            }

            // Create new profile
            const { data: profile, error: insertError } = await supabase
                .from('artist_profiles')
                .insert([
                    {
                        user_id: userId,
                        stage_name: data.stageName,
                        bio: data.bio,
                        genres: data.genres,
                        availability: data.availability
                    }
                ])
                .select()
                .single();

            if (insertError) {
                console.error('❌ Error inserting profile:', insertError);
                throw new Error(`Failed to create profile: ${insertError.message}`);
            }

            console.log('✅ Profile created successfully:', profile);
            return profile;
        } catch (error) {
            console.error('🔴 Service error:', {
                name: error instanceof Error ? error.name : 'Unknown Error',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    async getProfile(id: string): Promise<IArtistProfile> {
        const profile = await this.artistRepo.findById(id);
        if (!profile) {
            throw new Error("Artist profile not found");
        }
        return profile;
    }

    async getProfileByUserId(userId: string): Promise<IArtistProfile> {
        const profile = await this.artistRepo.findByUserId(userId);
        if (!profile) {
            throw new Error("Artist profile not found");
        }
        return profile;
    }

    async updateProfile(id: string, userId: string, input: UpdateArtistProfileInput): Promise<IArtistProfile> {
        const profile = await this.artistRepo.findById(id);
        if (!profile) {
            throw new Error("Artist profile not found");
        }

        // Ensure user owns the profile
        if (profile.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const updatedProfile = await this.artistRepo.updateProfile(id, {
            ...input,
            updated_at: new Date()
        });

        if (!updatedProfile) {
            throw new Error("Failed to update profile");
        }

        return updatedProfile;
    }

    async getAllProfiles(): Promise<IArtistProfile[]> {
        return await this.artistRepo.findAll();
    }
}
