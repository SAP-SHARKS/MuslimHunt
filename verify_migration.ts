import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://anzqsjvvguiqcenfdevh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NtQS4iJiNrKgGH-cBKBF6w_hUn8GNEs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    console.log('START_VERIFICATION');
    try {
        const { data, error } = await supabase
            .from('app_settings')
            .select('*')
            .eq('id', 'global_theme');

        if (error) {
            console.log('ERROR_DETAILS: ' + error.message);
            if (error.message.includes('permission denied')) {
                console.log('RESULT: PERMISSION_DENIED');
            } else {
                console.log('RESULT: TABLE_MISSING');
            }
        } else {
            if (data && data.length > 0) {
                console.log('RESULT: SUCCESS');
                console.log('CONF: ' + JSON.stringify(data[0].config));
            } else {
                console.log('RESULT: EMPTY_TABLE');
            }
        }
    } catch (err) {
        console.log('RESULT: EXCEPTION');
        console.log(err);
    }
    console.log('END_VERIFICATION');
}

verify();
