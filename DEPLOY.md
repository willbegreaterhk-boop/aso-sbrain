# brain two - GitHub Pages 部署清单

当前目录里的 `index.html` 可直接作为 GitHub Pages 根目录文件上传。

## 需要你先决定

1. 仓库名：建议 `brain-two`。
2. 域名形态：主域名 `k1mzee.icu`。

`CNAME` 已生成，内容只写一行：`k1mzee.icu`。不要带 `https://`，不要带路径。

## GitHub 仓库

1. GitHub 新建公开仓库，例如 `brain-two`。
2. 上传这些文件到仓库根目录：
   - `index.html`
   - `CNAME`
3. 打开仓库 `Settings` -> `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main` / `/root`，保存。
6. 等 GitHub 生成默认地址：`https://你的用户名.github.io/brain-two/`。
7. 在 `Settings` -> `Pages` -> `Custom domain` 填入 `k1mzee.icu` 并保存。
8. HTTPS 可用后勾选 `Enforce HTTPS`。

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

只上传业务库页面和业务卡 JSON。个人库，尤其原生家庭内容，不上传公开仓库，不放进同一个推理引擎。
