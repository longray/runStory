# 常见陷阱

### 测试顺序依赖

+ 测试必须按顺序运行（`--runInBand`）由于共享数据库状态

**原因**: 防止"本地测试通过但 CI 失败"的困惑

### YAML 配置

- `yarn.lock` 具有权威性；如果依赖不匹配删除 `node_modules`
- 始终使用 `uv sync` 管理依赖

---

> **返回**: [CLAUDE.md](../CLAUDE.md)
