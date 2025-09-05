@echo off
echo Copiando arquivos para organizar as pastas...

REM Criar diretório se não existir
if not exist "..\catalogador passado atual\app\api\reset-and-load" mkdir "..\catalogador passado atual\app\api\reset-and-load"

REM Copiar arquivos principais
copy "app\api\reset-and-load\route.ts" "..\catalogador passado atual\app\api\reset-and-load\route.ts"
copy "components\ControlPanel.tsx" "..\catalogador passado atual\components\ControlPanel.tsx"
copy "app\page.tsx" "..\catalogador passado atual\app\page.tsx"

echo Arquivos copiados com sucesso!
echo Agora use a pasta "catalogador passado atual" para executar o projeto.
pause
