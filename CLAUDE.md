# runStory - 项目指导

本文件为 Claude Code (claude.ai/code)、OpenAI Codex、Google Gemini 等 AI Agent 提供项目指导。

**重要**：所有文档更新必须遵循[渐进式披露规范](docs/CLAUDE-渐进式披露规范.md)。

---

## 🛠️ 常用命令

| 命令 | 用途 |
|------|------|
| `uv sync` | 安装依赖 |
| `uv run -m pytest tests/ -v` | 运行测试 |
| `uv run -m black src/ tests/` | 格式化代码 |
| `uv run -m ruff check --fix src/` | 检查代码 |

---

## 📚 项目文档

| 主题 | 参考文档 |
|------|----------|
| **环境设置** | [docs/参考文档-环境设置.md](docs/参考文档-环境设置.md) |
| **包管理** | [docs/参考文档-包管理.md](docs/参考文档-包管理.md) |
| **运行测试** | [docs/参考文档-运行测试.md](docs/参考文档-运行测试.md) |
| **代码质量** | [docs/参考文档-代码质量.md](docs/参考文档-代码质量.md) |
| **项目架构** | [docs/参考文档-项目架构.md](docs/参考文档-项目架构.md) |
| **代码风格** | [docs/参考文档-代码风格.md](docs/参考文档-代码风格.md) |
| **常见陷阱** | [docs/参考文档-常见陷阱.md](docs/参考文档-常见陷阱.md) |

---

## 🏗️ 项目结构

```
runStory/
├── src/                    # 源代码
├── tests/                  # 测试套件
├── scripts/                 # 实用脚本
├── docs/                   # 项目文档
└── CLAUDE.md               # 本文件
```

---

## 🎯 快速参考

| 我想... | 用什么 |
|---------|---------|
| 安装依赖 | `uv sync` |
| 运行测试 | `uv run -m pytest tests/ -v` |
| 格式化代码 | `uv run -m black src/ tests/` |
| 检查代码 | `uv run -m ruff check --fix src/` |
| 创建虚拟环境 | `python -m venv .venv` |
| 激活环境 | `source .venv/bin/activate` |
