# PROJECT_STATE.md

项目状态的唯一事实源已合并到：
- `AGENTS.md`
- `DAILY-LOOP-SPEC.md`
- `P2.3-SPEC.md`

本文件只保留轻量指针，避免重复规则。

## 当前基线
- GitHub：`willbegreaterhk-boop/aso-sbrain`
- 域名：`k1mzee.icu`
- Pages 源：`main` 分支，根目录 `/`
- 主文件：`index.html`
- 当前工作基线：以 `main` 最新提交为准；具体 commit 看 `git log`。

## 当前工作
- `DAILY-LOOP-SPEC.md` P2.0-P2.2 已完成。
- 首页已改为纯大脑首屏：上方只有空文字框，下方是缩小后的活体 3D 大脑；节点显示为星星，只有点击星星才弹匿名卡片层，旧卡片名称不再展示。「今日」区块保留在后续内容中。
- `P2.3-SPEC.md` 已入仓库；20 张业务卡已并入默认业务库。
- P2.3 已做到可部署前状态：Worker 代理、真 endpoint 切换、决策助手、复盘 promotedCards 本地写卡。DeepSeek key / Worker 部署仍需用户本人操作。
