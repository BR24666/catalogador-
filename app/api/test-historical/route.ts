import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testando API de dados históricos...')
    
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 2)
    
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = endDate.toISOString().split('T')[0]
    
    console.log(`📅 Período: ${startDateStr} até ${endDateStr}`)
    
    // Testar chamada para a API de dados históricos
    const response = await fetch(`${request.nextUrl.origin}/api/historical-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDateStr,
        endDate: endDateStr,
        limit: 100
      }),
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Teste de dados históricos executado',
      testData: {
        startDate: startDateStr,
        endDate: endDateStr,
        response: result
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no teste de dados históricos:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro no teste de dados históricos',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
