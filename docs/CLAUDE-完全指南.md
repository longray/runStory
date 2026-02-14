# CLAUDE.md 完全指南

> **从零到精通：配置、更新、渐进式披露和最佳实践**

---

## 目录

1. [核心概念](#1-核心概念)
2. [CLAUDE.md 结构](#2-claude_md-结构)
3. [渐进式披露模式](#3-渐进式披露模式)
4. [配置与更新](#4-配置与更新)
5. [最佳实践](#5-最佳实践)
6. [高级技巧](#6-高级技巧)
7. [模板库](#7-模板库)
8. [常见问题](#8-常见问题)

---

## 1. 核心概念

### 什么是 CLAUDE.md？

CLAUDE.md 是项目的**指导文件**，为 Claude Code (claude.ai/code) 和开发团队提供：

- **项目特定知识**：独特模式、架构决策、工作流
- **可执行命令**：直接可用的命令和脚本
- **上下文优先**：在上下文窗口中优先级高
- **持续更新**：随项目演进而更新

### 上下文窗口机制

```
上下文窗口构成（约200K token）：
┌─────────────────────────────────────┐
│ 1. 系统提示 (System Prompt)         │ ~30K tokens
│ 2. 对话历史 (Conversation History) │ ~100K tokens
│ 3. 其他技能元数据 (Skills Metadata)│ ~10K tokens
│ 4. 你的请求 (Your Request)         │ ~10K tokens
│ 5. CLAUDE.md (Project Guidance)      │ ~50K tokens
└─────────────────────────────────────┘
```

**关键洞察**：CLAUDE.md 与其他所有内容**共享**这 50K token。每一行都必须证明其价值。

### 为什么重要？

|  处理方式 | 后果 |
|----------|------|
| **信息过量** | 浪费上下文，Claude 找不到关键信息 |
| **信息缺失** | Claude 猜测或猜测，导致错误 |
| **信息过时** | 违反项目规范，产生技术债务 |
| **持续更新** | 每个 Claude 会话都受益 |

---

## 2. CLAUDE.md 结构

### 必需字段（YAML Frontmatter）

```yaml
---
# <项目名称>

<一句话描述项目目的>
```

**限制**：
- `name`: 最多 64 字符，仅字母、数字、连字符
- `description`: 最多 1024 字符，必须**第三人称**，描述何时使用

**示例**：
```yaml
---
# runStory - 项目指导

本文件为 Claude Code 和开发团队提供项目指导。
```

### 推荐章节

根据项目需要选择，不必全部使用：

| 章节 | 用途 | 何时使用 |
|------|------|----------|
| **Commands** | 文档化常用命令 | 项目有独特的构建/测试/部署命令 |
| **Architecture** | 描述代码库结构 | 模块关系、入口点、数据流 |
| **Key Files** | 列出重要文件 | 配置文件、核心模块、测试入口 |
| **Code Style** | 项目特定编码约定 | 代码风格不通用时 |
| **Environment** | 环境变量和设置 | 需要特定配置时 |
| **Testing** | 测试方法和约定 | 有特定测试模式时 |
| **Gotchas** | 非显而易见的模式/陷阱 | 解决重复问题的知识 |
| **Workflow** | 开发工作流模式 | 有特定流程时 |

### 基础模板

#### 最小模板

```markdown
# <项目名称>

<一句话描述>

## Commands

| Command | Description |
|---------|-------------|
| `<command>` | <description> |

## Architecture

<结构>
```

#### 完整模板

```markdown
# <项目名称>

<一句话描述>

## Commands

| Command | Description |
|---------|-------------|
| `<command>` | <description> |

## Architecture

<带描述的结构>

## Key Files

- `<path>` - <purpose>
- `<path>` - <purpose>

## Code Style

- <convention>
- <convention>

## Environment

Required:
- `<VAR>` - <purpose>

Setup:
- <setup step>

## Testing

- `<command>` - <what it tests>
- <testing convention or pattern>

## Gotchas

- <gotcha>
```

---

## 3. 渐进式披露模式

### 核心思想

**只在需要时提供详细信息**

像目录一样：
- **顶层概览**（SKILL.md）：快速浏览，找到指向
- **详细参考**（按需加载）：深度信息，按需加载
- **实用工具**（脚本，不加载）：执行时不消耗上下文

### 三层架构

```
┌───────────────────────────────────────────┐
│ Layer 1: SKILL.md（概览）                  │
│ - 何时使用此技能                        │
│ - 概要概述（1-2 句话）                 │
│ - 指向详细资源（按需）                 │
├───────────────────────────────────────────┤
│ Layer 2: Reference/（参考文件）              │
│ - API 整理文档                           │
│ - 配置选项详解                           │
├───────────────────────────────────────────┤
│ Layer 3: Scripts/（实用工具）                │
│ - 可执行脚本                            │
│ - 数据验证工具                           │
│ - 不消耗上下文 token                    │
└───────────────────────────────────────────┘
```

### 模式选择指南

| 复杂度 | 推荐模式 | 文件组织 | 示例 |
|--------|----------|----------|------|
| **简单任务** | 单文件 SKILL.md | 内联代码 | PDF 处理 |
| **多领域** | 领域分离 | reference/<domain>.md | BigQuery 分析 |
| **复杂流程** | 工作流清单 | 独立 checklist.md | 研究 |
| **有脚本** | 实用工具目录 | scripts/*.py | 性能测试 |

---

## 4. 配置与更新

### 创建工作流

#### Step 1: 识别需求

```
在开发中遇到重复问题？
→ 添加到 Gotchas 章节

新成员不知道如何运行测试？
→ 更新 Commands 章节
```

#### Step 2: 草拟变更

```markdown
## Gotchas

+ Tests must run sequentially (`--runInBand`) due to shared DB state
+ `yarn.lock` is authoritative; delete `node_modules` if deps mismatch
```

**为什么防止**：重复调试会话

#### Step 3: 验证准确性

```bash
# 确认命令可执行
npm run build:prod

# 确认文件存在
cat src/config/database.ts
```

#### Step 4: 提交变更

```bash
git add CLAUDE.md
git commit -m "docs: add database gotcha to CLAUDE.md"
```

### 自动化更新

#### 使用 OMC 技能

```bash
# 自动审查和改进
/claude-md-improve

# 功能：
- 扫描所有 CLAUDE.md 文件
- 评估质量（6 维度评分）
- 提供具体改进建议
```

---

## 5. 最佳实践

### 1. 简洁原则

**问题示例**：
```markdown
## Commands

使用 uv 包管理器安装项目依赖：
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv sync
```

运行测试：
```bash
uv run -m pytest tests/ -v
```

代码格式化：
```bash
uv run -m black src/ tests/
```
```

**优化后**（约 50 tokens）：
```markdown
## Commands

| 命令 | 描述 |
|------|------|
| `uv sync` | 安装依赖 |
| `uv run -m pytest tests/ -v` | 运行测试 |
| `uv run -m black src/ tests/` | 格式化 |
```

### 2. 可执行性优先

**命令可直接复制粘贴执行**

```markdown
## 环境设置

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate
```

安装依赖：
```bash
pip install -r requirements.txt
```
```

### 3. 项目特定，非通用

**避免**：
```markdown
## Code Style

- 使用有意义的变量名
- 遵免硬编码
- 遵免过长函数（>50 行）
```

**推荐**：
```markdown
## Code Style

- 命名：camelCase（变量）、PascalCase（类型）
- 函数名：动词开头（getUserData、validateInput）
- 单一职责：每个函数只做一件事
```

### 4. 保持时效性

#### 版本标记变更

```markdown
## Authentication

### Current method（2025-01-01+）

使用 JWT (HS256) 进行身份验证：
- Token 存储在 `Authorization: Bearer <token>` header
- 有效期：24 小时
```

### 旧模式（已废弃）

```markdown
## Legacy（deprecated 2024-12-15）

~~Session-based authentication~~
- ~~Cookie-based~~
```

### 5. 使用一致的术语

| 功能 | 统一术语 | 避免使用 |
|------|----------|----------|
| API 端点 | "endpoint" | "URL"、"route"、"path" |
| 数据库字段 | "field"、"column" | "box"、"element" |
| 表单元素 | "input"、"control" | "box"、"选项" |
| 提取操作 | "fetch"、"get" | "retrieve"、"load" |

---

## 6. 高级技巧

### Token 优化策略

#### 技巧 1：可执行脚本

**不消耗上下文 token**

```markdown
## 性能分析

使用 `scripts/benchmark.py` 进行性能测试。

详见参考：[PERFORMANCE.md](scripts/benchmark.py)
```

使用方式：
```bash
python scripts/benchmark.py
```

**节省**：脚本内容不加载到上下文

#### 技巧 2：外部化引用

**减少代码示例**

```markdown
## 数据验证

使用 Zod schema 进行输入验证。详见：[scripts/validate.py](scripts/validate.py)
```

**好处**：
- SKILL.md 保持精简
- 详细内容在独立文件
- 按需加载，节省 token

### 渐进式复杂度管理

#### 新手快速通道

**5 分钟上手指南**

```markdown
## 快速开始

### 安装

```bash
npm install
```

### 运行

```bash
npm start
```

### 下一步

[查看完整文档](full-guide.md)
```

#### 高级用户深度指南

**完整参考文档**

```markdown
## 高级特性

### OCR 处理

支持扫描 PDF，使用 Tesseract 引擎。详见：[advanced/ocr.md](advanced/ocr.md)

### 批处理

一次处理多个文件，自动合并。详见：[advanced/batch.md](advanced/batch.md)
```

### 工作流清单

**复杂多步骤任务**

```markdown
## 研究工作流

复制此清单并跟踪进度：

**研究进度**：
- [ ] Step 1: 阅读所有源文档
- [ ] Step 2: 识别关键主题
- [ ] Step 3: 交叉验证声明
- [ ] Step 4: 创建结构化总结
- [ ] Step 5: 验证引用
```

---

## 7. 模板库

### 项目根模板

```markdown
# <项目名称>

<一句话描述>

## Commands

| Command | Description |
|---------|-------------|
| `<command>` | <description> |

## Architecture

<结构>
```

### 包/模块模板

```markdown
# <包名称>

<此包的目的>

## Usage

```python
import <package>
```

## Key Exports

- `<export>` - <purpose>

## Dependencies

- `<dependency>` - <why needed>

## Notes

- <important note>
```

---

## 8. 常见问题

### Q1: CLAUDE.md 多长合适？

**A**：保持 SKILL.md 在 500 行以内

**细分大内容**：
- 创建 SKILL.md（概览）
- 创建 advanced.md（详细信息）
- SKILL.md 指向 advanced.md

### Q2: 如何处理过时信息？

**A**：使用版本标记

- 在章节标题标注版本
- 旧模式移到 "Legacy" 章节
- 新功能标注当前版本

### Q3: 应该包含代码示例吗？

**A**：取决于复杂度

| 模式 | 代码示例 | 参考 |
|------|----------|------|
| 简单任务 | 内联在 SKILL.md | 独立文件 |
| 多领域 | 按需加载 | reference/ |
| 工作流 | 独立 checklist.md | 无需代码 |

### Q4: 如何确保 Claude 遵循规范？

**A**：使用明确的权限语言

```markdown
## Testing

**必需**：所有新功能必须先写测试（TDD）
**无例外**：紧急修复也需要测试覆盖

必须达到 80%+ 覆盖率
```

### Q5: 何时创建新技能？

**A**：当技术模式可复用时

考虑因素：
- 是否已在 `~/.claude/skills/` 中
- 是否跨项目有用
- 是否节省重复工作

---

> **文档版本**：1.0.0
> **最后更新**：2026-02-14
