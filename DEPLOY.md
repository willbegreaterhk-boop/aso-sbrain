# brain two - GitHub Pages 部署清单

当前目录里的 `index.html` 可直接作为 GitHub Pages 根目录文件上传。

## 当前状态

- GitHub 仓库：`willbegreaterhk-boop/aso-sbrain`
- Pages 源：`main` 分支，根目录 `/`
- 域名：`k1mzee.icu`
- `CNAME` 内容：`k1mzee.icu`

不要在 `CNAME` 里带 `https://` 或路径。

## GitHub 仓库

1. 打开仓库 `Settings` -> `Pages`。
2. Source 选择 `Deploy from a branch`。
3. Branch 选择 `main` / `/root`，保存。
4. 在 `Custom domain` 填入 `k1mzee.icu` 并保存。
5. HTTPS 证书可用后勾选 `Enforce HTTPS`。

## 阿里云 DNS

登录阿里云 `云解析 DNS`，进入目标域名的 `解析设置`，点击 `添加记录`。

### 主域名 k1mzee.icu

添加 4 条 A 记录：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

可选：再添加 4 条 AAAA 记录支持 IPv6：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

### 可选：www.k1mzee.icu

添加 1 条 CNAME 记录：

| 记录类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | www | 你的用户名.github.io |

注意：GitHub 要求 CNAME 指向 `你的用户名.github.io`，不要带仓库名。

## 验证命令

在 PowerShell 里查 DNS：

```powershell
Resolve-DnsName k1mzee.icu -Type A
Resolve-DnsName www.k1mzee.icu -Type CNAME
```

DNS 传播可能需要一段时间；GitHub 文档说明可能最长 24 小时。

## 隐私提醒

完整隐私规则见 `AGENTS.md` 和 `DAILY-LOOP-SPEC.md`。个人库、日志、健身、review 导出必须走 `.local`，不得上传公开仓库。

## P2.3 Worker 部署

完整规格见 `P2.3-SPEC.md`。部署时 key 只填进 Cloudflare Worker 加密变量，不能写进前端或仓库。

用户本人操作：

```bash
cd /Users/kiz/aso-sbrain
npx wrangler login
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

部署后把 Worker 地址填到页面的 AI endpoint 设置里；可以填根地址，也可以填 `/review` 地址，前端会自动拼 `/review` 和 `/decide`。
