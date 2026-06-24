# TODO

事实源：`AGENTS.md` 和 `DAILY-LOOP-SPEC.md`。

## 当前任务
- [x] 同步远端 `main`，确认基于 `1b7be07` 或更新提交工作。
- [x] 补 `.gitignore`：`*.local`、`*.local.json`、`cards*.json`。
- [x] 纳入 `AGENTS.md` 和 `DAILY-LOOP-SPEC.md` 为唯一事实源。
- [x] 实现 `DAILY-LOOP-SPEC.md` P2.0-P2.2 与首页「今日」区块。
- [x] 按 `DAILY-LOOP-SPEC.md` 第 5 节自测。
- [x] 纳入 `P2.3-SPEC.md`。
- [x] 并入 20 张业务卡，旧 3 张样卡本地缓存自动迁移。
- [x] 完成 P2.3 可部署前代码：Worker `/review`、`/decide`，前端可配置 endpoint、B 决策助手、A promotedCards 本地写卡。
- [ ] 用户本人完成 Cloudflare 授权、Worker 加密变量 `DEEPSEEK_API_KEY`、部署 Worker、页面 endpoint 配置。
- [ ] 推送前确认无个人数据、无 key 进仓库。

## 暂缓
- P2.4 卡片提炼和夜间自动复盘。
