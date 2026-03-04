#!/usr/bin/env node
import cac from 'cac'
import { version } from '../package.json' with { type: 'json' }
import { banner } from './utils/ui.js'
import { initI18n } from './i18n/index.js'

await initI18n()

const cli = cac('cc-boot')

// Default: interactive menu
cli
  .command('', 'Interactive menu')
  .action(async () => {
    banner()
    const { menu } = await import('./commands/menu.js')
    await menu()
  })

// init: full initialization
cli
  .command('init', 'Full initialization of AI coding tools')
  .option('--all', 'Install all 5 tools')
  .option('--tools <tools>', 'Comma-separated tool list (cc,cx,gem,oc,claw)')
  .option('-s, --silent', 'Non-interactive mode')
  .option('-p, --provider <provider>', 'API provider preset name')
  .option('-k, --api-key <key>', 'API key')
  .option('-u, --api-url <url>', 'Custom API URL')
  .option('--lang <lang>', 'UI language (zh-CN | en)')
  .option('--ai-lang <lang>', 'AI output language')
  .option('--mcp <services>', 'Comma-separated MCP services')
  .option('--no-ccswitch', 'Skip CC Switch installation')
  .action(async (options) => {
    banner()
    const { init } = await import('./commands/init.js')
    await init(options)
  })

// setup: single tool install
cli
  .command('setup <tool>', 'Install and configure a single tool')
  .option('-s, --silent', 'Non-interactive mode')
  .option('-p, --provider <provider>', 'API provider')
  .option('-k, --api-key <key>', 'API key')
  .action(async (tool: string, options) => {
    banner()
    const { setupTool } = await import('./commands/setup-tool.js')
    await setupTool(tool, options)
  })

// doctor: environment diagnostics
cli
  .command('doctor', 'Environment diagnostics')
  .action(async () => {
    banner()
    const { doctor } = await import('./commands/doctor.js')
    await doctor()
  })

// handoff: export config to CC Switch
cli
  .command('handoff', 'Hand off configuration to CC Switch')
  .option('--install', 'Install CC Switch if not present')
  .action(async (options) => {
    banner()
    const { handoff } = await import('./commands/handoff.js')
    await handoff(options)
  })

cli.help()
cli.version(version)

cli.parse()
