import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증 (더 자세한 로그)
console.log('🔍 Checking environment variables...');
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\n❌ Error: Missing environment variables');
    console.error('Please check your .env file has:');
    console.error('  - VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
}

// URL 형식 검증
if (!supabaseUrl.startsWith('https://')) {
    console.error('\n❌ Error: VITE_SUPABASE_URL must start with https://');
    console.error(`   Current value: ${supabaseUrl}`);
    process.exit(1);
}

console.log(`\n📡 Connecting to: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testConnection() {
    console.log('\n🔌 Testing Supabase connection...');
    try {
        const { data, error } = await supabase
            .from('data_versions')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Connection test failed:', error.message);
            console.error('   Error details:', error);
            return false;
        }

        console.log('✅ Connection successful!');
        return true;
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        if (err.cause) {
            console.error('   Cause:', err.cause);
        }
        return false;
    }
}

async function importCSVToSupabase() {
    console.log('🚀 Starting CSV import to Supabase...\n');

    // 연결 테스트
    const isConnected = await testConnection();
    if (!isConnected) {
        console.error('\n❌ Cannot proceed without a valid connection.');
        console.error('\n💡 Troubleshooting steps:');
        console.error('   1. Check your .env file exists in the project root');
        console.error('   2. Verify VITE_SUPABASE_URL is correct (from Supabase Dashboard → Settings → API)');
        console.error('   3. Verify SUPABASE_SERVICE_ROLE_KEY is the service_role key (not anon key)');
        console.error('   4. Check your internet connection');
        console.error('   5. Verify Supabase project is not paused');
        process.exit(1);
    }

    // 버전 생성 (YYYYMMDD 형식)
    const version = new Date().toISOString().split('T')[0].replace(/-/g, '');
    console.log(`\n📅 Version: ${version}`);

    try {
        // 1. CSV 파일 읽기
        console.log('\n📖 Reading CSV file...');
        const csvContent = fs.readFileSync('public/data/source.csv', 'utf-8');

        // 2. CSV 파싱
        console.log('🔍 Parsing CSV...');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true // BOM 문자 자동 처리
        });

        console.log(`✅ Found ${records.length} records\n`);

        // 기존 데이터 삭제 (재임포트 시 중복 방지)
        console.log(`🗑️ Cleaning up existing data for version ${version}...`);
        const { error: deleteError } = await supabase
            .from('records')
            .delete()
            .eq('data_version', version);

        if (deleteError) {
            console.error('⚠️ Error cleaning up:', deleteError.message);
        }

        // 3. 데이터 변환 및 배치 삽입
        console.log('💾 Importing data to Supabase...');
        const batchSize = 500; // 한 번에 500개씩 삽입
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize).map(record => ({
                id: record.code_id, // code_id를 primary key로 사용
                code_id: record.code_id,
                code_display: record.code_display || '',
                concept_id: record.concept_id || null,
                concept_name: record.concept_name || null,
                org: record.org || '',
                category: record.category || '',
                vocab: record.vocab || '',
                count: parseInt(record.count?.replace(/,/g, '') || '0', 10),
                data_version: version,
                is_active: true
            }));

            try {
                const { data, error } = await supabase
                    .from('records')
                    .upsert(batch, {
                        onConflict: 'id,data_version',
                        ignoreDuplicates: false
                    });

                if (error) {
                    console.error(`\n❌ Error importing batch ${Math.floor(i / batchSize) + 1}:`, error.message);
                    console.error('   Error code:', error.code);
                    console.error('   Error details:', error.details);
                    errorCount += batch.length;
                } else {
                    successCount += batch.length;
                    const progress = Math.min(i + batchSize, records.length);
                    const percentage = ((progress / records.length) * 100).toFixed(1);
                    process.stdout.write(`\r   Progress: ${progress}/${records.length} (${percentage}%) `);
                }
            } catch (batchError) {
                console.error(`\n❌ Exception in batch ${Math.floor(i / batchSize) + 1}:`, batchError.message);
                errorCount += batch.length;
            }
        }

        console.log(`\n\n✅ Import completed!`);
        console.log(`   - Success: ${successCount} records`);
        if (errorCount > 0) {
            console.log(`   - Errors: ${errorCount} records`);
        }

        // 4. 버전 메타데이터 저장
        console.log('\n📝 Saving version metadata...');
        const { error: versionError } = await supabase
            .from('data_versions')
            .insert({
                version: version,
                record_count: successCount,
                is_active: true,
                notes: 'Initial import from CSV',
                created_at: new Date().toISOString()
            });

        if (versionError) {
            console.error('❌ Error saving version metadata:', versionError.message);
        } else {
            console.log('✅ Version metadata saved');
        }

        // 5. 데이터 검증
        console.log('\n🔍 Verifying data...');
        const { count, error: countError } = await supabase
            .from('records')
            .select('*', { count: 'exact', head: true })
            .eq('data_version', version)
            .eq('is_active', true);

        if (countError) {
            console.error('❌ Error verifying data:', countError.message);
        } else {
            console.log(`✅ Verified: ${count} records in database`);
        }

        console.log('\n🎉 All done!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Version: ${version}`);
        console.log(`   - Total records: ${successCount}`);
        console.log(`   - Status: Active`);

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        if (error.stack) {
            console.error('\n📋 Stack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// 실행
importCSVToSupabase();
