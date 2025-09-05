import { NextRequest, NextResponse } from 'next/server'
import { CatalogService } from '@/lib/catalog-service'

const catalogService = new CatalogService()

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Iniciando catalogador em background...')
    
    // Verificar se já está rodando
    const status = await catalogService.getCatalogStatus()
    if (status.isRunning) {
      return NextResponse.json({
        success: true,
        message: 'Catalogador já está rodando em background',
        isRunning: true
      })
    }
    
    // Iniciar catalogador
    await catalogService.startCataloging(60) // 1 minuto
    
    console.log('✅ Catalogador iniciado em background com sucesso!')
    
    return NextResponse.json({
      success: true,
      message: 'Catalogador iniciado em background',
      isRunning: true
    })
    
  } catch (error) {
    console.error('❌ Erro ao iniciar catalogador em background:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao iniciar catalogador em background',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = await catalogService.getCatalogStatus()
    
    return NextResponse.json({
      success: true,
      isRunning: status.isRunning,
      lastUpdate: status.lastUpdate,
      message: status.isRunning ? 'Catalogador ativo' : 'Catalogador parado'
    })
    
  } catch (error) {
    console.error('❌ Erro ao verificar status do catalogador:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao verificar status',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🛑 Parando catalogador em background...')
    
    await catalogService.stopCataloging()
    
    console.log('✅ Catalogador parado com sucesso!')
    
    return NextResponse.json({
      success: true,
      message: 'Catalogador parado',
      isRunning: false
    })
    
  } catch (error) {
    console.error('❌ Erro ao parar catalogador:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao parar catalogador',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
