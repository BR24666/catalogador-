# Configuração do Catalogador SOL/USD

## Configuração das Variáveis de Ambiente

Para que o catalogador funcione corretamente, você precisa criar um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lgddsslskhzxtpjathjr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZGRzc2xza2h6eHRwamF0aGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTQ1ODcsImV4cCI6MjA2MDU3MDU4N30._hnImYIRQ_102sY0X_TAWBKS1J71SpXt1Xjr2HvJIws

# Binance API (opcional, para dados em tempo real)
BINANCE_API_URL=https://api.binance.com/api/v3
```

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Crie o arquivo `.env.local` com as variáveis acima

3. Execute o projeto:
```bash
npm run dev
```

## Funcionalidades

- ✅ Coleta automática de dados SOL/USD a cada 1 minuto
- ✅ Início automático do catalogador
- ✅ Interface simplificada focada em SOL/USD
- ✅ Visualização em grid das velas por hora
- ✅ Atualização em tempo real dos dados

## Estrutura do Banco de Dados

O projeto usa as seguintes tabelas no Supabase:

- `candle_catalog`: Armazena os dados das velas
- `catalog_settings`: Configurações do catalogador
- `catalog_logs`: Logs de erro (opcional)

## Solução de Problemas

Se os dados não estiverem aparecendo:

1. Verifique se o arquivo `.env.local` está configurado corretamente
2. Verifique se o Supabase está acessível
3. Verifique os logs do console do navegador
4. Verifique se a API da Binance está respondendo
