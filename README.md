# Clash 系列客户端配置与覆写脚本（防 DNS & WebRTC 泄漏）

本项目提供经优化测试的 JavaScript (JS) 动态覆写脚本 与 独立 YAML 配置文件，适用于 FlClash、Clash Verge、Mihomo Party 等基于 Mihomo / Clash Meta 内核的客户端，彻底解决 DNS 泄漏与 WebRTC 泄漏问题。

---

## 两种使用方式（二选一）

### 方式 A：使用 JS 动态覆写脚本（推荐挂载已有订阅）
适用于已有机场订阅，希望通过客户端“脚本覆写”功能自动注入防泄露规则与全彩图标。

* 导入方式：在客户端中通过 配置 ➔ 覆写 ➔ 配置脚本 ➔ 外部获取 (URL) 填入以下链接：
  * GitHub Raw 直连：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-script.js`
  * CDN 加速链接：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-script.js`
  * Gist 订阅链接：`https://gist.githubusercontent.com/Niklaus88/f2158f5de15bf6a91b36c3f4c9223098/raw/DNS-WebRTC.js`

---

### 方式 B：使用独立 YAML 配置文件（支持多机场自动合并）
适用于希望用单个配置文件直接管理 1 个或多个机场订阅的用户。

* 使用方法：
  1. 下载 [clash-config.yaml](https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-config.yaml) 文件。
  2. 用文本编辑器打开，在 `proxy-providers:` 区域将 `url:` 替换为你自己的机场订阅链接（支持同时填入 1~3 个或更多机场）。
  3. 导入客户端直接运行，客户端会自动拉取并汇总所有机场节点。

* Raw 链接：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/clash-config.yaml`
* CDN 加速：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/clash-config.yaml`

---

## 功能特色

- 防 DNS 泄漏：内置安全 DoH（Cloudflare / Google / OpenDNS），国内域名智能走 DNSPod / AliDNS 分流，兼顾隐私与网速。
- 防 WebRTC 泄漏：采用 `REJECT-DROP` 静默丢弃策略拦截 3478 / 5349 / 19302-19309 等 STUN 端口，彻底解决浏览器真实 IP 泄漏。
- 节点 UDP 自动开启：遍历代理节点并开启 `udp: true`，确保 QUIC 与 UDP 代理流量正常传输。
- 精选 Koolson 全彩图标：策略组图标全面预装 Koolson/Qure 高清彩色图标。
- 规则精简与分流优化：集成 Loyalsoldier 与 xiaolin-007 常用规则集，加快匹配与加载速度。

---

## 常用泄露检测地址

- IPPure：[https://ippure.com](https://ippure.com)
- BrowserLeaks：[https://browserleaks.com/dns](https://browserleaks.com/dns)
- IPLeak：[https://ipleak.net](https://ipleak.net)

> 💡 提示：Chrome / Edge 浏览器建议搭配 [WebRTC Control](https://chromewebstore.google.com/detail/webrtc-control/fjkmabmdepjfammlpliljpnbhleegehm) 扩展，防护更彻底。

---

## 🙏 感谢

- [xiaolin-007](https://github.com/xiaolin-007)
- [Loyalsoldier](https://github.com/Loyalsoldier/clash-rules)
- [Koolson](https://github.com/Koolson/Qure)
