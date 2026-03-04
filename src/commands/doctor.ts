import { t } from '../i18n/index.js'
import { heading, success, fail, info, kvLine, spinner, colors } from '../utils/ui.js'
import { commandExists, hasHomebrew, hasNpm, hasGo, hasPipx } from '../utils/platform.js'
import { TOOL_TYPES, TOOL_LABELS, type ToolType } from '../constants.js'
import { getAdapter } from '../tools/registry.js'
import { isCcSwitchInstalled } from '../handoff/detector.js'
import { detectProxy } from '../proxy/detector.js'

interface CheckResult {
  name: string
  ok: boolean
  detail: string
}

/**
 * Environment diagnostics — checks all tools, CC Switch, proxy, and system deps.
 */
export async function doctor(): Promise<void> {
  heading(t('doctor.title'))

  const s = spinner(t('doctor.checking'))
  s.start()

  const results: CheckResult[] = []

  // Check system dependencies
  const systemChecks: Array<{ name: string; check: () => Promise<boolean> }> = [
    { name: 'Node.js', check: () => commandExists('node') },
    { name: 'npm', check: hasNpm },
    { name: 'Homebrew', check: hasHomebrew },
    { name: 'Go', check: hasGo },
    { name: 'pipx', check: hasPipx },
  ]

  for (const { name, check } of systemChecks) {
    const ok = await check()
    results.push({ name, ok, detail: ok ? 'available' : 'not found' })
  }

  // Check each AI coding tool
  for (const toolType of TOOL_TYPES) {
    const result = await checkTool(toolType)
    results.push(result)
  }

  // Check CC Switch
  const ccSwitchOk = await isCcSwitchInstalled()
  results.push({
    name: 'CC Switch',
    ok: ccSwitchOk,
    detail: ccSwitchOk ? t('ccswitch.found') : t('ccswitch.not_found'),
  })

  // Check proxy
  const proxy = await detectProxy()
  results.push({
    name: 'Proxy',
    ok: proxy !== null,
    detail: proxy ? `${proxy.type} @ ${proxy.host}:${proxy.port}` : 'no proxy detected',
  })

  s.stop()

  // Print results
  console.log()
  for (const r of results) {
    const icon = r.ok ? colors.success('✓') : colors.error('✗')
    const detail = r.ok ? colors.success(r.detail) : colors.dim(r.detail)
    console.log(`  ${icon} ${colors.bold(r.name.padEnd(16))} ${detail}`)
  }
  console.log()

  const passed = results.filter(r => r.ok).length
  const total = results.length
  info(`${passed}/${total} checks passed`)
}

async function checkTool(toolType: ToolType): Promise<CheckResult> {
  const label = TOOL_LABELS[toolType]
  try {
    const adapter = getAdapter(toolType)
    const installed = await adapter.isInstalled()
    if (!installed) {
      return { name: label, ok: false, detail: t('tools.not_installed') }
    }
    const version = await adapter.detectVersion()
    return {
      name: label,
      ok: true,
      detail: version ? t('tools.version', { version }) : t('tools.installed'),
    }
  }
  catch {
    return { name: label, ok: false, detail: t('tools.not_installed') }
  }
}
