// ==========================================
// Clash Rule based proxy utility (iOS) 专属轻量脚本
// 特点：内置 GeoSite/GeoIP 极致省内存，完美防 WebRTC & DNS 泄露
// ==========================================

// 国内 DoH
const domesticNameservers = [
  "https://223.5.5.5/dns-query",
  "https://doh.pub/dns-query"
];

// 国外 DoH（Cloudflare + Google 顶级双核心）
const foreignNameservers = [
  "https://1.1.1.1/dns-query",
  "https://8.8.8.8/dns-query",
  "https://8.8.4.4/dns-query"
];

// DNS 配置（极致防泄露 + 内存优化）
const dnsConfig = {
  "enable": true,
  "listen": "127.0.0.1:1053",
  "ipv6": false,
  "prefer-h3": false,
  "respect-rules": true,
  "use-system-hosts": false,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    "+.lan",
    "+.local",
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    "+.in-addr.arpa",
    "+.ip6.arpa",
    "time.*.com",
    "time.*.gov",
    "pool.ntp.org",
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29"],
  "nameserver": [...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers],
  "direct-nameserver": [...domesticNameservers],
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers
  }
};

// 策略组通用配置（轻量探测）
const groupBaseOption = {
  "interval": 300,
  "timeout": 5000,
  "url": "https://cp.cloudflare.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 规则集：采用内置轻量 GeoSite / GeoIP，杜绝大内存外部规则集
const rules = [
  // 受信会议与实时音视频软件
  "DOMAIN-SUFFIX,zoom.us,全局直连",
  "DOMAIN-SUFFIX,zoom.com,全局直连",
  "DOMAIN-SUFFIX,discord.com,节点选择",
  "DOMAIN-SUFFIX,discord.gg,节点选择",
  // 1. 核心拦截 WebRTC STUN 探测 (解决 WebRTC 泄漏)
  "DST-PORT,3478,WebRTC防护",
  "DST-PORT,5349,WebRTC防护",
  "DST-PORT,19302,WebRTC防护",
  "DST-PORT,19303,WebRTC防护",
  "DST-PORT,19304,WebRTC防护",
  "DST-PORT,19305,WebRTC防护",
  "DST-PORT,19306,WebRTC防护",
  "DST-PORT,19307,WebRTC防护",
  "DST-PORT,19308,WebRTC防护",
  "DST-PORT,19309,WebRTC防护",
  "DOMAIN-KEYWORD,stun,WebRTC防护",

  // 2. 屏蔽 iOS / iPadOS 系统固件更新 (OTA 包含 aaplimg CDN 回退别名)
  "DOMAIN-KEYWORD,gdmf,REJECT",
  "DOMAIN,mesu.apple.com,REJECT",
  "DOMAIN-SUFFIX,mesu.v.aaplimg.com,REJECT",
  "DOMAIN,updates.cdn-apple.com,REJECT",
  "DOMAIN-SUFFIX,updates.g.aaplimg.com,REJECT",
  "DOMAIN,updates-http.cdn-apple.com,REJECT",
  "DOMAIN,xp.apple.com,REJECT",
  "DOMAIN-SUFFIX,xp.g.aaplimg.com,REJECT",
  "DOMAIN,appldnld.apple.com,REJECT",
  "DOMAIN,swscan.apple.com,REJECT",
  "DOMAIN,skl.apple.com,REJECT",

  // 3. 自定义规则与核心检测站专线
  "DOMAIN-SUFFIX,browserleaks.com,节点选择",
  "DOMAIN-SUFFIX,browserleaks.org,节点选择",
  "DOMAIN-SUFFIX,ipleak.net,节点选择",
  "DOMAIN-SUFFIX,googleapis.cn,谷歌服务",
  "DOMAIN-SUFFIX,gstatic.com,谷歌服务",
  "DOMAIN-SUFFIX,github.io,节点选择",

  // 4. 内置轻量 GEOSITE 专业分流
  "GEOSITE,category-ads-all,广告过滤",
  "GEOSITE,youtube,YouTube",
  "GEOSITE,google,谷歌服务",
  "GEOSITE,telegram,Telegram",
  "GEOSITE,netflix,Netflix",
  "GEOSITE,spotify,Spotify",
  "GEOSITE,openai,AI",
  "GEOSITE,tiktok,TikTok",
  "GEOSITE,bahamut,动画疯",
  "GEOSITE,bilibili,哔哩哔哩港澳台",
  "GEOSITE,apple,苹果服务",
  "GEOSITE,icloud,iCloud服务",
  "GEOSITE,microsoft,微软服务",

  // 5. 明确被墙服务走代理
  "GEOSITE,gfw,节点选择",

  // 6. 国内白名单优先直连（保障国内服务精准直连、绝不误走代理消耗流量）
  "GEOSITE,private,全局直连",
  "GEOSITE,cn,全局直连",
  "GEOIP,telegram,Telegram,no-resolve",
  "GEOIP,lan,全局直连,no-resolve",
  "GEOIP,cn,全局直连,no-resolve",

  // 7. 境外非中国域名全量走代理（彻底解决类似 browserleaks 等未被 GFW 屏蔽的境外测试站走直连暴露 IP 的问题）
  "GEOSITE,geolocation-!cn,节点选择",

  // 8. 兜底
  "MATCH,漏网之鱼"
];

function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 注入轻量 DNS
  config["dns"] = dnsConfig;

  // 基础性能配置
  config["ipv6"] = false;
  config["allow-lan"] = false;
  config["mode"] = "rule";
  config["log-level"] = "info";
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  // 轻量嗅探设置
  config["sniffer"] = {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": false,
    "sniff": {
      "HTTP": { "ports": [80, "8080-8880"], "override-destination": true },
      "TLS": { "ports": [443, 8443] },
      "QUIC": { "ports": [443] }
    }
  };

  // 16 个策略组（保持一致的排序与全彩图标）
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "节点选择",
      "type": "select",
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png"
    },
    {
      ...groupBaseOption,
      "name": "谷歌服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png"
    },
    {
      ...groupBaseOption,
      "name": "YouTube",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png"
    },
    {
      ...groupBaseOption,
      "name": "Telegram",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png"
    },
    {
      ...groupBaseOption,
      "name": "Spotify",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png"
    },
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/chxm1023/Script_X@main/icon/ChatGPT/ChatGPT4.png"
    },
    {
      ...groupBaseOption,
      "name": "TikTok",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png"
    },
    {
      ...groupBaseOption,
      "name": "Netflix",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Microsoft.png"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png"
    },
    {
      ...groupBaseOption,
      "name": "iCloud服务",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/iCloud.png"
    },
    {
      ...groupBaseOption,
      "name": "动画疯",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "filter": "(?i)台|tw|TW",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png"
    },
    {
      ...groupBaseOption,
      "name": "哔哩哔哩港澳台",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "include-all": true,
      "filter": "(?i)^(?!.*(官网|套餐|流量|异常|剩余)).*(港|hk|hong|🇭🇰|台|tw|taiwan|🇹🇼|澳|mo|macau|🇲🇴).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png"
    },
    {
      ...groupBaseOption,
      "name": "广告过滤",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png"
    },
    {
      ...groupBaseOption,
      "name": "全局直连",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png"
    },
    {
      ...groupBaseOption,
      "name": "全局拦截",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png"
    },
    {
      ...groupBaseOption,
      "name": "漏网之鱼",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png"
    },
    {
      ...groupBaseOption,
      "name": "WebRTC防护",
      "type": "select",
      "proxies": ["REJECT-DROP", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/Niklaus88/icon@main/Webrtc.png"
    }
  ];

  // 清空外部 rule-providers，使用内置轻量 rules
  delete config["rule-providers"];
  config["rules"] = rules;

  // 1. 遍历静态自建节点，开启 UDP 配置
  if (Array.isArray(config["proxies"])) {
    config["proxies"].forEach(proxy => {
      if (proxy && typeof proxy === "object") {
        proxy.udp = true;
      }
    });
  }

  // 2. 为所有 Proxy Provider 加载的节点统一启用 UDP 配置
  if (config["proxy-providers"] && typeof config["proxy-providers"] === "object") {
    Object.values(config["proxy-providers"]).forEach(provider => {
      if (!provider || typeof provider !== "object") return;
      provider.override = {
        ...(provider.override || {}),
        udp: true
      };
    });
  }

  return config;
}

