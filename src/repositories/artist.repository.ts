import { supabase } from "../config/supabaseClient";
import { IArtistProfile } from "../models/ArtistProfile";

export class ArtistRepository {
    async createProfile(profile: Omit<IArtistProfile, "id">): Promise<IArtistProfile> {
        const { data, error } = await supabase
            .from("artist_profiles")
            .insert([profile])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    }

    async findByUserId(userId: string): Promise<IArtistProfile | null> {
        const { data, error } = await supabase
            .from("artist_profiles")
            .select("*")
            .eq("user_id", userId)
            .single();
            
        if (error) return null;
        return data;
    }

    async findById(id: string): Promise<IArtistProfile | null> {
        const { data, error } = await supabase
            .from("artist_profiles")
            .select("*")
            .eq("id", id)
            .single();
            
        if (error) return null;
        return data;
    }

    async updateProfile(id: string, profile: Partial<IArtistProfile>): Promise<IArtistProfile | null> {
        const { data, error } = await supabase
            .from("artist_profiles")
            .update(profile)
            .eq("id", id)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    }

    async findAll(): Promise<IArtistProfile[]> {
        const { data, error } = await supabase
            .from("artist_profiles")
            .select("*")
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return data;
    }
}