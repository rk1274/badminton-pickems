import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { username, selections } = JSON.parse(event.body);

  // Check if this user already submitted
  const { data: existing, error: selectError } = await supabase
    .from('picks')
    .select('username')
    .eq('username', username)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    return { statusCode: 500, body: JSON.stringify(selectError) };
  }

  if (existing) {
    // User already submitted
    return {
      statusCode: 403,
      body: JSON.stringify({ message: 'You cannot change your picks once submitted.' }),
    };
  }

  // Insert new picks
  const { error: insertError } = await supabase
    .from('picks')
    .insert({ username, data: selections });

  if (insertError) {
    return { statusCode: 500, body: JSON.stringify(insertError) };
  }

  return { statusCode: 200, body: JSON.stringify({ message: 'Saved!' }) };
}
