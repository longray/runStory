# dd-game/src/backend/services - 持久化世界模拟服务层

**生成时间**: 2025-02-15
**所属项目**: dd-game

## 概述

后端服务层，实现 D&D TRPG 持久化世界模拟的核心逻辑。

核心职责：
- 事件管理（战斗、任务、社交事件）
- NPC 管理（记忆、行为持久化）
- 时间系统（时间推进与缩放）
- 经济系统（动态定价、交易）
- 战斗系统（回合制战斗）
- 任务系统（生成与追踪）

## 服务列表

| 服务类 | 位置 | 职责 |
|--------|--------|--------|
| WorldEventManager | services/WorldEventManager.ts | 事件管理器 |
| NPCManager | services/NPCManager.ts | NPC 管理器 |
| WorldTimeManager | services/WorldTimeManager.ts | 时间管理器 |
| QuestManager | services/QuestManager.test.ts | 任务系统（测试） |
| SocialManager | services/SocialManager.test.ts | 社交系统（测试） |
| EconomyManager | services/EconomyManager.test.ts | 经济系统（测试） |
| CombatManager | services/CombatManager.test.ts | 战斗系统（测试） |

## 查看位置

| 任务 | 位置 | 说明 |
|------|----------|------|
| 服务实现 | dd-game/src/backend/services/ | 核心业务逻辑 |
| 服务测试 | dd-game/src/backend/services/__tests__/ | Vitest 单元测试 |

## 约定

### 测试
- 测试文件：`*.test.ts`
- 使用 Vitest 框架
- 测试目录：`__tests__/`

### 代码质量
- **不可变性**: 永远创建新对象，禁止修改已有对象
- **小文件优先**: 高内聚低耦合，单文件 < 800 行
- **错误处理**: 必须处理所有错误
- **输入验证**: 所有用户输入必须验证

## 当前状态

- **WorldEventManager**: 9 个测试通过
- **NPCManager**: 13 个测试通过
- **WorldTimeManager**: 18 个测试通过
