const fetch = require('node-fetch');

async function testResetAndLoad() {
  try {
    console.log('🧪 Testando API de reset e carregamento...');
    
    const response = await fetch('http://localhost:3000/api/reset-and-load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    console.log('📊 Resultado:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Reset e carregamento concluídos com sucesso!');
      console.log(`📈 Dados históricos carregados: ${result.stats.historicalData.saved} registros`);
    } else {
      console.error('❌ Erro:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

// Aguardar 10 segundos para o servidor inicializar
setTimeout(testResetAndLoad, 10000);
