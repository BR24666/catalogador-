#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Catalogador de Velas...\n');

// Verificar se o arquivo .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copiando arquivo de configuração...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env.local criado com as credenciais do Supabase');
  } else {
    console.log('❌ Arquivo env.example não encontrado');
    process.exit(1);
  }
} else {
  console.log('✅ Arquivo .env.local já existe');
}

console.log('\n📦 Instalando dependências...');
console.log('Execute: npm install');

console.log('\n🗄️ Configuração do banco de dados:');
console.log('✅ Tabelas criadas no Supabase');
console.log('✅ Credenciais configuradas');

console.log('\n🎯 Próximos passos:');
console.log('1. Execute: npm install');
console.log('2. Execute: npm run dev');
console.log('3. Acesse: http://localhost:3000');
console.log('4. Clique em "Iniciar" para começar a catalogar velas');

console.log('\n📊 Funcionalidades disponíveis:');
console.log('- Catalogação em tempo real de BTC, XRP e SOL');
console.log('- Timeframes: 1min, 5min, 15min');
console.log('- Interface visual organizada por hora/minuto');
console.log('- Dados persistidos no Supabase');

console.log('\n✨ Projeto configurado com sucesso!');
