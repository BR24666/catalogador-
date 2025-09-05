# 🚀 Guia de Deploy - Catalogador de Velas

## 📋 Pré-requisitos

- Conta no Vercel
- Projeto configurado no Supabase
- Repositório no GitHub (recomendado)

## 🔧 Configuração do Supabase

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e a chave anônima

### 2. Executar Migrações
Execute as seguintes migrações SQL no editor SQL do Supabase:

```sql
-- Criar tabela principal para catalogar velas
CREATE TABLE candle_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair VARCHAR(10) NOT NULL CHECK (pair IN ('BTCUSDT', 'XRPUSDT', 'SOLUSDT')),
    timeframe VARCHAR(5) NOT NULL CHECK (timeframe IN ('1m', '5m', '15m')),
    timestamp TIMESTAMPTZ NOT NULL,
    open_price DECIMAL(20,8) NOT NULL,
    high_price DECIMAL(20,8) NOT NULL,
    low_price DECIMAL(20,8) NOT NULL,
    close_price DECIMAL(20,8) NOT NULL,
    volume DECIMAL(20,8) NOT NULL,
    color VARCHAR(5) NOT NULL CHECK (color IN ('GREEN', 'RED')),
    hour INTEGER NOT NULL,
    minute INTEGER NOT NULL,
    day INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    full_date DATE NOT NULL,
    time_key VARCHAR(10) NOT NULL,
    date_key DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_candle_catalog_pair_timeframe ON candle_catalog(pair, timeframe);
CREATE INDEX idx_candle_catalog_timestamp ON candle_catalog(timestamp);
CREATE INDEX idx_candle_catalog_date_time ON candle_catalog(full_date, hour, minute);
CREATE INDEX idx_candle_catalog_pair_date ON candle_catalog(pair, full_date);

-- Criar tabela para configurações do sistema
CREATE TABLE catalog_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    is_running BOOLEAN DEFAULT false,
    last_update TIMESTAMPTZ,
    update_interval_seconds INTEGER DEFAULT 60,
    pairs TEXT[] DEFAULT ARRAY['BTCUSDT', 'XRPUSDT', 'SOLUSDT'],
    timeframes TEXT[] DEFAULT ARRAY['1m', '5m', '15m'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configuração inicial
INSERT INTO catalog_settings (is_running, last_update, update_interval_seconds) 
VALUES (false, NOW(), 60);

-- Criar tabela para logs do sistema
CREATE TABLE catalog_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARNING', 'ERROR')),
    message TEXT NOT NULL,
    pair VARCHAR(10),
    timeframe VARCHAR(5),
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger para atualizar updated_at
CREATE TRIGGER update_candle_catalog_updated_at 
    BEFORE UPDATE ON candle_catalog 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_catalog_settings_updated_at 
    BEFORE UPDATE ON catalog_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🚀 Deploy no Vercel

### 1. Preparar o Repositório
```bash
# Inicializar git (se não estiver)
git init

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "Initial commit: Catalogador de Velas"

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/catalogador-velas.git
git push -u origin main
```

### 2. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase
5. Clique em "Deploy"

### 3. Configurar Domínio (Opcional)
1. No painel do Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

## 🔧 Configuração Pós-Deploy

### 1. Testar a Aplicação
1. Acesse sua URL do Vercel
2. Verifique se a interface carrega corretamente
3. Teste o botão "Iniciar" para começar a catalogar

### 2. Monitorar Logs
1. No painel do Vercel, vá em "Functions" > "View Function Logs"
2. Monitore os logs para verificar se há erros

### 3. Configurar RLS (Row Level Security)
No Supabase, configure as políticas RLS se necessário:

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE candle_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access" ON candle_catalog
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON catalog_settings
    FOR SELECT USING (true);

-- Política para permitir inserção/atualização
CREATE POLICY "Allow public insert/update" ON candle_catalog
    FOR ALL USING (true);

CREATE POLICY "Allow public insert/update" ON catalog_settings
    FOR ALL USING (true);

CREATE POLICY "Allow public insert" ON catalog_logs
    FOR INSERT WITH CHECK (true);
```

## 📊 Monitoramento

### 1. Métricas do Vercel
- Acesse o dashboard do Vercel
- Monitore performance, bandwidth e function invocations

### 2. Logs do Supabase
- Acesse o painel do Supabase
- Vá em "Logs" para verificar erros de banco

### 3. Status da Aplicação
- Use a página de análise para verificar dados
- Monitore a frequência de atualizações

## 🔄 Atualizações

### 1. Deploy Automático
- Push para a branch `main` = deploy automático
- Push para outras branches = preview deployments

### 2. Deploy Manual
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🐛 Troubleshooting

### Erro de Conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se as políticas RLS estão configuradas

### Erro de API da Binance
- A API da Binance pode ter rate limits
- Verifique se a aplicação está acessível publicamente
- Monitore os logs para erros específicos

### Performance Lenta
- Verifique os índices do banco de dados
- Monitore o uso de recursos no Vercel
- Considere otimizar as consultas

## 📈 Otimizações

### 1. Performance
- Use CDN do Vercel para assets estáticos
- Implemente cache para consultas frequentes
- Otimize imagens e componentes

### 2. Escalabilidade
- Configure auto-scaling no Vercel
- Use connection pooling no Supabase
- Implemente rate limiting se necessário

### 3. Segurança
- Configure CORS adequadamente
- Use HTTPS obrigatório
- Implemente validação de entrada

## 🎯 Próximos Passos

1. **Monitoramento**: Configure alertas para falhas
2. **Backup**: Configure backup automático do banco
3. **Analytics**: Adicione Google Analytics ou similar
4. **CI/CD**: Configure pipelines de teste automatizado
5. **Documentação**: Mantenha documentação atualizada

---

**Deploy realizado com sucesso! 🎉**

Sua aplicação está rodando e catalogando velas em tempo real.
