import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testInsert() {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MISSING");

    // Test anon insert
    const { data, error } = await supabase.from('gratitude_letters').insert({
        recipient: 'Thầy Tuấn',
        message: 'Làm em xúc động.',
        sender_name: 'Nam',
        school_id: 'ptdtnt-hm-lamdong'
    }).select();

    if (error) {
        console.error("FAILED! DB Error:", error);
    } else {
        console.log("SUCCESS! Data:", data);
    }
}

testInsert();
