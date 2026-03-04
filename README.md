# cc-boot

One-command bootstrap for AI coding CLI tools -- installs, configures, and hands off to [CC Switch](https://github.com/nicepkg/cc-switch).

[English](#features) | [中文](#功能特性)

## Features

- **One-command setup** -- Bootstrap 5 AI coding tools with a single command
- **Supported tools**: Claude Code, Codex CLI, Gemini CLI, OpenCode, OpenClaw
- **MCP integration** -- Auto-configure popular MCP services (Brave Search, Exa, Tavily, GitHub, GitLab, Slack, Notion, Linear, etc.)
- **API provider presets** -- Quick configuration for various API providers
- **Doctor diagnostics** -- Verify your environment setup with `cc-boot doctor`
- **CC Switch handoff** -- Seamlessly export config to CC Switch for tool switching
- **Bilingual** -- Full Chinese (zh-CN) and English UI support

## Install

```bash
# Run directly (recommended)
npx cc-boot

# Or install globally
npm i -g cc-boot
```

## Usage

```bash
# Interactive menu (default)
cc-boot

# Full initialization
cc-boot init
cc-boot init --all                  # Install all 5 tools
cc-boot init --tools cc,gem,oc      # Install specific tools

# Single tool setup
cc-boot setup claude-code
cc-boot setup gemini-cli

# Environment diagnostics
cc-boot doctor

# Hand off to CC Switch
cc-boot handoff
cc-boot handoff --install
```

### CLI Options

| Flag | Description |
|------|-------------|
| `--all` | Install all 5 tools |
| `--tools <list>` | Comma-separated tool list (cc, cx, gem, oc, claw) |
| `-s, --silent` | Non-interactive mode |
| `-p, --provider <name>` | API provider preset |
| `-k, --api-key <key>` | API key |
| `-u, --api-url <url>` | Custom API URL |
| `--lang <lang>` | UI language (zh-CN \| en) |
| `--ai-lang <lang>` | AI output language |
| `--mcp <services>` | Comma-separated MCP services |
| `--no-ccswitch` | Skip CC Switch installation |

## Programmatic API

```ts
import { TOOL_TYPES, TOOL_LABELS, TOOL_ALIASES } from 'cc-boot'
```

## Requirements

- Node.js >= 18

## License

MIT

---

# cc-boot

一键引导 AI 编程 CLI 工具 -- 安装、配置，然后交接给 [CC Switch](https://github.com/nicepkg/cc-switch)。

## 功能特性

- **一键配置** -- 一条命令引导 5 个 AI 编程工具
- **支持工具**: Claude Code, Codex CLI, Gemini CLI, OpenCode, OpenClaw
- **MCP 集成** -- 自动配置热门 MCP 服务（Brave Search, Exa, Tavily, GitHub, GitLab, Slack, Notion, Linear 等）
- **API 供应商预设** -- 快速配置各种 API 供应商
- **Doctor 诊断** -- 通过 `cc-boot doctor` 验证环境配置
- **CC Switch 交接** -- 无缝导出配置到 CC Switch 实现工具切换
- **双语** -- 完整的中文 (zh-CN) 和英文界面支持

## 安装

```bash
# 直接运行（推荐）
npx cc-boot

# 或全局安装
npm i -g cc-boot
```

## 使用方式

```bash
# 交互式菜单（默认）
cc-boot

# 完整初始化
cc-boot init
cc-boot init --all                  # 安装全部 5 个工具
cc-boot init --tools cc,gem,oc      # 安装指定工具

# 单个工具配置
cc-boot setup claude-code
cc-boot setup gemini-cli

# 环境诊断
cc-boot doctor

# 交接到 CC Switch
cc-boot handoff
cc-boot handoff --install
```

## 要求

- Node.js >= 18

## 许可证

MIT
