import { CatalogService } from './catalog-service'

let isInitialized = false

export async function initializeAutoCatalog() {
  if (isInitialized) return
  
  try {
    const catalogService = new CatalogService()
    const status = await catalogService.getCatalogStatus()
    
    if (!status.isRunning) {
      console.log('🚀 Iniciando catalogador automaticamente...')
      await catalogService.startCataloging(60) // 1 minuto
      console.log('✅ Catalogador iniciado com sucesso!')
    } else {
      console.log('ℹ️ Catalogador já está rodando')
    }
    
    isInitialized = true
  } catch (error) {
    console.error('❌ Erro ao inicializar catalogador:', error)
  }
}

// Inicializar automaticamente quando o módulo for carregado
if (typeof window === 'undefined') {
  // Só roda no servidor
  initializeAutoCatalog()
}
