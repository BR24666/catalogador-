import { NextRequest, NextResponse } from 'next/server'
import { CatalogService } from '@/lib/catalog-service'

const catalogService = new CatalogService()

// Esta função será chamada automaticamente quando a aplicação iniciar
export async function GET() {
  try {
    // Verificar se já está rodando
    const status = await catalogService.getCatalogStatus()
    
    if (!status.isRunning) {
      // Iniciar automaticamente se não estiver rodando
      await catalogService.startCataloging(60)
      console.log('🚀 Catalogador iniciado automaticamente')
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Catalogador verificado/iniciado',
      isRunning: true
    })
  } catch (error) {
    console.error('Erro na verificação automática:', error)
    return NextResponse.json(
      { success: false, message: 'Erro na verificação automática' },
      { status: 500 }
    )
  }
}
