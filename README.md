# 📊 Catalogador de Velas - BTC, XRP, SOL

Sistema de catalogação de velas de criptomoedas em tempo real com dados da Binance, desenvolvido para Vercel + Supabase.

## 🚀 Funcionalidades

- **Catalogação em Tempo Real**: Coleta dados de velas das criptomoedas BTC, XRP e SOL
- **Múltiplos Timeframes**: Suporte para 1 minuto, 5 minutos e 15 minutos
- **Interface Visual**: Grid organizado por hora e minuto para fácil visualização
- **Armazenamento Persistente**: Dados salvos no Supabase para análise posterior
- **Controle de Status**: Iniciar/parar o catalogador e monitorar status

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **API Externa**: Binance API
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Conta no Vercel (para deploy)

## ⚙️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd catalogador-velas
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas credenciais:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

4. **Configure o banco de dados**
   - Acesse seu projeto no Supabase
   - Execute as migrações SQL que estão no arquivo de migração
   - As tabelas serão criadas automaticamente

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🗄️ Estrutura do Banco de Dados

### Tabela `candle_catalog`
Armazena os dados das velas catalogadas:
- `id`: UUID único
- `pair`: Par de negociação (BTCUSDT, XRPUSDT, SOLUSDT)
- `timeframe`: Timeframe da vela (1m, 5m, 15m)
- `timestamp`: Timestamp da vela
- `open_price`, `high_price`, `low_price`, `close_price`: Preços OHLC
- `volume`: Volume negociado
- `color`: Cor da vela (GREEN/RED)
- `hour`, `minute`: Hora e minuto para organização
- `full_date`: Data completa
- `time_key`: Chave de tempo (HH:MM)
- `date_key`: Chave de data

### Tabela `catalog_settings`
Configurações do sistema:
- `is_running`: Status do catalogador
- `last_update`: Última atualização
- `update_interval_seconds`: Intervalo de atualização

### Tabela `catalog_logs`
Logs do sistema para debugging

## 🎯 Como Usar

1. **Iniciar o Catalogador**
   - Clique no botão "Iniciar" no painel de controle
   - O sistema começará a coletar dados automaticamente

2. **Visualizar Velas**
   - Selecione o par de negociação (BTC, XRP, SOL)
   - Escolha o timeframe (1m, 5m, 15m)
   - Selecione a data desejada
   - As velas aparecerão organizadas por hora e minuto

3. **Interpretar o Grid**
   - 🟢 Verde: Vela de alta (fechamento > abertura)
   - 🔴 Vermelho: Vela de baixa (fechamento < abertura)
   - Quadrado cinza: Sem dados para aquele período

## 📊 Deploy no Vercel

1. **Conecte o repositório ao Vercel**
2. **Configure as variáveis de ambiente** no painel do Vercel
3. **Deploy automático** será feito a cada push

## 🔧 Configurações Avançadas

### Intervalo de Atualização
Por padrão, o sistema atualiza a cada 60 segundos. Para alterar:
```typescript
await catalogService.startCataloging(30) // 30 segundos
```

### Pares de Negociação
Para adicionar novos pares, edite o array em `lib/catalog-service.ts`:
```typescript
const pairs = ['BTCUSDT', 'XRPUSDT', 'SOLUSDT', 'ETHUSDT']
```

## 📈 Próximas Funcionalidades

- [ ] Página de análise de dados
- [ ] Gráficos de performance
- [ ] Alertas personalizados
- [ ] Exportação de dados
- [ ] Análise de padrões

## 🐛 Troubleshooting

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo

### Dados não aparecem
- Verifique se o catalogador está rodando
- Confirme se há dados para a data selecionada
- Verifique os logs no console

### Erro de API da Binance
- A API da Binance pode ter rate limits
- Verifique sua conexão com a internet

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir funcionalidades
- Enviar pull requests

---

**Desenvolvido com ❤️ para análise de criptomoedas**
