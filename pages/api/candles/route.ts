import { NextRequest, NextResponse } from 'next/server'
import { CatalogService } from '@/lib/catalog-service'

const catalogService = new CatalogService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pair = searchParams.get('pair') as 'BTCUSDT' | 'XRPUSDT' | 'SOLUSDT'
    const timeframe = searchParams.get('timeframe') as '1m' | '5m' | '15m'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const date = searchParams.get('date')
    const hour = searchParams.get('hour')

    if (!pair || !timeframe) {
      return NextResponse.json(
        { success: false, message: 'Par e timeframe são obrigatórios' },
        { status: 400 }
      )
    }

    let candles

    if (date && hour) {
      // Buscar velas por hora específica
      candles = await catalogService.getCandlesByHour(pair, timeframe, date, parseInt(hour))
    } else if (startDate && endDate) {
      // Buscar velas por intervalo de datas
      candles = await catalogService.getCandlesByDateRange(pair, timeframe, startDate, endDate)
    } else if (date) {
      // Buscar velas por data específica
      candles = await catalogService.getCandlesByDateRange(pair, timeframe, date, date)
    } else {
      return NextResponse.json(
        { success: false, message: 'Parâmetros de data são obrigatórios' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: candles })
  } catch (error) {
    console.error('Erro ao buscar velas:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar velas' },
      { status: 500 }
    )
  }
}
