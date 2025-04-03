import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing Supabase credentials. Please check your .env file includes SUPABASE_URL and SUPABASE_KEY"
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
