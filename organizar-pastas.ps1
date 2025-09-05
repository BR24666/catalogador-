# Script para organizar as pastas do projeto
Write-Host "🧹 Organizando pastas do projeto..." -ForegroundColor Yellow

# Navegar para o diretório pai
Set-Location "C:\Users\br246\OneDrive\Área de Trabalho\Nova pasta"

# Listar pastas existentes
Write-Host "📁 Pastas encontradas:" -ForegroundColor Cyan
Get-ChildItem -Directory | Select-Object Name

# Verificar se existem as duas pastas
$pasta1 = "Catalogador"
$pasta2 = "catalogador passado atual"

if (Test-Path $pasta1 -PathType Container) {
    Write-Host "✅ Pasta '$pasta1' encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Pasta '$pasta1' não encontrada" -ForegroundColor Red
}

if (Test-Path $pasta2 -PathType Container) {
    Write-Host "✅ Pasta '$pasta2' encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Pasta '$pasta2' não encontrada" -ForegroundColor Red
}

# Copiar arquivos da pasta Catalogador para catalogador passado atual
if ((Test-Path $pasta1) -and (Test-Path $pasta2)) {
    Write-Host "🔄 Copiando arquivos de '$pasta1' para '$pasta2'..." -ForegroundColor Yellow
    
    # Copiar todos os arquivos, exceto node_modules
    Get-ChildItem -Path $pasta1 -Exclude "node_modules" | ForEach-Object {
        $destino = Join-Path $pasta2 $_.Name
        if ($_.PSIsContainer) {
            if (Test-Path $destino) {
                Remove-Item $destino -Recurse -Force
            }
            Copy-Item $_.FullName $destino -Recurse -Force
            Write-Host "  📁 Copiado: $($_.Name)" -ForegroundColor Gray
        } else {
            Copy-Item $_.FullName $destino -Force
            Write-Host "  📄 Copiado: $($_.Name)" -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Cópia concluída!" -ForegroundColor Green
    
    # Perguntar se quer deletar a pasta duplicada
    $resposta = Read-Host "🗑️ Deseja deletar a pasta '$pasta1'? (s/n)"
    if ($resposta -eq "s" -or $resposta -eq "S") {
        Remove-Item $pasta1 -Recurse -Force
        Write-Host "✅ Pasta '$pasta1' deletada!" -ForegroundColor Green
    }
    
    Write-Host "🎉 Organização concluída! Use a pasta '$pasta2'" -ForegroundColor Green
} else {
    Write-Host "❌ Não foi possível organizar as pastas" -ForegroundColor Red
}

Write-Host "Pressione qualquer tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
