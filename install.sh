#!/usr/bin/env bash
set -euo pipefail

# cc-boot installer — auto-installs Node.js if missing, then runs cc-boot
# Usage: curl -fsSL https://raw.githubusercontent.com/wh000wh000/cc-boot/main/install.sh | bash

REQUIRED_NODE_MAJOR=18
CC_BOOT_PKG="@haibane/cc-boot"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { printf "${CYAN}[cc-boot]${NC} %s\n" "$*"; }
ok()    { printf "${GREEN}[cc-boot]${NC} %s\n" "$*"; }
warn()  { printf "${YELLOW}[cc-boot]${NC} %s\n" "$*"; }
fail()  { printf "${RED}[cc-boot]${NC} %s\n" "$*"; exit 1; }

# Detect OS
detect_os() {
  case "$(uname -s)" in
    Darwin*)  echo "macos" ;;
    Linux*)   echo "linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
    *)        echo "unknown" ;;
  esac
}

# Check if a command exists
has() { command -v "$1" &>/dev/null; }

# Get Node.js major version
node_major() {
  node --version 2>/dev/null | sed 's/^v//' | cut -d. -f1
}

# Install Node.js via the best available method
install_node() {
  local os="$1"
  info "Node.js >= ${REQUIRED_NODE_MAJOR} not found. Installing..."

  # Try fnm first (fast, cross-platform)
  if has fnm; then
    info "Using fnm to install Node.js LTS..."
    fnm install --lts
    eval "$(fnm env)"
    return
  fi

  # Try nvm
  if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
    info "Using nvm to install Node.js LTS..."
    . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm install --lts
    return
  fi

  # OS-specific fallbacks
  case "$os" in
    macos)
      if has brew; then
        info "Using Homebrew to install Node.js..."
        brew install node
      else
        info "Installing fnm..."
        curl -fsSL https://fnm.vercel.app/install | bash
        eval "$(fnm env)"
        fnm install --lts
      fi
      ;;
    linux)
      info "Installing fnm..."
      curl -fsSL https://fnm.vercel.app/install | bash
      export PATH="$HOME/.local/share/fnm:$PATH"
      eval "$(fnm env)"
      fnm install --lts
      ;;
    *)
      fail "Unsupported OS. Please install Node.js >= ${REQUIRED_NODE_MAJOR} manually: https://nodejs.org"
      ;;
  esac
}

main() {
  local os
  os="$(detect_os)"
  info "Detected OS: ${os}"

  # Check Node.js
  if has node; then
    local major
    major="$(node_major)"
    if [ "$major" -ge "$REQUIRED_NODE_MAJOR" ]; then
      ok "Node.js v$(node --version | sed 's/^v//') found"
    else
      warn "Node.js v$(node --version | sed 's/^v//') is too old (need >= ${REQUIRED_NODE_MAJOR})"
      install_node "$os"
    fi
  else
    install_node "$os"
  fi

  # Verify node is available
  if ! has node; then
    fail "Node.js installation failed. Please install manually: https://nodejs.org"
  fi

  ok "Node.js v$(node --version | sed 's/^v//') ready"

  # Run cc-boot
  info "Launching cc-boot..."
  npx "${CC_BOOT_PKG}@latest" "$@"
}

main "$@"
