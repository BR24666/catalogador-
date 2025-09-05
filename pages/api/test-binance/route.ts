import { NextRequest, NextResponse } from 'next/server'
import { BinanceAPI } from '@/lib/binance-api'

export async function GET() {
  try {
    const binanceAPI = BinanceAPI.getInstance()
    
    // Testar conexão com a API da Binance
    const candles = await binanceAPI.getLatestCandles(['SOLUSDT'], ['1m'])
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Binance OK',
      data: {
        candlesCount: candles.length,
        lastCandle: candles[0] || null,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erro ao testar Binance:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao conectar com Binance',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
