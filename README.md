## Clash系代理配置 (防 DNS & WebRTC 泄漏)

本仓库提供经测试优化的 Clash JavaScript (JS) 覆写脚本，适用于 **FlClash**、**Clash Verge** 等基于 Mihomo / Clash Meta 内核的客户端，主要解决手机端 DNS 泄漏与 WebRTC 泄漏问题。


###  订阅 / 覆写脚本链接

在 FLClash 客户端 **配置 —— 覆写 —— 配置脚本 —— 添加 —— 外部获取 —— URL导入** 中填入以下链接：


- **Gist 订阅链接（推荐）**：`https://gist.githubusercontent.com/Niklaus88/f2158f5de15bf6a91b36c3f4c9223098/raw/DNS-WebRTC.js`
  
- **GitHub Raw 直连链接**：`https://raw.githubusercontent.com/Niklaus88/Clash-Config/main/%E9%98%B2DNS-WebRTC%E6%B3%84%E9%9C%B2%E9%85%8D%E7%BD%AE.js`
  
- **CDN 加速链接**：`https://cdn.jsdelivr.net/gh/Niklaus88/Clash-Config@main/%E9%98%B2DNS-WebRTC%E6%B3%84%E9%9C%B2%E9%85%8D%E7%BD%AE.js`
  

推荐 Chrome/Edge 浏览器使用 [**WebRTC Control**](https://chromewebstore.google.com/detail/webrtc-control/fjkmabmdepjfammlpliljpnbhleegehm?pli=1) 扩展




------


###  功能特色

-  **防 DNS 泄漏**：内置安全 DoH（Cloudflare/Google/OpenDNS），国内域名智能走 DNSPod/AliDNS 分流，兼顾隐私与网速。
-  **防 WebRTC 泄漏**：采用 `REJECT-DROP` 静默丢弃策略拦截 3478 / 5349 / 19302-19309 等 STUN 端口，彻底解决浏览器真实 IP 泄漏。
-  **节点 UDP 自动开启**：遍历代理节点并开启 `udp: true`，确保 QUIC 与 UDP 代理流量正常传输。
-  **规则精简与分流优化**：集成 Loyalsoldier 与 xiaolin-007 常用规则集，加快匹配与加载速度。



------



###  常用检测地址
-  **IPPure**：https://ippure.com
-  **browserleaks**：https://browserleaks.com/dns
-  **ipleak**：https://ipleak.net


------


###  感谢
[xiaolin-007](https://github.com/xiaolin-007)
