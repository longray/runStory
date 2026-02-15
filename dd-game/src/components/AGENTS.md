# dd-game/src/components - Vue 3 前端组件层

**生成时间**: 2025-02-15
**所属项目**: dd-game

## 概述

Vue 3 Composition API 前端组件，实现游戏界面与用户交互。

核心组件：
- GameUI: 游戏主界面
- CharacterCreation: 角色创建界面
- CombatUI: 战斗界面
- MapDisplay: 地图显示

## 组件列表

| 组件名 | 位置 | 职责 |
|--------|--------|--------|
| GameUI | components/GameUI.vue | 游戏主界面容器 |
| CharacterCreation | components/CharacterCreation.vue | 角色创建流程 |
| CombatUI | components/CombatUI.vue | 战斗 UI 组件 |
| MapDisplay | components/MapDisplay.vue | 地图显示组件 |

## 查看位置

| 任务 | 位置 | 说明 |
|------|----------|------|
| 组件开发 | dd-game/src/components/ | Vue 3 组件实现 |
| 组件测试 | dd-game/src/components/__tests__/ | Vitest + Vue Test Utils |

## 约定

### 前端
- 使用 Vue 3 Composition API (`<script setup lang="ts">`)
- 组件测试：`*.spec.ts` 文件
- 使用 Vitest + Vue Test Utils 框架
