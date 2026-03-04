import { x } from 'tinyexec'
import { existsSync } from 'node:fs'
import { join } from 'pathe'
import { homedir } from 'node:os'
import { CC_SWITCH_BREW_CASK } from '../constants.js'

/**
 * Check if CC Switch is installed via multiple detection methods:
 * 1. Homebrew cask list
 * 2. /Applications/CC Switch.app
 * 3. ~/Applications/CC Switch.app
 */
export async function isCcSwitchInstalled(): Promise<boolean> {
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
