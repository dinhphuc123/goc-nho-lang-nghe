import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(
    env['NEXT_PUBLIC_SUPABASE_URL'],
    env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
);

async function testInsert() {
    console.log("Testing insert NO RETURNS");

    // Test anon insert into gratitude_letters
    const res1 = await supabase.from('gratitude_letters').insert({
        recipient: 'Thầy Tuấn',
        message: 'Làm em xúc động.',
        sender_name: 'Nam',
        school_id: 'ptdtnt-hm-lamdong'
    });
    console.log("GRAT ERR:", res1.error);

    // Test anon insert into letters
    const res2 = await supabase.from('letters').insert({
        tracking_code: 'TEST12',
        category: 'anxiety',
        content: 'test',
        risk_level: 'normal',
        status: 'pending',
        school_id: 'ptdtnt-hm-lamdong'
    });
    console.log("LETTERS ERR:", res2.error);
}

testInsert();
