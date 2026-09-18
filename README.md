# Clash 系列配置与覆写脚本（防 DNS & WebRTC 泄漏）

本项目整理了适用于 Clash 与 Sing-box 客户端的配置及 JavaScript 覆写脚本，主要用于解决日常使用中的 DNS 泄漏与 WebRTC 暴露本地真实 IP 问题，并配套了 18 个常用分流策略组及全彩图标。

---

## 配置方案说明

| 方案 | 适用客户端 | 说明 | 文件链接 |
| :--- | :--- | :--- | :--- |
| **通用 JS 脚本** | [FlClash](https://github.com/chen08209/FlClash)、[Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev)、[Mihomo Party](https://github.com/mihomo-party-org/mihomo-party) | <img src="https://img.shields.io/badge/-%E6%8E%A8%E8%8D%90-2ea44f" height="18" valign="middle"> 挂载在现有订阅上即可自动补充规则，由客户端动态管理 API 密钥 | [clash-script.js](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-script.js) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-script.js)) |
| **iOS 专属脚本** | [Clash Rule based proxy utility](https://apps.apple.com/us/app/clash-rule-based-proxy-utility/id6794257189) 等 iOS 端 | 使用内核内置规则，常驻内存控制在 2MB 左右，避免 iOS 网络扩展因内存限制退出 | [clash-ios-script.js](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-ios-script.js) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-ios-script.js)) |
| **独立 YAML 配置** | Clash / Mihomo 桌面客户端 | 支持配置 1~3 个机场订阅自动聚合，默认绑定 127.0.0.1 且关闭局域网连接 | [clash-config.yaml](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-config.yaml) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-config.yaml)) |
| **Sub-Store 模板** | Sub-Store 平台 | 作为 Sub-Store Artifact 产物模板使用，生成带分流与图标的配置 | [sub-store.yaml](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/sub-store.yaml) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/sub-store.yaml)) |
| **OpenClash 配置** | OpenWrt 软路由 / 旁路由网关 | 开启局域网共享与 0.0.0.0 监听，适配路由器全屋代理环境，移除 Windows 进程规则 | [openclash.yaml](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/openclash.yaml) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/openclash.yaml)) |
| **Sing-box 配置** | Sing-box 官方客户端（全平台） | 适配 Sing-box 1.14+ 格式规范，采用内联 Fake-IP 与标准规则集 | [sing-box.json](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/sing-box.json) ([CDN](https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/sing-box.json)) |

---

## 策略组说明

配置中整理了 18 个策略组，业务分组在前，系统规则与控制分组在后：

