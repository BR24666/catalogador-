import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Buscar todas as velas
    const { data: candles, error } = await supabase
      .from('candle_catalog')
      .select('*')
      .order('timestamp', { ascending: true })

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    // Buscar configurações
    const { data: settings, error: settingsError } = await supabase
      .from('catalog_settings')
      .select('*')
      .eq('id', 1)
      .single()

    return NextResponse.json({
      success: true,
      candles: candles || [],
      candlesCount: candles?.length || 0,
      settings: settings || null,
      settingsError: settingsError?.message || null
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}
