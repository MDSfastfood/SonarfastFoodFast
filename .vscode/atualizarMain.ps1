
$ErrorActionPreference = "Stop"

function Invoke-Git {
    param([string[]]$GitArgs)

    & git @GitArgs

    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar: git $($GitArgs -join ' ')"
    }
}

try {
    # Identifica a branch atual
    $branch = git branch --show-current

    if ($LASTEXITCODE -ne 0 -or -not $branch) {
        throw "Não foi possível identificar a branch atual."
    }

    if ($branch -eq "main") {
        throw "Você está na main. Troque para sua branch pessoal primeiro."
    }

    # Verifica se existem alterações não salvas
    $changes = git status --porcelain

    if ($LASTEXITCODE -ne 0) {
        throw "Não foi possível verificar o estado do Git."
    }

    if ($changes) {
        throw "Existem alterações não commitadas. Faça commit ou guarde-as antes de continuar."
    }

    Write-Host "`nBuscando atualizações..." -ForegroundColor Cyan
    Invoke-Git @("fetch", "origin")

    Write-Host "`nAtualizando main..." -ForegroundColor Cyan
    Invoke-Git @("switch", "main")
    Invoke-Git @("pull", "--ff-only", "origin", "main")

    Write-Host "`nVoltando para $branch..." -ForegroundColor Cyan
    Invoke-Git @("switch", $branch)

    Write-Host "`nIntegrando main na sua branch..." -ForegroundColor Cyan
    Invoke-Git @("merge", "--no-edit", "main")

    Write-Host "`nEnviando atualizações para o GitHub..." -ForegroundColor Cyan
    Invoke-Git @("push", "-u", "origin", $branch)

    Write-Host "`nAtualização concluída!" -ForegroundColor Green
}
catch {
    Write-Host "`nATENÇÃO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Confira o estado do Git antes de continuar." -ForegroundColor Yellow
    exit 1
}
