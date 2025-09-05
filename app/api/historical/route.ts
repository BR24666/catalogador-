import { NextRequest, NextResponse } from 'next/server'
import { CatalogService } from '@/lib/catalog-service'

const catalogService = new CatalogService()

export async function POST(request: NextRequest) {
  try {
    const { action, pairs, timeframes, days, startDate, endDate } = await request.json()

    switch (action) {
      case 'collect_by_days':
        const resultByDays = await catalogService.collectHistoricalData(
          pairs || ['SOLUSDT'],
          timeframes || ['1m'],
          days || 7
        )
        return NextResponse.json(resultByDays)
      
      case 'collect_by_range':
        if (!startDate || !endDate) {
          return NextResponse.json(
            { success: false, message: 'Data de início e fim são obrigatórias' },
            { status: 400 }
          )
        }
        
        const resultByRange = await catalogService.collectHistoricalDataByDateRange(
          pairs || ['SOLUSDT'],
          timeframes || ['1m'],
          new Date(startDate),
          new Date(endDate)
        )
        return NextResponse.json(resultByRange)
      
      case 'get_summary':
        const summary = await catalogService.getDataSummary()
        return NextResponse.json({ success: true, data: summary })
      
      default:
        return NextResponse.json({ success: false, message: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro na API de dados históricos:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const summary = await catalogService.getDataSummary()
    return NextResponse.json({ success: true, data: summary })
  } catch (error) {
    console.error('Erro ao buscar resumo dos dados:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar resumo dos dados' },
      { status: 500 }
    )
  }
}
