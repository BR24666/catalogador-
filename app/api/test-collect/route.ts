import { NextResponse } from 'next/server'
import { BinanceAPI } from '@/lib/binance-api'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Testando coleta de dados...')
    
    const binanceAPI = BinanceAPI.getInstance()
    const pairs = ['BTCUSDT', 'XRPUSDT', 'SOLUSDT']
    const timeframes = ['1m', '5m', '15m']
    
    const candles = await binanceAPI.getLatestCandles(pairs, timeframes)
    console.log(`📊 Coletadas ${candles.length} velas`)
    
    // Salvar no banco
    for (const candle of candles) {
      const { error } = await supabase
        .from('candle_catalog')
        .upsert({
          pair: candle.pair,
          timeframe: candle.timeframe,
          timestamp: candle.timestamp.toISOString(),
          open_price: candle.open_price,
          high_price: candle.high_price,
          low_price: candle.low_price,
          close_price: candle.close_price,
          volume: candle.volume,
          color: candle.color,
          hour: candle.hour,
          minute: candle.minute,
          day: candle.day,
          month: candle.month,
          year: candle.year,
          full_date: candle.full_date,
          time_key: candle.time_key,
          date_key: candle.date_key,
        }, {
          onConflict: 'pair,timeframe,timestamp'
        })

      if (error) {
        console.error(`❌ Erro ao salvar ${candle.pair} ${candle.timeframe}:`, error)
      } else {
        console.log(`✅ Salvo ${candle.pair} ${candle.timeframe}`)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Coletadas e salvas ${candles.length} velas`,
      candles: candles.length
    })
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao coletar dados', error: error.message },
      { status: 500 }
    )
  }
}
