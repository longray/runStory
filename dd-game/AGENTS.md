# dd-game - AI生成的D&D TRPG游戏

**生成时间**: 2025-02-15
**项目根目录**: /home/longray/runStory/dd-game

## 概述

Vue 3 + TypeScript Web 应用，实现 D&D 5e 风格角色扮演游戏，包含持久化世界模拟后端。

核心栈：
- **前端**: Vue 3 + TypeScript + Composition API
- **构建**: Vite
- **测试**: Vitest + Vue Test Utils + Playwright
- **状态管理**: Pinia + Vue Router

## 查看位置

| 任务 | 位置 | 说明 |
|------|----------|------|
| 前端开发 | dd-game/src/ | Vue 3 组件、路由、状态管理 |
| 后端服务 | dd-game/src/backend/ | 持久化世界模拟（服务、模型、类型） |
| 端到端测试 | dd-game/e2e/ | Playwright E2E 测试 |
| 单元测试 | dd-game/src/**/__tests__/ | Vitest + Vue Test Utils |

## 项目结构

```
dd-game/
├── src/
│   ├── backend/      # 后端服务（持久化世界模拟）
│   │   ├── services/ # 事件管理器、NPC 管理器、时间系统
│   │   ├── models/    # 世界状态、事件、NPC 模型
│   │   ├── types/     # 共享类型定义
│   │   └── utils/     # 日志等工具函数
│   ├── components/   # Vue 3 前端组件
│   ├── router/      # Vue Router 配置（当前空路由）
│   └── stores/       # Pinia 状态管理
├── e2e/            # Playwright 端到端测试
└── test-results/   # 测试结果
```

## 约定

### 前端
- 使用 Vue 3 Composition API (`<script setup lang="ts">`)
- 路径别名：`@'` → `./src`
- 组件测试：Vitest + Vue Test Utils，`*.spec.ts` 文件
- E2E 测试：Playwright，`*.spec.ts` 文件

### 后端
- 后端以库/模块方式实现（无独立服务入口）
- WorldSimulator.ts 提供核心模拟服务
- 测试使用 Vitest，`*.test.ts` 文件

### 代码质量
- Prettier 配置：无分号、单引号、100 字符宽度
- TypeScript 严格模式开启

### 测试
- E2E 测试目录：`dd-game/e2e/`
- 单元测试目录：`__tests__/`
- 144 个单元测试通过

## 重要概念

### 持久化世界 vs 传统 TRPG

| 方面 | 传统 TRPG | 持久化世界 |
|------|-----------|------------|
| 世界状态 | 静态模块 | 动态变化，NPC 持久化记忆 |
| 游戏循环 | 快速消耗 | 持续挑战，长期目标 |
| 经济系统 | 无玩家交易 | 动态经济，价格波动 |
| 社交网络 | 单人游玩 | 公会系统，NPC 关系网 |
| 角色成长 | 简单升级 | 长期目标，技能树 |

### 混合架构

- **AI LLM**: 内容生成（事件、对话、任务）
- **游戏服务器**: 持久化世界模拟（状态管理）
- **通信层**: REST/WebSocket 实时同步

## 待改进项

1. **后端入口点缺失**：`dd-game/src/backend/` 中的 WorldSimulator.ts 提供模拟服务，但缺少独立的服务器入口
   - 建议：添加 `server.ts` 或启动脚本，明确后端如何启动和暴露 API

2. **路由未配置**：`dd-game/src/router/index.ts` 中 `routes: []` 为空
   - 建议：添加实际路由（Home、CharacterCreation、Battle 等）

## 命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 运行单元测试
pnpm run test:unit

# 运行 E2E 测试
pnpm run test:e2e

# 类型检查
pnpm run type-check

# 格式化代码
pnpm run format
```
