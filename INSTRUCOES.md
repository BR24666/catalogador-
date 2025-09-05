# 🚀 Instruções para Executar o Catalogador SOL/USD

## ✅ O que foi implementado:

1. **Foco em SOL/USD**: O catalogador agora trabalha apenas com o par SOL/USD
2. **Intervalo de 1 minuto**: Coleta dados a cada 1 minuto automaticamente
3. **Início automático**: O catalogador inicia automaticamente quando a aplicação é carregada
4. **Interface simplificada**: Removidas opções desnecessárias, foco total em SOL/USD
5. **Teste de conectividade**: Botão para testar se a API da Binance está funcionando

## 🔧 Como executar:

### 1. Instalar dependências:
```bash
npm install
```

### 2. Criar arquivo de configuração:
Crie um arquivo `.env.local` na raiz do projeto com:
```env
NEXT_PUBLIC_SUPABASE_URL=https://lgddsslskhzxtpjathjr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZGRzc2xza2h6eHRwamF0aGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ1ODcsImV4cCI6MjA2MDU3MDU4N30._hnImYIRQ_102sY0X_TAWBKS1J71SpXt1Xjr2HvJIws
BINANCE_API_URL=https://api.binance.com/api/v3
```

### 3. Executar o projeto:
```bash
npm run dev
```

### 4. Acessar no navegador:
Abra `http://localhost:3000`

## 🎯 Funcionalidades:

- ✅ **Coleta automática**: Inicia automaticamente ao carregar a página
- ✅ **SOL/USD apenas**: Foco total no par SOL/USD
- ✅ **1 minuto**: Coleta dados a cada 1 minuto
- ✅ **Interface limpa**: Sem opções desnecessárias
- ✅ **Teste de conexão**: Botão "Testar" para verificar conectividade
- ✅ **Grid de velas**: Visualização organizada por hora
- ✅ **Atualização em tempo real**: Dados atualizados a cada 30 segundos

## 🔍 Como testar:

1. **Teste de conectividade**: Clique no botão "Testar" para verificar se a API da Binance está funcionando
2. **Verificar dados**: Aguarde alguns minutos e veja as velas aparecendo no grid
3. **Mudar data**: Use o seletor de data para ver velas de dias anteriores
4. **Status**: O painel mostra se o catalogador está ativo e quando foi a última atualização

## 🐛 Solução de problemas:

- **Dados não aparecem**: Clique em "Testar" para verificar conectividade
- **Erro de conexão**: Verifique se o arquivo `.env.local` está correto
- **Catalogador não inicia**: Verifique os logs do console do navegador

## 📊 Estrutura dos dados:

- **Par**: SOLUSDT (SOL/USD)
- **Timeframe**: 1 minuto
- **Frequência**: A cada 1 minuto
- **Visualização**: Grid 24h x 60min
- **Cores**: Verde (alta) / Vermelho (baixa)
