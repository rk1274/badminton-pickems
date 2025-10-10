import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  const username = event.queryStringParameters.username;

  const { data, error } = await supabase
    .from('picks')
    .select('data')
    .eq('username', username)
    .single();

  if (error || !data) {
    return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data.data),
  };
}