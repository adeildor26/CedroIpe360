# Corrige identidade Git apenas neste repositorio e conclui o envio
$ErrorActionPreference = "Stop"
$RepoPath = "C:\CedroIpe360\_GITHUB\CedroIpe360"
$GitName = "adeildor26"
$GitEmail = "adeildor26@users.noreply.github.com"

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
    throw "Repositorio Git nao encontrado em $RepoPath. Nao foi feita nenhuma alteracao."
}
Push-Location $RepoPath
try {
    Write-Host "1/4 - Configurando identidade somente neste repositorio..."
    git config user.name $GitName
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel configurar user.name." }
    git config user.email $GitEmail
    if ($LASTEXITCODE -ne 0) { throw "Nao foi possivel configurar user.email." }

    Write-Host "2/4 - Conferindo arquivos..."
    git status --short --branch
    git add -A
    if ($LASTEXITCODE -ne 0) { throw "Falha ao preparar os arquivos." }

    $staged = git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        Write-Host "3/4 - Criando commit..."
        git commit -m "Organiza estrutura oficial e evidencias do CedroIpe360"
        if ($LASTEXITCODE -ne 0) { throw "Commit falhou. Veja a mensagem acima." }
    } elseif ($LASTEXITCODE -eq 0) {
        Write-Host "3/4 - Nenhuma alteracao pendente para commit."
    } else {
        throw "Nao foi possivel verificar o estado dos arquivos."
    }

    Write-Host "4/4 - Enviando para GitHub (origin/main)..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "Push nao concluido. O commit permanece salvo localmente. Verifique a autenticacao GitHub no Windows."
    }

    Write-Host ""
    Write-Host "SUCESSO: identidade local configurada e alteracoes enviadas ao GitHub." -ForegroundColor Green
    git status --short --branch
}
finally {
    Pop-Location
}
