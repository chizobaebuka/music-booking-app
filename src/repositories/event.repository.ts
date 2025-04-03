import { supabase } from "../config/supabaseClient";
import { IEvent } from "../models/Event";

export class EventRepository {
    async create(event: Omit<IEvent, "id" | "createdAt" | "updatedAt">): Promise<IEvent> {
        // Convert camelCase to snake_case for database
        const dbEvent = {
            organizer_id: event.organizerId,
            name: event.name,
            description: event.description,
            location: event.location,
            date: event.date
        };

        const { data, error } = await supabase
            .from("events")
            .insert([dbEvent])
            .select()
            .single();
            
        if (error) throw error;
        
        // Convert snake_case back to camelCase for the response
        return {
            id: data.id,
            organizerId: data.organizer_id,
            name: data.name,
            description: data.description,
            location: data.location,
            date: new Date(data.date),
            createdAt: data.created_at ? new Date(data.created_at) : undefined,
            updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
        };
    }

    async findById(id: string): Promise<IEvent | null> {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();
            
        if (error) return null;
        
        return data ? {
            id: data.id,
            organizerId: data.organizer_id,
            name: data.name,
            description: data.description,
            location: data.location,
            date: new Date(data.date),
            createdAt: data.created_at ? new Date(data.created_at) : undefined,
            updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
        } : null;
    }

    async findAll(): Promise<IEvent[]> {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("date", { ascending: true });
            
        if (error) throw error;
        
        return (data || []).map(event => ({
            id: event.id,
            organizerId: event.organizer_id,
            name: event.name,
            description: event.description,
            location: event.location,
            date: new Date(event.date),
            createdAt: event.created_at ? new Date(event.created_at) : undefined,
            updatedAt: event.updated_at ? new Date(event.updated_at) : undefined
        }));
    }

    async update(id: string, event: Partial<IEvent>): Promise<IEvent | null> {
        const { data, error } = await supabase
            .from("events")
            .update({ ...event, updated_at: new Date() })
            .eq("id", id)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);
            
        if (error) throw error;
    }
}
