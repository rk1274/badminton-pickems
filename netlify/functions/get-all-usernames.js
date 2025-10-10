import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function handler(event) {
  try {
    const { data, error } = await supabase
      .from('picks')
      .select('username')

    if (error) throw error;

    // Remove duplicates
    const usernames = [...new Set(data.map(d => d.username))];

    return {
      statusCode: 200,
      body: JSON.stringify(usernames),
    };
  } catch (err) {
    console.error("Error fetching usernames:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
}