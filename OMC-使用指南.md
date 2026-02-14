# oh-my-claudecode (OMC) 使用指南

> **多代理编排 for Claude Code. 低学习曲线.**
> *Don't learn Claude Code. Just use OMC.*

---

## 🚀 快速开始（3步）

### 前置条件
- ✅ 已安装 [Claude Code CLI](https://docs.anthropic.com/claude-code) ≥ 1.0.0
- ✅ Claude Max/Pro 订阅 **或** Anthropic API 密钥
- ✅ 推荐：Claude Code ≥ 1.5.0（支持 Team 模式）

### Step 1: 安装插件
```bash
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode
```

### Step 2: 一键设置
```bash
/oh-my-claudecode:omc-setup
```

### Step 3: 开始构建
```bash
# 新手推荐：自主执行
autopilot: build a REST API for managing tasks

# 多任务协作
/oh-my-claudecode:team 3:executor "fix all TypeScript errors"
```

---

## 📋 模式选择决策树

```
你的任务
    │
    ├─ 需要 3+ 个并行独立任务？
    │   ├─ 是 → [Ultrawork] 最快
    │   └─ 否 → 继续
    │
    ├─ 需要严格阶段验证（plan → proof → exec → verify）？
    │   ├─ 是 → [Team] 协作任务
    │   └─ 否 → 继续
    │
    ├─ 预算有限且任务简单？
    │   ├─ 是 → [Ecomode] 节省 30-50% token
    │   └─ 否 → 继续
    │
    ├─ 必须 100% 完成，不能有部分失败？
    │   ├─ 是 → [Ralph] 持久验证
    │   └─ 否 → 继续
    │
    └─ 端到端实现一个功能？
        └─ 是 → [Autopilot] 日常首选
```

### 模式对照表

| 工作场景 | 推荐模式 | 命令示例 |
|---------|-----------|-----------|
| **快速实现功能** (端到端) | `autopilot` | `autopilot: build a REST API` |
| **多模块协作重构** | `team` | `/oh-my-claudecode:team 3:executor "refactor auth"` |
| **必须完成的任务** (无失败容忍) | `ralph` | `ralph: migrate database` |
| **批量修复/小重构** | `ultrawork` | `ulw fix all lint errors` |
| **规划复杂功能** (需求不明确) | `plan` | `/oh-my-claudecode:plan "API redesign"` |
| **预算敏感迭代** | `ecomode` | `ecomode: optimize performance` |
| **QA 循环测试** | `ultraqa` | `/oh-my-claudecode:ultraqa --tests` |
| **深度分析调查** | `analyze` | `analyze: investigate memory leak` |

---

## 💡 最佳工作流

### 1️⃣ 新功能开发（推荐 Team + Ralph）

```bash
# 阶段1：规划
/oh-my-claudecode:plan "build user authentication system"

# 阶段2：执行（带验证循环）
/oh-my-claudecode:team ralph "build user authentication system"
# 流程: team-plan → team-prd → team-exec → team-verify → team-fix (循环)
```

**何时使用**：涉及 3+ 个文件/模块的复杂功能

### 2️⃣ Bug 修复

```bash
# 简单 bug（5分钟内）
ralph: fix login bug

# 复杂问题（需要分析）
analyze: investigate memory leak in API
```

### 3️⃣ 代码质量保障

```bash
# 全面代码审查
/code-review

# 安全专项审查
/security-review

# TDD 模式开发
/tdd "add user preferences feature"

# 修复构建错误
/build-fix
```

### 4️⃣ 获取个性化建议

```bash
# 分析你的 OMC 使用模式，获得针对性优化建议
/oh-my-claudecode:learn-about-omc
```

---

## 🔑 Magic Keywords 速查

在日常对话中使用这些关键词即可触发对应模式：

| 关键词 | 效果 | 示例 |
|-------|------|------|
| `team` | 多代理协作 | `team 5 agents refactor payment` |
| `autopilot` | 自主执行 | `autopilot: build user dashboard` |
| `ralph` | 持久验证 | `ralph: migrate to PostgreSQL` |
| `ulw` / `ultrawork` | 最大并行化 | `ulw fix all type errors` |
| `eco` / `ecomode` | token 高效执行 | `ecomode: update dependencies` |
| `plan` | 规划模式 | `plan this: add dark mode` |
| `ralplan` | 迭代规划共识 | `ralplan: microservices architecture` |
| `analyze` | 深度分析 | `analyze: why is API slow` |
| `swarm` | 遗群模式（兼容门面） | `swarm 3:executor fix lint` |

**调用方式**：
- **命令方式**：`/oh-my-claudecode:[skill-name]`
- **自然语言**：直接在对话中使用关键词

---

## 🎯 核心优势

1. **零配置** - 开箱即用，智能默认值
2. **自动并行化** - 复杂任务自动分配给专业代理
3. **持续执行** - 任务未完成前不会放弃（Ralph 模式）
4. **成本优化** - 智能模型路由节省 30-50% token
   - 简单任务（格式化、小重构）使用 Haiku 4.5（3x 便宜于 Sonnet）
   - 复杂推理才用 Opus
   - 通过 `omc stats` 查看实际节省情况
5. **37 种专业代理** - 架构、研究、测试、设计、数据科学全覆盖
6. **5 阶段流水线** (Team) - plan → prd → exec → verify → fix

---

## 🛡️ 常见问题排查

| 症状 | 解决方案 |
|------|---------|
| 命令无响应 | 检查插件是否加载：`/plugin list` |
| HUD 状态栏消失 | 检查 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 环境变量是否设置为 `"1"` |
| Team 模式警告 | 确保 Claude Code 版本 ≥ 1.5.0 |
| Token 超限 | 使用 `ecomode` 或等待速率限制重置 |
| 并发冲突 | 检查 `.omc/state/` 中的锁定文件 |
| 更新后异常 | 运行 `/oh-my-claudecode:doctor` 清理缓存 |

---

## 🔒 安全与隐私注意事项

### Multi-AI Orchestration 隐私警告

⚠️ **重要**：启用外部 AI 提供商（Codex/Gemini CLI）会**将您的代码上下文发送给第三方**（OpenAI/Google）。

| 提供商 | 用途 | 风险评估 |
|---------|------|----------|
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | UI 设计、大上下文 | 中等风险（Google 服务条款） |
| [Codex CLI](https://github.com/openai/codex) | 架构审查、代码验证 | 中等风险（OpenAI API） |

**建议**：
- ✅ 个人项目可随意使用
- ⚠️ 公司代码需确认合规性
- ❌ 专有代码/敏感数据禁止使用

### Bot Token 安全

⚠️ **安全提示**：
1. 将 Bot Token 存储在环境变量中，**不要硬编码在代码里**
2. 将 `~/.zshrc` 或 `~/.bashrc` 添加到 `.gitignore`（如果版本控制配置文件）
3. 使用项目级 `.env` 文件，**记得添加到 `.gitignore`**

### 环境变量隔离

⚠️ **注意**：在 `~/.claude/settings.json` 中设置环境变量会影响**所有 Claude Code 会话**。

项目级隔离（如果支持）：
```bash
/oh-my-claudecode:omc-setup --local
```

---

## 📚 命令速查

### 执行模式
```bash
/oh-my-claudecode:autopilot [task]
/oh-my-claudecode:team [N] [agent-type] "[task]"
/oh-my-claudecode:ralph "[task]"
/oh-my-claudecode:ultrawork "[task]"
/oh-my-claudecode:ecomode "[task]"
/oh-my-claudecode:ultraqa --tests
```

### 规划与分析
```bash
/oh-my-claudecode:plan "[task]"
/oh-my-claudecode:ralplan "[task]"
/oh-my-claudecode:analyze "[question]"
```

### 代码质量
```bash
/code-review
/security-review
/tdd "[task]"
/build-fix
```

### 实用工具
```bash
/oh-my-claudecode:cancel           # 取消运行中的任务
/oh-my-claudecode:note            # 保存笔记
/oh-my-claudecode:doctor          # 诊断安装问题
/oh-my-claudecode:trace           # 查看代理流程追踪
/oh-my-claudecode:learn-about-omc # 获取个性化建议
/oh-my-claudecode:help            # 完整帮助
```

---

## 💎 实用技巧

### 组合模式
| 组合 | 效果 | 适用场景 |
|------|------|----------|
| `ralph ulw:` | 持久化 + 最大并行化 | 必须完成的大型重构 |
| `eco ralph:` | 成本优化的验证循环 | 预算敏感的完整功能 |
| `team ralph:` | 多代理 + 持久验证 | 关键功能的多模块实现 |

### Token 节省
- 使用 `ecomode` 处理重构任务（节省 30-50%）
- 简单查询使用 `explore` 代理而非常 `architect`
- 运行 `omc stats` 监控每日花费

### 任务中断恢复
- Ralph 模式会自动保存进度到 `.omc/state/`
- 使用 `/oh-my-claudecode:cancel` 后可用 `ralph` 恢复

### 会话隔离
```bash
# 为每个功能创建独立环境（git worktree + tmux）
/oh-my-claudecode:project-session-manager
```

---

## 🔄 更新与维护

### 更新插件
```bash
# 1. 更新插件
/plugin install oh-my-claudecode

# 2. 重新运行设置刷新配置
/oh-my-claudecode:omc-setup

# 3. 如果遇到问题清理旧缓存
/oh-my-claudecode:doctor
```

### 查看使用统计
```bash
omc stats              # 会话统计
omc stats daily        # 每日花费
```

---

## 📚 进一步学习

- **[完整文档](https://yeachan-heo.github.io/oh-my-claudecode-website)** - 交互式指南和示例
- **[性能监控](docs/PERFORMANCE-MONITORING.md)** - 代理追踪、调试和优化
- **[架构说明](docs/ARCHITECTURE.md)** - 底层工作原理
- **[迁移指南](docs/MIGRATION.md)** - 从 v2.x 升级

---

## 🌟 模式层次架构

```
┌────────────────────────────────────────────────────────┐
│                    模式层次结构                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────┐    │
│  │  autopilot (全自主)                  │    │
│  │  ├─ 6 阶段流水线                │    │
│  │  ├─ 包含 ralph                      │    │
│  │  └─ 无法被其他模式包含            │    │
│  └────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────┐    │
│  │  ralph (持久化)                   │    │
│  │  ├─ 包含 ultrawork                  │    │
│  │  ├─ 可选: 包含 ecomode             │    │
│  │  └─ 验证后完成                      │    │
│  └────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────┐    │
│  │  team (多代理协调)                │    │
│  │  ├─ 5 阶段流水线                │    │
│  │  ├─ 可选: 链接到 ralph            │    │
│  │  └─ 支持 MCP workers (Codex/Gemini) │    │
│  └────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────┐    │
│  │  ultrawork (并行执行引擎)          │    │
│  │  └─ 组件模式，非独立持久化          │    │
│  └────────────────────────────────────────────┘    │
│                                                         │
│  ┌────────────────────────────────────────────┐    │
│  │  ecomode (横向修饰符)              │    │
│  │  └─ 覆盖所有模式的模型选择      │    │
│  └────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘
```

---

> **最后更新**: 2026-02-14 | **OMC 版本**: 4.2.7
