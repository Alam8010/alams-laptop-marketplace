import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  const { userId, fullName, storeName, whatsappNumber } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  const { error: storeError } = await supabaseAdmin
    .from('stores')
    .insert({
      owner_id: userId,
      store_name: storeName,
      whatsapp_number: whatsappNumber,
      status: 'pending',
    })

  if (storeError) {
    return NextResponse.json({ error: storeError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}