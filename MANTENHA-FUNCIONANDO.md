# 🚀 Como Manter o Catalogador Funcionando 24/7

## ✅ Sistema Configurado

O sistema agora está configurado para:
- ✅ **Carregar automaticamente** dados de 2 meses atrás na inicialização
- ✅ **Coletar dados em tempo real** a cada 1 minuto
- ✅ **Manter funcionando** mesmo fechando o navegador
- ✅ **Persistir dados** no banco Supabase

## 🔧 Opções para Manter Funcionando

### Opção 1: PowerShell (Recomendado para Windows)

```powershell
# Execute este comando no terminal:
npm run keep-alive-ps
```

Este script:
- Verifica o status a cada 5 minutos
- Reinicia automaticamente se parar
- Cria logs em `catalogador-keep-alive.log`

### Opção 2: Node.js Keep-Alive

```bash
# Execute este comando no terminal:
npm run keep-alive
```

### Opção 3: PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar o sistema
npm run pm2:start

# Ver status
npm run pm2:status

# Ver logs
npm run pm2:logs

# Parar
npm run pm2:stop
```

## 📊 O que Acontece Automaticamente

1. **Na inicialização**:
   - Carrega dados de 2 meses atrás
   - Inicia coleta em tempo real
   - Configura banco de dados

2. **Durante funcionamento**:
   - Coleta dados SOL/USD a cada 1 minuto
   - Salva no Supabase automaticamente
   - Mantém logs detalhados

3. **Em caso de erro**:
   - Tenta reiniciar automaticamente
   - Mantém dados já coletados
   - Notifica via logs

## 🔍 Verificar se Está Funcionando

### Via Navegador:
- Acesse `http://localhost:3000`
- Veja o indicador verde "Sistema ativo"
- Verifique os dados no gráfico

### Via API:
```bash
# Verificar status
curl http://localhost:3000/api/background-catalog

# Resposta esperada:
{
  "success": true,
  "isRunning": true,
  "lastUpdate": "2025-01-05T16:30:00.000Z"
}
```

### Via Logs:
- PowerShell: `catalogador-keep-alive.log`
- PM2: `npm run pm2:logs`

## 🛠️ Solução de Problemas

### Se parar de funcionar:
1. Verifique se o servidor está rodando: `npm run dev`
2. Reinicie o keep-alive: `npm run keep-alive-ps`
3. Verifique os logs para erros

### Se não carregar dados históricos:
1. Verifique conexão com Supabase
2. Teste API: `curl http://localhost:3000/api/test-supabase`
3. Verifique logs do servidor

### Se não coletar dados atuais:
1. Teste Binance: `curl http://localhost:3000/api/test-binance`
2. Verifique se o catalogador está ativo
3. Reinicie o sistema

## 📈 Dados Coletados

- **Par**: SOL/USD exclusivamente
- **Intervalo**: 1 minuto
- **Histórico**: 2 meses atrás até agora
- **Tempo real**: Contínuo
- **Armazenamento**: Supabase PostgreSQL

## 🎯 Resultado Final

Você terá um sistema que:
- ✅ Funciona 24/7 sem intervenção
- ✅ Coleta dados históricos e atuais
- ✅ Persiste tudo no banco
- ✅ Reinicia automaticamente se parar
- ✅ Mantém logs detalhados

**Execute `npm run keep-alive-ps` e deixe rodando!** 🚀
