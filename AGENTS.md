# AGENTS.md - brain two

> 项目记忆 / 交接文档。任何 agent 接手前先读这份；每日循环实现还要读 `DAILY-LOOP-SPEC.md`。
> 总原则：先验证再自动化，先搭身体再插大脑。不确定就别加复杂度。

## 1. 这是什么
brain two = 一个个人「第二大脑」：把过往知识蒸馏成原子卡片，分域存储、检索，最终做推理建议。

当前产物：单文件静态网页 `index.html`。它可以直接部署到 GitHub Pages，没有自有后端、没有构建流程、没有框架依赖。

## 2. 当前框架
- 核心闭环：捕获 -> 蒸馏 / 录入 -> 存储 -> 检索 -> 推理建议 -> 产出 -> 回流。
- 原子单元 = 卡片。schema 字段：
  `id, lib(business|personal), domain, type, title, body, context, conf(high|medium|low), source, status(active|superseded|archived), links, sample?`
- 两个库：
  - 业务库：电商+AI、半导体、二手车、媒体。
  - 个人库：原生家庭、球鞋。个人内容只留本地。
- Phase 2 每日循环：按 `DAILY-LOOP-SPEC.md` 做 Day 日志、健身输入、review mock；真实代理和 key 暂缓。

## 3. 当前文件：index.html
- 单文件、自包含、可静态部署。
- 外部只引 three.js r128（cdnjs）和 Google Fonts；CJK 字体走系统兜底。
- 已有功能必须保留：
  - 卡片录入、删除、导入、导出、本地持久化。
  - 业务库 / 个人库隔离。
  - 搜索、域 / 类型筛选、筛选状态栏、一键清空。
  - 网格 / 列表视图切换。
  - 卡片详情抽屉、复制 JSON。
  - `Ctrl / Cmd + K` 命令面板，`/` 聚焦搜索。
  - toast 反馈、hover / 进入动画、移动端适配。
  - 流动水感背景、领域入口面板。
  - 3D 大脑：模块状态可视化、领域知识库节点、拖动旋转、悬停 tooltip、WebGL 兜底。
- 卡片持久化 key：
  - `brain_two_business_cards_v1`
  - `brain_two_personal_cards_v1`
  - legacy: `brain_two_cards_v1`

## 4. 硬约束
- 不加后端 / 构建步骤 / 框架，除非用户明确要求。
- 前端保持单文件、可直接丢静态主机运行。
- 现在不加密码；站点按公开页面处理。
- 3D 大脑是有意义的模块状态可视化，不替换成无意义装饰。
- 所有 localStorage 访问必须 try/catch。
- API key 永不进客户端代码；仓库任何地方不得出现 key。
- 隐私红线：
  - 个人库、日志、健身、review 都属个人 / 本地范畴。
  - 这些数据绝不进入公开仓库、绝不公开。
  - 个人导出必须带 `.local`，并由 `.gitignore` 忽略。
- 打分必须建设性：看趋势和个人基线，不做羞辱式审判。
- 任何结构性改动、数据结构改动、账号 / DNS / 不可逆操作前先问用户。

## 5. 现状 / 待办
- [x] GitHub 仓库已建立：`willbegreaterhk-boop/aso-sbrain`。
- [x] GitHub Pages 已用主域名 `k1mzee.icu`，HTTP 可访问。
- [ ] HTTPS 证书签发后，由用户在 Pages 打开 `Enforce HTTPS`。
- [x] 已补 `.gitignore`：`*.local`、`*.local.json`、`cards*.json`。
- [x] `DAILY-LOOP-SPEC.md` P2.0-P2.2 已完成：Day 日志层、首页今日区块、tracker 健身输入、`requestReview(day)` endpoint + mock。
- [x] 首屏 UI 已改为动态流动背景 + 更生动的 3D 大脑；卡片按领域归入大脑节点，打开节点展开对应知识库，并同步下方卡片库筛选。
- [x] 首页首屏已极简化：除左上角 `brain two` 外不显示任何文字，其余入口用符号和光点承载。
- [x] 首页进一步收敛为纯大脑首屏：隐藏品牌 / 按钮 / 领域点栏，缩小 3D 大脑；点击大脑后弹出卡片知识库层。
- [ ] P2.3 真代理 / 真 API 暂缓，等用户明确解锁 key。
- [ ] P2.4 卡片提炼和夜间自动复盘暂缓。

## 6. 部署
- Pages 源：`main` 分支，根目录 `/`。
- 入口文件：`index.html`。
- `CNAME` 内容：`k1mzee.icu`。
- 登录授权、GitHub 设置、DNS、HTTPS 开关只能用户本人操作；agent 到这些步骤停下来给精确步骤。

## 7. 多 agent 约定
- 本文件和 `DAILY-LOOP-SPEC.md` 是唯一事实源。
- `CLAUDE.md` 只保留指向事实源的镜像说明。
- 每完成一个待办，回来更新第 5 节。