| 策略组 | 默认出站 | 用途说明 |
| :--- | :--- | :--- |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png" width="18" height="18" valign="middle"> **节点选择** | `自动选择` | 总代理出站，未单独指定策略的常规境外流量经由此处转发 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png" width="18" height="18" valign="middle"> **谷歌服务** | `节点选择` | Google 搜索、Play 商店、API 及 gstatic 静态资源，统一出口节点避免人机验证异常 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png" width="18" height="18" valign="middle"> **YouTube** | `节点选择` | YouTube 与 YouTube Music 媒体流，建议固定出口地区避免 Premium 归属漂移 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png" width="18" height="18" valign="middle"> **Telegram** | `节点选择` | Telegram 通信协议与官方数据中心 IP 段（含 no-resolve） |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png" width="18" height="18" valign="middle"> **Spotify** | `节点选择` | Spotify 音乐播放及账号认证，可按需指定对应注册地区节点 |
| <img src="https://fastly.jsdelivr.net/gh/chxm1023/Script_X@main/icon/ChatGPT/ChatGPT4.png" width="18" height="18" valign="middle"> **AI** | `节点选择` | OpenAI、Claude、Gemini、Copilot 等 AI 平台流量 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png" width="18" height="18" valign="middle"> **TikTok** | `节点选择` | TikTok 国际版视频与应用流量 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png" width="18" height="18" valign="middle"> **Netflix** | `节点选择` | Netflix 流媒体，可单独指定具备解锁能力的节点 |
| <img src="https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Microsoft.png" width="18" height="18" valign="middle"> **微软服务** | `节点选择` | Bing 国际版、Copilot、OneDrive 网页端与 Office 等；默认走代理避免国内网络阻断，大版本系统更新时可切直连节省流量 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png" width="18" height="18" valign="middle"> **苹果服务** | `全局直连` | App Store 下载、Apple TV+ 与官方网站等；默认直连国内 CDN 保障下载速度，遇到特定外区内容受限时可手动切为代理加速 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/iCloud.png" width="18" height="18" valign="middle"> **iCloud服务** | `全局直连` | iCloud 照片、云盘同步、备忘录与查找定位等；默认直连国内节点保障同步稳定，避免因境外 IP 变动触发 Apple ID 异常验证 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png" width="18" height="18" valign="middle"> **动画疯** | `节点选择` | 巴哈姆特动画疯，内置台湾节点名称正则筛选 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png" width="18" height="18" valign="middle"> **哔哩哔哩港澳台** | `全局直连` | 哔哩哔哩出海番剧，默认直连，有特定版权需求时可手动切换节点 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png" width="18" height="18" valign="middle"> **广告过滤** | `REJECT` | 常见广告、追踪统计与恶意域名拦截 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png" width="18" height="18" valign="middle"> **全局直连** | `DIRECT` | 国内网站及局域网私有地址出口 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png" width="18" height="18" valign="middle"> **全局拦截** | `REJECT` | 全局危险连接及特定端口拦截出口 |
| <img src="https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png" width="18" height="18" valign="middle"> **漏网之鱼** | `节点选择` | 未命中任何前置分流规则的流量，默认走代理出口兜底 |
| <img src="https://fastly.jsdelivr.net/gh/Niklaus88/icon@main/Webrtc.png" width="18" height="18" valign="middle"> **WebRTC防护** | `REJECT-DROP` | WebRTC STUN 探测端口拦截。默认静默丢弃防止网页获取真实公网 IP，遇视频会议需求可手动切为代理节点 |

---

## 设计说明

* **分流优先级**：优先放行受信任的会议客户端（Zoom、Discord 等）➔ 拦截 STUN 协议端口 ➔ 匹配细分应用规则 ➔ GFW 名单 ➔ 匹配国内域名及 IP 白名单走直连 ➔ 未匹配的境外域名兜底走代理。优先放行国内流量，减少国内 .com 域名被误代理的情况。
* **DNS 分流**：海外域名解析使用带公网 IP 证书的 Cloudflare (1.1.1.1) 与 Google (8.8.8.8 / 8.8.4.4) DoH，国内域名使用阿里与腾讯 DoH。单机配置仅监听 127.0.0.1:1053。
* **UDP 支持**：覆写脚本同时处理静态节点与 Proxy Provider 动态节点配置（注入 `override.udp: true`）。实际 UDP 可用性取决于节点协议及服务商是否提供支持。
* **图标加载**：策略组图标统一通过 fastly.jsdelivr.net 镜像分发，在国内网络环境下无需依赖代理即可正常加载。

---

## 常用泄露检测地址

* IPPure：[https://ippure.com](https://ippure.com)
* BrowserLeaks：[https://browserleaks.com/dns](https://browserleaks.com/dns)
* IPLeak：[https://ipleak.net](https://ipleak.net)

> 💡 提示：网络层规则主要防范常见网页探针；若对 WebRTC 隐私有更严苛的要求，建议在浏览器端搭配 [WebRTC Control](https://chromewebstore.google.com/detail/webrtc-control/fjkmabmdepjfammlpliljpnbhleegehm) 等扩展使用。

---

## 🙏 感谢

* [xiaolin-007](https://github.com/xiaolin-007/clash-verge-script)
* [Loyalsoldier](https://github.com/Loyalsoldier/clash-rules)
* [Koolson](https://github.com/Koolson/Qure)
