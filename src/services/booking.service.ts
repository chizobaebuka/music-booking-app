import { supabase } from "../config/supabaseClient";
import { IBooking } from "../models/Booking";
import { CreateBookingInput, UpdateBookingInput } from "../schemas/booking.schema";

export class BookingService {
    async createBooking(organizerId: string, data: CreateBookingInput): Promise<IBooking> {
        // Verify event belongs to organizer
        const { data: event } = await supabase
            .from('events')
            .select('id')
            .eq('id', data.eventId)
            .eq('organizer_id', organizerId)
            .single();

        if (!event) {
            throw new Error('Event not found or unauthorized');
        }

        const { data: booking, error } = await supabase
            .from('bookings')
            .insert({
                artist_id: data.artistId,
                event_id: data.eventId,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return booking as IBooking;
    }

    async getBookings(userId: string, userRole: string): Promise<IBooking[]> {
        const query = supabase
            .from('bookings')
            .select(`
                *,
                events (*),
                artists:users!artist_id (*),
                organizers:events(organizer_id)
            `);

        // Filter based on user role
        if (userRole === 'artist') {
            query.eq('artist_id', userId);
        } else if (userRole === 'organizer') {
            query.eq('events.organizer_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as IBooking[];
    }

    async getBooking(bookingId: string, userId: string): Promise<IBooking | null> {
        // Get full booking details including related data
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
                id,
                status,
                created_at,
                updated_at,
                artist:users(id, email, role),
                event:events(
                    id,
                    name,
                    description,
                    location,
                    date,
                    organizer:users(id, email, role)
                )
            `)
            .eq('id', bookingId)
            .maybeSingle();
    
        console.log('📌 Booking data:', booking);
        console.log('🔴 Supabase Error:', error);
    
        if (error) throw error;
    
        if (!booking) {
            console.warn('⚠️ No booking found for ID:', bookingId);
            return null;
        }

        // Check if user is either the artist or the organizer 
        
    
        return booking as unknown as IBooking;
    }

    async updateBookingStatus(
        bookingId: string,
        artistId: string,
        data: UpdateBookingInput
    ): Promise<IBooking> {
        const { data: booking, error } = await supabase
            .from('bookings')
            .update({
                status: data.status,
                updated_at: new Date()
            })
            .eq('id', bookingId)
            .eq('artist_id', artistId)
            .select()
            .single();

        if (error) throw error;
        return booking as IBooking;
    }

    async cancelBooking(
        bookingId: string,
        userId: string,
        userRole: string
    ): Promise<IBooking> {
        const query = supabase
            .from('bookings')
            .delete()
            .eq('id', bookingId);

        if (userRole === 'artist') {
            query.eq('artist_id', userId);
        } else if (userRole === 'organizer') {
            query.eq('events.organizer_id', userId);
        }

        const { data, error } = await query.select().single();
        if (error) throw error;
        return data as IBooking;
    }
}
