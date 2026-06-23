# DAILY-LOOP-SPEC.md - brain two / Phase 2 每日循环

> 配合 `AGENTS.md` 一起读，AGENTS.md 的硬约束全部继续生效。
> 用户已选：暂不解锁 API key。本期实现到「接口 + mock」为止，真实 AI 调用等 key 到位再接。

## 0. 一句话目标
把 brain two 从静态卡片架升级成每日循环：
记当天每件事（含健身）-> AI 蒸馏 -> 每日总结 + 打分 + 建议 -> 耐用洞察沉淀成卡片。

## 1. 数据结构（新增）

### 1.1 Day（按日记录）
```js
day {
  date: "YYYY-MM-DD",           // 主键
  entries: Entry[],             // 当天原始事件流
  fitness: FitnessDay | null,   // 来自 tracker 的当日健身数据
  review:  Review | null        // AI 产出，跑之前为 null
}
```

storage key：`brain_two_days_v1`（对象：`{ "YYYY-MM-DD": day }`）。属个人 / 本地范畴，不进公开仓库。

### 1.2 Entry（单条记录，低摩擦快记）
```js
entry { id, time:"HH:MM", text, tag, domain?, linkedCardId? }
```

tag 建议：工作 / 健身 / 个人 / 想法 / 决策。

### 1.3 FitnessDay
复用现有 `tracker.html` 的数据模型（训练 / 饮食 / 身体 / 打卡），不重建。当日健身作为 `day.fitness` 的一路输入。

### 1.4 Review（AI 产出）
```js
review {
  summary: string,
  score: { overall: 1-10, dims?: {专注, 执行, 健身, ...} },
  advice: string[],             // 1-3 条建设性建议
  promotedCardIds: string[],    // 当天提炼进卡库的卡
  generatedAt
}
```

### 1.5 与现有结构衔接
- review 提炼的耐用洞察 -> 写进现有卡库（业务 / 个人），`source` 指向该 day。
- 即原设计的 `raw_inputs(entries) -> atoms(cards) -> connections`。
- 本期 P2.2 不做卡片提炼写入，留到 P2.4。

## 2. 架构 / AI 在哪跑
- 前端仍是 GitHub Pages 上的静态站，不变。
- AI 调用不能从前端直连（key 会暴露）。真实阶段新增独立小代理藏 key、转发调用。
- 前端通过可配置 endpoint 调代理，自身不碰 key。
- 本期不部署代理；前端先打到 mock。

## 3. 本期范围（Codex 现在做 / 暂缓）

现在做（无需 key）：
- P2.0 Day 数据层 + 记录 UI：加 / 改 / 删 entry、按日查看、日期列表或日历导航、持久化（localStorage，个人 / 本地范畴）。
- P2.1 健身：把 `tracker.html` 合进来（或读其数据），当日健身喂进 `day.fitness`；不得丢老数据。
- P2.2 AI 接口 + mock：一个 `requestReview(day)`，POST 到可配置 endpoint；提供 mock，返回结构化假 review；UI 完整渲染 summary / score / advice。换 endpoint = 接真，UI 零改动。

暂缓（等 key）：
- P2.3 部署代理 + 真 Anthropic key -> 用真调用替换 mock。
- P2.4 卡片提炼（AI 抽洞察 -> 卡）+ n8n 夜间定时复盘。

### 3A. 首页「今日」区块
在 3D 大脑和卡片库之间插入今日区块，和现有大脑 / 卡片库并列存在，不重做它们。

区块必须包含：
- 翻日 / 选择日期。
- 快记 entry 表单。
- 当天 entry 列表。
- 健身位：可见当天 tracker 数据，并喂进 `day.fitness`。
- 「生成今日复盘」按钮：调用 `requestReview(day)`，本期走 mock。

## 4. 约束（在 AGENTS.md 之上追加）
- 隐私红线加强：日志 / 健身 / review 全属个人数据 -> 个人 / 本地范畴，绝不进公开仓库、绝不公开。导出走 `.local`。
- API key 永不进客户端代码；仓库任何地方不得出现 key。
- 打分要建设性：看趋势、对自己基线，不做冷冰冰的每日审判。score 的 prompt 与 UI 都按「诚实但不打压」设计，既不吹捧也不羞辱。
- 前端保持单文件、可静态部署；代理是独立件。
- 最小闭环先通，别一次堆满。

## 5. 验收标准
- [ ] Day：能加 / 改 / 删 entry，刷新留存，按日导航；数据在个人 / 本地范畴。
- [ ] 健身：tracker 数据可见且喂进当日；迁移无丢失。
- [ ] AI 接口：`requestReview` 单点、endpoint 可配置；mock 返回结构化 review；UI 正确渲染 summary / score / advice；换成真 endpoint 时 UI 不用改。
- [ ] 隐私：日志 / 健身 / review 不出现在公开仓库；个人导出带 `.local`；代码里无 key。
- [ ] 打分 UI 呈现为建设性反馈，非审判式。
- [ ] 前端仍可静态部署；代理为独立件（本期可只有 mock、无需真部署）。
- [ ] JS 语法通过、console 无错、移动端无横向溢出、3D 与原有功能未被破坏。

## 6. 交接
- 本 spec 配合 `AGENTS.md` 给 Codex。
- Codex 完成后把改动 + 自测结果发回，按第 5 节逐条验收。

## 7. 状态
- [ ] P2.0-P2.2 本轮实现中。
