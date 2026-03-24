import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { title, message, type } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('global_notifications')
      .insert([{ title, message, type }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
