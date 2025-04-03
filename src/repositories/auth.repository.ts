import { supabase } from "../config/supabaseClient";
import { IUser } from "../models/User";

export class AuthRepository {
    async createUser(user: Omit<IUser, "id">): Promise<IUser> {
        const { data, error } = await supabase
            .from("users")
            .insert([user])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
            
        if (error) return null;
        return data;
    }

    async findAll(): Promise<IUser[]> {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order('created_at', { ascending: false });

            console.log({ data })

        if (error) throw error;
        return data;
    }

    async findById(id: string): Promise<IUser | null> {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return null;
        return data;
    }

    async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        const { data, error } = await supabase
            .from("users")
            .update(userData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteUser(id: string): Promise<void> {
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
}
