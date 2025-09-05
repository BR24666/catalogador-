import { NextRequest, NextResponse } from 'next/server'
import { CatalogService } from '@/lib/catalog-service'

const catalogService = new CatalogService()

export async function POST() {
  try {
    // Iniciar catalogador automaticamente
    await catalogService.startCataloging(60) // 60 segundos = 1 minuto
    
    return NextResponse.json({ 
      success: true, 
      message: 'Catalogador iniciado automaticamente' 
    })
  } catch (error) {
    console.error('Erro ao iniciar catalogador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro ao iniciar catalogador' },
      { status: 500 }
    )
  }
}
