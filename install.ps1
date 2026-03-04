# cc-boot installer for Windows — auto-installs Node.js if missing, then runs cc-boot
# Usage: irm https://raw.githubusercontent.com/wh000wh000/cc-boot/main/install.ps1 | iex

$ErrorActionPreference = "Stop"
$REQUIRED_NODE_MAJOR = 18
$CC_BOOT_PKG = "@haibane/cc-boot"

function Write-Info  { Write-Host "[cc-boot] $args" -ForegroundColor Cyan }
function Write-Ok    { Write-Host "[cc-boot] $args" -ForegroundColor Green }
function Write-Warn  { Write-Host "[cc-boot] $args" -ForegroundColor Yellow }
function Write-Fail  { Write-Host "[cc-boot] $args" -ForegroundColor Red; exit 1 }

function Test-Command { param($Name) $null -ne (Get-Command $Name -ErrorAction SilentlyContinue) }

function Get-NodeMajor {
    try {
        $ver = (node --version) -replace '^v', ''
        return [int]($ver.Split('.')[0])
    } catch { return 0 }
}

function Install-Node {
    Write-Info "Node.js >= $REQUIRED_NODE_MAJOR not found. Installing..."

    # Try fnm first
    if (Test-Command "fnm") {
        Write-Info "Using fnm to install Node.js LTS..."
        fnm install --lts
        fnm use lts-latest
        return
    }

    # Try winget
    if (Test-Command "winget") {
        Write-Info "Using winget to install Node.js LTS..."
        winget install --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        return
    }

    # Try choco
    if (Test-Command "choco") {
        Write-Info "Using Chocolatey to install Node.js LTS..."
        choco install nodejs-lts -y
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        return
    }

    # Try scoop
    if (Test-Command "scoop") {
        Write-Info "Using Scoop to install Node.js LTS..."
        scoop install nodejs-lts
        return
    }

    # Fallback: install fnm
    Write-Info "Installing fnm..."
    winget install Schniz.fnm --accept-package-agreements --accept-source-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    fnm install --lts
    fnm use lts-latest
}

# Main
Write-Info "Detected OS: Windows"

if (Test-Command "node") {
    $major = Get-NodeMajor
    $ver = (node --version) -replace '^v', ''
    if ($major -ge $REQUIRED_NODE_MAJOR) {
        Write-Ok "Node.js v$ver found"
    } else {
        Write-Warn "Node.js v$ver is too old (need >= $REQUIRED_NODE_MAJOR)"
        Install-Node
    }
} else {
    Install-Node
}

# Verify
if (-not (Test-Command "node")) {
    Write-Fail "Node.js installation failed. Please install manually: https://nodejs.org"
}

$ver = (node --version) -replace '^v', ''
Write-Ok "Node.js v$ver ready"

# Run cc-boot
Write-Info "Launching cc-boot..."
npx "$CC_BOOT_PKG@latest" @args
