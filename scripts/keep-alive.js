const fetch = require('node-fetch')

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function checkAndStartCataloger() {
  try {
    console.log('🔍 Verificando status do catalogador...')
    
    // Verificar status
    const statusResponse = await fetch(`${API_URL}/api/background-catalog`)
    const statusData = await statusResponse.json()
    
    if (statusData.success && !statusData.isRunning) {
      console.log('🚀 Iniciando catalogador...')
      
      // Iniciar catalogador
      const startResponse = await fetch(`${API_URL}/api/background-catalog`, {
        method: 'POST'
      })
      const startData = await startResponse.json()
      
      if (startData.success) {
        console.log('✅ Catalogador iniciado com sucesso!')
      } else {
        console.error('❌ Erro ao iniciar catalogador:', startData.error)
      }
    } else if (statusData.success && statusData.isRunning) {
      console.log('✅ Catalogador já está ativo')
    } else {
      console.error('❌ Erro ao verificar status:', statusData.error)
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação:', error.message)
  }
}

// Executar a cada 5 minutos
setInterval(checkAndStartCataloger, 5 * 60 * 1000)

// Executar imediatamente
checkAndStartCataloger()

console.log('🔄 Serviço de keep-alive iniciado. Verificando a cada 5 minutos...')
