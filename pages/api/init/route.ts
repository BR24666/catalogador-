import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Inicializar configurações do catalogador
    const { error: settingsError } = await supabase
      .from('catalog_settings')
      .upsert({
        id: 1,
        is_running: false,
        last_update: null,
        update_interval_seconds: 60,
        pairs: ['SOLUSDT'],
        timeframes: ['1m'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (settingsError) {
      console.error('Erro ao inicializar configurações:', settingsError)
      return NextResponse.json(
        { success: false, message: 'Erro ao inicializar configurações' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Configurações inicializadas com sucesso' 
    })
  } catch (error) {
    console.error('Erro na inicialização:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
