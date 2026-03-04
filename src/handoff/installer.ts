import { x } from 'tinyexec'
import { t } from '../i18n/index.js'
import { CC_SWITCH_BREW_CASK } from '../constants.js'
import { spinner, success, fail, warn } from '../utils/ui.js'
import { hasHomebrew } from '../utils/platform.js'

const CC_SWITCH_DOWNLOAD_URL = 'https://github.com/nicepkg/cc-switch/releases/latest'

/**
 * Install CC Switch via Homebrew cask, with browser fallback.
 */
export async function installCcSwitch(): Promise<void> {
  const s = spinner(t('ccswitch.installing'))
  s.start()

  if (await hasHomebrew()) {
    try {
      await x('brew', ['install', '--cask', CC_SWITCH_BREW_CASK])
      s.stop()
      success(t('ccswitch.done'))
      return
    }
    catch {
      s.stop()
      warn('Homebrew install failed, opening download page...')
    }
  }

  // Fallback: open download URL in browser
  s.stop()
  try {
    await x('open', [CC_SWITCH_DOWNLOAD_URL])
    warn(`Please download CC Switch manually from: ${CC_SWITCH_DOWNLOAD_URL}`)
  }
  catch {
    fail(`Could not open browser. Download CC Switch from: ${CC_SWITCH_DOWNLOAD_URL}`)
  }
}
