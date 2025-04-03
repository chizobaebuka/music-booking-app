import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import authRoutes from './routes/auth.routes';
import artistRoutes from './routes/artist.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import { supabase } from './config/supabaseClient';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Swagger Documentation with custom options
const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        authAction: {
            bearerAuth: {
                name: 'bearerAuth',
                schema: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: 'Bearer token authorization'
                }
            }
        }
    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Root Route
app.get("/", (req, res) => {
    res.send("🎵 Music Booking API is running!");
});

// Test Supabase connection
const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count').single();
        if (error) throw error;
        console.log('✅ Successfully connected to Supabase!');
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Failed to connect to Supabase:', error.message);
        } else {
            console.error('❌ Failed to connect to Supabase:', error);
        }
    }
};

// Start Server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    await testSupabaseConnection();
});
