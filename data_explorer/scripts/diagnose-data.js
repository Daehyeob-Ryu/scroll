import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnose() {
    console.log('🔍 Diagnostic Tool Running...\n');

    // 1. CSV 헤더 확인
    console.log('1️⃣ Checking CSV File Headers:');
    try {
        const csvContent = fs.readFileSync('public/data/source.csv', 'utf-8');
        const firstLine = csvContent.split('\n')[0];
        console.log(`   Raw Header Line: "${firstLine}"`);
        console.log(`   Hex Dump: ${Buffer.from(firstLine).toString('hex')}`);

        // BOM 확인
        if (csvContent.charCodeAt(0) === 0xFEFF) {
            console.log('   ⚠️ BOM detected at start of file');
        }
    } catch (e) {
        console.error('   ❌ Error reading CSV:', e.message);
    }

    // 2. Supabase 데이터 확인
    console.log('\n2️⃣ Checking Supabase Data (First Record):');
    try {
        const { data, error } = await supabase
            .from('records')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('   ❌ Error fetching from Supabase:', error.message);
        } else {
            console.log('   ✅ Record fetched successfully:');
            console.log(JSON.stringify(data, null, 2));

            if (!data.org) {
                console.log('\n   ⚠️ WARNING: "org" field is empty or null!');
            } else {
                console.log(`\n   ✅ "org" field value: "${data.org}"`);
            }
        }
    } catch (e) {
        console.error('   ❌ Unexpected error:', e.message);
    }
}

diagnose();
