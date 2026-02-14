# runStory - 项目指导

本文件为 Claude Code (claude.ai/code) 和开发团队提供项目指导。

---
### 语言规则
- 使用中文交流和书写文档
- 不确定即承认，不编造

---

## 🛠️ 常用命令

### 环境快速设置

\`\`bash

### 开发模式

- **包管理器**: uv
- **Python**: >= 3.13
- **测试框架**: pytest (目标覆盖率 80%+)
- **代码格式化**: Black
- **代码检查**: Ruff
- **类型检查**: pyright (claude-code-lsps 插件)

# 安装 uv (Python 包管理器)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 安装项目依赖
uv sync

# 运行测试测试
uv run -m pytest tests/ -v
\`\`

### 包管理（使用 uv）

\`\`bash
uv pip install -e .               # 安装项目
uv pip install <pkg>              # 安装包
uv pip list                       # 列出包
\`\`

### 运行与测试

\`\`bash
uv run script.py                  # 运行脚本
uv run -m pytest                  # 运行测试
uv run -m pytest tests/x.py -v    # 运行特定测试
\`\`

### 代码质量

\`\`bash
uv run -m black src/ tests/       # 格式化
uv run -m ruff check --fix src/   # 检查+修复
\`\`



---

## 💡 
