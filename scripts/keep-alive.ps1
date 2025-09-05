# Script PowerShell para manter o catalogador funcionando
# Execute este script para manter o sistema ativo mesmo fechando o navegador

$API_URL = "http://localhost:3000"
$LOG_FILE = "catalogador-keep-alive.log"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path $LOG_FILE -Value $logMessage
}

function Check-CatalogerStatus {
    try {
        Write-Log "🔍 Verificando status do catalogador..."
        
        $response = Invoke-RestMethod -Uri "$API_URL/api/background-catalog" -Method GET
        return $response
    }
    catch {
        Write-Log "❌ Erro ao verificar status: $($_.Exception.Message)"
        return $null
    }
}

function Start-Cataloger {
    try {
        Write-Log "🚀 Iniciando catalogador..."
        
        $response = Invoke-RestMethod -Uri "$API_URL/api/background-catalog" -Method POST
        return $response
    }
    catch {
        Write-Log "❌ Erro ao iniciar catalogador: $($_.Exception.Message)"
        return $null
    }
}

function Main {
    Write-Log "🔄 Serviço de keep-alive iniciado"
    Write-Log "📊 Verificando status a cada 5 minutos..."
    
    while ($true) {
        $status = Check-CatalogerStatus
        
        if ($status -and $status.success) {
            if (-not $status.isRunning) {
                Write-Log "🔄 Catalogador parado. Iniciando..."
                $startResult = Start-Cataloger
                
                if ($startResult -and $startResult.success) {
                    Write-Log "✅ Catalogador iniciado com sucesso!"
                } else {
                    Write-Log "❌ Falha ao iniciar catalogador"
                }
            } else {
                Write-Log "✅ Catalogador ativo - Última atualização: $($status.lastUpdate)"
            }
        } else {
            Write-Log "❌ Não foi possível verificar o status do catalogador"
        }
        
        # Aguardar 5 minutos
        Start-Sleep -Seconds 300
    }
}

# Executar o script principal
Main
