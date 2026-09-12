// ==========================================
// Clash Rule based proxy utility (iOS) 专属轻量脚本
// 特点：内置 GeoSite/GeoIP 极致省内存，完美防 WebRTC & DNS 泄露
// ==========================================

// 国内 DoH
const domesticNameservers = [
  "https://223.5.5.5/dns-query",
  "https://doh.pub/dns-query"
];

// 国外 DoH
const foreignNameservers = [
  "https://1.1.1.1/dns-query",
  "https://8.8.4.4/dns-query",
  "https://208.67.222.222/dns-query"
];

// DNS 配置（极致防泄露 + 内存优化）
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
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
  // 1. 核心拦截 WebRTC STUN 探测 (解决 WebRTC 泄漏)
  "DST-PORT,3478,REJECT-DROP",
  "DST-PORT,5349,REJECT-DROP",
  "DST-PORT,19302,REJECT-DROP",
  "DST-PORT,19303,REJECT-DROP",
  "DST-PORT,19304,REJECT-DROP",
  "DST-PORT,19305,REJECT-DROP",
  "DST-PORT,19306,REJECT-DROP",
  "DST-PORT,19307,REJECT-DROP",
  "DST-PORT,19308,REJECT-DROP",
  "DST-PORT,19309,REJECT-DROP",
  "DOMAIN-KEYWORD,stun,REJECT-DROP",

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

  // 3. 自定义与直连白名单
  "DOMAIN-SUFFIX,googleapis.cn,节点选择",
  "DOMAIN-SUFFIX,gstatic.com,节点选择",
  "DOMAIN-SUFFIX,github.io,节点选择",

  // 4. 内置轻量 GEOSITE 分流
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
  "GEOSITE,microsoft,微软服务",
  "GEOSITE,gfw,节点选择",
  "GEOSITE,private,全局直连",
  "GEOSITE,cn,全局直连",

  // 5. IP 与地理分流 (GEOIP)
  "GEOIP,telegram,Telegram,no-resolve",
  "GEOIP,lan,全局直连,no-resolve",
  "GEOIP,cn,全局直连,no-resolve",

  // 6. 兜底
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
  config["secret"] = "L7jTJFqsSsNMkaLNW2aj_2026";
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
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Proxy.png"
    },
    {
      ...groupBaseOption,
      "name": "谷歌服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Google_Search.png"
    },
    {
      ...groupBaseOption,
      "name": "YouTube",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/YouTube.png"
    },
    {
      ...groupBaseOption,
      "name": "Telegram",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Telegram.png"
    },
    {
      ...groupBaseOption,
      "name": "Spotify",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Spotify.png"
    },
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/chxm1023/Script_X/main/icon/ChatGPT/ChatGPT4.png"
    },
    {
      ...groupBaseOption,
      "name": "TikTok",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/TikTok.png"
    },
    {
      ...groupBaseOption,
      "name": "Netflix",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Netflix.png"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Microsoft.png"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Apple.png"
    },
    {
      ...groupBaseOption,
      "name": "动画疯",
      "type": "select",
      "proxies": ["节点选择"],
      "include-all": true,
      "filter": "(?i)台|tw|TW",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Bahamut.png"
    },
    {
      ...groupBaseOption,
      "name": "哔哩哔哩港澳台",
      "type": "select",
      "proxies": ["全局直连", "节点选择"],
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/bilibili.png"
    },
    {
      ...groupBaseOption,
      "name": "广告过滤",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Advertising.png"
    },
    {
      ...groupBaseOption,
      "name": "全局直连",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Direct.png"
    },
    {
      ...groupBaseOption,
      "name": "全局拦截",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Reject.png"
    },
    {
      ...groupBaseOption,
      "name": "漏网之鱼",
      "type": "select",
      "proxies": ["节点选择", "全局直连"],
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/Final.png"
    }
  ];

  // 清空外部 rule-providers，使用内置轻量 rules
  delete config["rule-providers"];
  config["rules"] = rules;

  // 强制开启节点 UDP 支持 WebRTC / QUIC
  if (config["proxies"]) {
    config["proxies"].forEach(proxy => {
      proxy.udp = true;
    });
  }

  return config;
}
