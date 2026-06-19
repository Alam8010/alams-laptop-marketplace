 import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { storeName, whatsappNumber, phoneNumber, address } = await request.json()

  const { error } = await supabase
    .from('stores')
    .update({
      store_name: storeName,
      whatsapp_number: whatsappNumber,
      phone_number: phoneNumber,
      address: address,
    })
    .eq('owner_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
