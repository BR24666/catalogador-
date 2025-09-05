import { NextRequest, NextResponse } from 'next/server'
import { BinanceAPI } from '@/lib/binance-api'
import { supabase } from '@/lib/supabase'

const binanceAPI = BinanceAPI.getInstance()

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, limit = 1000 } = await request.json()
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Data inicial e final são obrigatórias' },
        { status: 400 }
      )
    }

    console.log(`📅 Buscando dados históricos de ${startDate} até ${endDate}`)
    
    // Converter datas para timestamps
    const startTime = new Date(startDate).getTime()
    const endTime = new Date(endDate).getTime()
    
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Data inicial deve ser anterior à data final' },
        { status: 400 }
      )
    }

    // Buscar dados históricos da Binance
    const historicalData = await binanceAPI.getHistoricalData('SOLUSDT', '1m', startTime, endTime, limit)
    
    console.log(`📊 Encontrados ${historicalData.length} registros históricos`)
    
    // Salvar no banco em lotes menores para grandes volumes
    const batchSize = historicalData.length > 1000 ? 50 : 100
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
        
        // Pequena pausa entre lotes para não sobrecarregar o banco
        if (i + batchSize < historicalData.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error(`Erro ao processar lote ${i + 1}-${Math.min(i + batchSize, historicalData.length)}:`, error)
        errorCount += batch.length
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Dados históricos carregados com sucesso!`,
      stats: {
        totalFound: historicalData.length,
        saved: savedCount,
        errors: errorCount,
        period: {
          start: startDate,
          end: endDate
        }
      }
    })
    
  } catch (error) {
    console.error('Erro ao buscar dados históricos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
