import { NextRequest, NextResponse } from 'next/server'
import { BinanceAPI } from '@/lib/binance-api'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Iniciando limpeza e carregamento de dados...')
    
    // 1. Limpar tabelas
    console.log('🗑️ Limpando tabelas...')
    
    // Limpar tabela de velas
    const { error: deleteCandlesError } = await supabase
      .from('candle_catalog')
      .delete()
      .neq('id', 0) // Deleta todos os registros
    
    if (deleteCandlesError) {
      console.error('❌ Erro ao limpar tabela de velas:', deleteCandlesError)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao limpar tabela de velas',
        details: deleteCandlesError.message 
      }, { status: 500 })
    }
    
    // Limpar tabela de configurações
    const { error: deleteConfigError } = await supabase
      .from('catalog_settings')
      .delete()
      .neq('id', 0) // Deleta todos os registros
    
    if (deleteConfigError) {
      console.error('❌ Erro ao limpar tabela de configurações:', deleteConfigError)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao limpar tabela de configurações',
        details: deleteConfigError.message 
      }, { status: 500 })
    }
    
    console.log('✅ Tabelas limpas com sucesso!')
    
    // 2. Carregar dados históricos de 2 meses
    console.log('📅 Carregando dados históricos de 2 meses...')
    
    const binanceAPI = BinanceAPI.getInstance()
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 2)
    
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()
    
    console.log(`📅 Período: ${startDate.toISOString().split('T')[0]} até ${endDate.toISOString().split('T')[0]}`)
    
    // Buscar dados históricos da Binance
    const historicalData = await binanceAPI.getHistoricalData('SOLUSDT', '1m', startTime, endTime, 1000)
    
    console.log(`📊 Encontrados ${historicalData.length} registros históricos`)
    
    // Salvar no banco em lotes
    const batchSize = 50
    let savedCount = 0
    let errorCount = 0
    
    console.log(`📦 Processando ${historicalData.length} registros em lotes de ${batchSize}`)
    
    for (let i = 0; i < historicalData.length; i += batchSize) {
      const batch = historicalData.slice(i, i + batchSize)
      
      try {
        const { error } = await supabase
          .from('candle_catalog')
          .upsert(batch, {
            onConflict: 'pair,timeframe,timestamp'
          })
        
        if (error) {
          console.error(`Erro ao salvar lote ${i + 1}-${Math.min(i + batchSize, historicalData.length)}:`, error)
          errorCount += batch.length
        } else {
          savedCount += batch.length
          console.log(`✅ Lote ${i + 1}-${Math.min(i + batchSize, historicalData.length)} salvo (${savedCount}/${historicalData.length})`)
        }
        
        // Pausa entre lotes
        if (i + batchSize < historicalData.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`Erro ao processar lote ${i + 1}-${Math.min(i + batchSize, historicalData.length)}:`, error)
        errorCount += batch.length
      }
    }
    
    // 3. Inicializar configurações
    console.log('⚙️ Inicializando configurações...')
    
    const { error: configError } = await supabase
      .from('catalog_settings')
      .upsert({
        id: 1,
        pair: 'SOLUSDT',
        timeframe: '1m',
        is_running: false,
        interval_seconds: 60,
        last_update: new Date().toISOString()
      })
    
    if (configError) {
      console.error('❌ Erro ao inicializar configurações:', configError)
    } else {
      console.log('✅ Configurações inicializadas!')
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reset e carregamento concluídos com sucesso!',
      stats: {
        historicalData: {
          totalFound: historicalData.length,
          saved: savedCount,
          errors: errorCount,
          period: {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
          },
        },
        tablesCleared: ['candle_catalog', 'catalog_settings'],
        configInitialized: true
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no reset e carregamento:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro no reset e carregamento',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}