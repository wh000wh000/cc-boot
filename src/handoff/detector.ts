import { x } from 'tinyexec'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { homedir } from 'node:os'
import { CC_SWITCH_BREW_CASK } from '../constants.js'

/**
 * Check if CC Switch is installed via multiple detection methods:
 *
 * macOS:
 *   1. /Applications/CC Switch.app
 *   2. ~/Applications/CC Switch.app
 *   3. Homebrew cask list
 *
 * Linux:
 *   1. ~/.local/bin/cc-switch (AppImage)
 *   2. which cc-switch (system PATH)
 *   3. dpkg -l (Debian/Ubuntu)
 *   4. rpm -q (Fedora/RHEL)
 *
 * Windows:
 *   1. %LOCALAPPDATA%\Programs\cc-switch
 *   2. %ProgramFiles%\cc-switch
 */
export async function isCcSwitchInstalled(): Promise<boolean> {
  const platform = process.platform

  if (platform === 'darwin') {
    return isCcSwitchInstalledMacos()
  }
  else if (platform === 'linux') {
    return isCcSwitchInstalledLinux()
  }
  else if (platform === 'win32') {
    return isCcSwitchInstalledWindows()
  }

  return false
}

async function isCcSwitchInstalledMacos(): Promise<boolean> {
  // Check /Applications and ~/Applications
  const appPaths = [
    '/Applications/CC Switch.app',
    join(homedir(), 'Applications', 'CC Switch.app'),
  ]
  for (const p of appPaths) {
    if (existsSync(p)) return true
  }

  // Check brew cask
  try {
    const result = await x('brew', ['list', '--cask', CC_SWITCH_BREW_CASK], {
      throwOnError: false,
    })
    if (result.exitCode === 0) return true
  }
  catch {
    // brew not available, skip
  }

  return false
}

async function isCcSwitchInstalledLinux(): Promise<boolean> {
  const home = homedir()

  // 1. AppImage in ~/.local/bin
  if (existsSync(join(home, '.local', 'bin', 'cc-switch'))) return true

  // 2. In system PATH
  try {
    const result = await x('which', ['cc-switch'], { throwOnError: false })
    if (result.exitCode === 0 && result.stdout.trim()) return true
  }
  catch { /* ignore */ }

  // 3. dpkg (Debian/Ubuntu)
  try {
    const result = await x('dpkg', ['-l', 'cc-switch'], { throwOnError: false })
    if (result.exitCode === 0 && result.stdout.includes('cc-switch')) return true
  }
  catch { /* ignore */ }

  // 4. rpm (Fedora/RHEL)
  try {
    const result = await x('rpm', ['-q', 'cc-switch'], { throwOnError: false })
    if (result.exitCode === 0) return true
  }
  catch { /* ignore */ }

  // 5. Flatpak
  try {
    const result = await x('flatpak', ['list', '--app'], { throwOnError: false })
    if (result.exitCode === 0 && result.stdout.includes('ccswitch')) return true
  }
  catch { /* ignore */ }

  return false
}

function isCcSwitchInstalledWindows(): boolean {
  const localAppData = process.env.LOCALAPPDATA ?? ''
  const programFiles = process.env.ProgramFiles ?? 'C:\\Program Files'
  const programFilesX86 = process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)'

  const candidates = [
    join(localAppData, 'Programs', 'cc-switch', 'CC Switch.exe'),
    join(programFiles, 'cc-switch', 'CC Switch.exe'),
    join(programFilesX86, 'cc-switch', 'CC Switch.exe'),
  ]

  return candidates.some(p => existsSync(p))
}
