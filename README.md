# Clash / Sing-box 系列客户端配置与覆写脚本（防 DNS & WebRTC 泄漏）

本项目提供经优化测试的 JavaScript (JS) 动态覆写脚本、独立 YAML 配置文件 以及 独立 JSON 配置文件，适用于 FlClash、Clash Verge、Clash Rule based proxy utility (iOS)、Sing-box 官方客户端 等，彻底解决 DNS 泄漏与 WebRTC 泄漏问题。

---

## 四种使用方式（按需选择）

### 方式 A：通用 JS 动态覆写脚本（最推荐、最方便、最安全）
适用于 FlClash、Clash Verge Rev、Mihomo Party 等桌面和安卓客户端，挂载已有订阅并自动注入防泄露规则与全彩图标。

* 为什么首推覆写脚本：
  * 最方便直接：无需修改本地文本，保留机场订阅自动更新，随时拉取脚本即可生效。
  * 最安全：仅在客户端内存沙盒中运行，不暴露外部管理端口，内核 API 密钥由客户端自动生成随机 Token 保护，完全免受跨站网页未授权窃取节点凭据的威胁。

* 导入方式：在客户端配置覆写脚本中填入以下链接：
  * GitHub Raw 直连：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-script.js`
  * CDN 加速链接：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-script.js`
  * Gist 订阅链接：`https://gist.githubusercontent.com/Niklaus88/f2158f5de15bf6a91b36c3f4c9223098/raw/DNS-WebRTC.js`

---

### 方式 B：iOS 专属轻量 JS 脚本（解决 iOS 客户端内存不够报错）
专为 [Clash Rule based proxy utility](https://apps.apple.com/us/app/clash-rule-based-proxy-utility/id6794257189) 等 iOS 客户端定制。采用内置 GeoSite/GeoIP 规则引擎，大幅降低内存占用至 2MB 以内，彻底避免 iOS Network Extension 内存溢出（连不上：内存不够），同时 100% 完整保留 WebRTC & DNS 防泄露机制。

* 导入方式：在客户端配置覆写脚本中填入以下链接：
  * GitHub Raw 直连：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-ios-script.js`
  * CDN 加速链接：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-ios-script.js`

---

### 方式 C：使用独立 YAML 配置文件（支持多订阅自动合并）
适用于希望用单个配置文件直接管理 1 个或多个订阅的 Clash 用户。

* 安全加固特性：
  * 默认锁定 allow-lan: false，防止局域网未知设备借用本机代理通道。若需要局域网热点共享，可按文件注释手动修改为 true。
  * 预置强访问密钥 secret，防止网页通过本地 9090 端口未授权跨站提取节点参数或篡改分流规则。

* 使用方法：
  1. 下载 [clash-config.yaml](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-config.yaml) 文件。
  2. 用文本编辑器打开，在 `proxy-providers:` 区域将 `url:` 替换为你自己的订阅链接（支持同时填入 1~3 个或更多订阅）。
  3. 导入客户端直接运行，客户端会自动拉取并汇总所有订阅节点。

* Raw 链接：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-config.yaml`
* CDN 加速：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-config.yaml`

---

### 方式 D：使用 Sing-box 独立 JSON 配置文件（官方客户端）
适用于使用 Sing-box 官方客户端（Android / iOS / macOS / Windows / Linux）的用户。

* 使用方法：
  1. 下载 [sing-box.json](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/sing-box.json) 文件。
  2. 用文本编辑器打开，在 `outbounds` 节点列表中粘贴添加你的代理节点。
  3. 导入 Sing-box 官方客户端运行，自动享受独立的 DNS 路由、FakeIP 与二进制规则集防护。

* Raw 链接：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/sing-box.json`
* CDN 加速：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/sing-box.json`

---

## 功能特色

- 防 DNS 泄漏：内置安全 DoH（Cloudflare / Google / OpenDNS），国内域名智能走 DNSPod / AliDNS 分流，兼顾隐私与网速。
- 防 WebRTC 泄漏：采用 `REJECT-DROP` / `block` 静默丢弃策略拦截 3478 / 5349 / 19302-19309 等 STUN 端口，彻底解决浏览器真实 IP 泄漏。
- 接口安全加固与隔离：YAML 配置预置 API 访问密钥并关闭局域网共享，防御跨站窃取凭据；JS 覆写脚本由客户端原生托管随机 Token，彻底免除 API 暴露隐患。
- 节点 UDP 自动开启：遍历代理节点并开启 `udp: true`，确保 QUIC 与 UDP 代理流量正常传输。
- 精选 Koolson 全彩图标：策略组图标全面预装 Koolson/Qure 高清彩色图标。
- 规则精简与分流优化：集成常用分流规则，加快匹配与加载速度。

---

## 常用泄露检测地址

- IPPure：[https://ippure.com](https://ippure.com)
- BrowserLeaks：[https://browserleaks.com/dns](https://browserleaks.com/dns)
- IPLeak：[https://ipleak.net](https://ipleak.net)

> 💡 提示：Chrome / Edge 浏览器建议搭配 [WebRTC Control](https://chromewebstore.google.com/detail/webrtc-control/fjkmabmdepjfammlpliljpnbhleegehm) 扩展，防护更彻底。

---

## 🙏 感谢

- [xiaolin-007](https://github.com/xiaolin-007/clash-verge-script)
- [Loyalsoldier](https://github.com/Loyalsoldier/clash-rules)
- [Koolson](https://github.com/Koolson/Qure)
- [SagerNet / sing-box](https://github.com/SagerNet/sing-box)
