// 国内DNS服务器
const domesticNameservers = [
  "https://223.5.5.5/dns-query", // 阿里DoH
  "https://doh.pub/dns-query" // 腾讯DoH
];
// 国外DNS服务器
const foreignNameservers = [
  "https://1.1.1.1/dns-query", // Cloudflare DoH
  "https://8.8.8.8/dns-query", // Google DoH
  "https://8.8.4.4/dns-query"  // Google DoH 备用
];
// DNS配置
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
    // 本地主机/设备
    "+.lan",
    "+.local",
    // // Windows网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ快速登录检测失败
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
      // 追加以下条目
    "+.in-addr.arpa", 
    "+.ip6.arpa",
    "time.*.com",
    "time.*.gov",
    "pool.ntp.org",
    // 微信快速登录检测失败
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29"], // 可修改成自己 ISP 的 DNS
  "nameserver": [...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers],
  "direct-nameserver": [...domesticNameservers],
  "nameserver-policy": {
    "geosite:private,cn": domesticNameservers
  }
};
// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};
// 规则集配置
const ruleProviders = {
  "reject": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "path": "./ruleset/loyalsoldier/reject.yaml"
  },
  "icloud": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
    "path": "./ruleset/loyalsoldier/icloud.yaml"
  },
  "apple": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
    "path": "./ruleset/loyalsoldier/apple.yaml"
  },
  "google": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt",
    "path": "./ruleset/loyalsoldier/google.yaml"
  },
  "proxy": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/loyalsoldier/proxy.yaml"
  },
  "direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/loyalsoldier/direct.yaml"
  },
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/loyalsoldier/private.yaml"
  },
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/loyalsoldier/gfw.yaml"
  },
  "tld-not-cn": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
    "path": "./ruleset/loyalsoldier/tld-not-cn.yaml"
  },
  "telegramcidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/loyalsoldier/telegramcidr.yaml"
  },
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/loyalsoldier/cncidr.yaml"
  },
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/loyalsoldier/lancidr.yaml"
  },
  "applications": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    "path": "./ruleset/loyalsoldier/applications.yaml"
  },
  "bahamut": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/Bahamut.txt",
    "path": "./ruleset/Niklaus88/bahamut.yaml"
  },
  "YouTube": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/YouTube.txt",
    "path": "./ruleset/Niklaus88/YouTube.yaml"
  },
  "Netflix": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/Netflix.txt",
    "path": "./ruleset/Niklaus88/Netflix.yaml"
  },
  "Spotify": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/Spotify.txt",
    "path": "./ruleset/Niklaus88/Spotify.yaml"
  },
  "BilibiliHMT": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/BilibiliHMT.txt",
    "path": "./ruleset/Niklaus88/BilibiliHMT.yaml"    
  },
  "AI": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/AI.txt",
    "path": "./ruleset/Niklaus88/AI.yaml"    
  },
  "TikTok": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/TikTok.txt",
    "path": "./ruleset/Niklaus88/TikTok.yaml"    
  },
  "Microsoft": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/Niklaus88/rules@main/rule/Microsoft.txt",
    "path": "./ruleset/Niklaus88/Microsoft.yaml"    
  },
};
// 规则
const rules = [
  // 受信会议与实时音视频软件（优先放行或走代理）
  "PROCESS-NAME,Zoom.exe,Direct",
  "PROCESS-NAME,Discord.exe,Proxy",
  "DOMAIN-SUFFIX,zoom.us,Direct",
  "DOMAIN-SUFFIX,zoom.com,Direct",
  "DOMAIN-SUFFIX,discord.com,Proxy",
  "DOMAIN-SUFFIX,discord.gg,Proxy",
  // 拦截 WebRTC STUN 探测 (解决 WebRTC 泄漏)
  "DST-PORT,3478,WebRTC Block",
  "DST-PORT,5349,WebRTC Block",
  "DST-PORT,19302,WebRTC Block",
  "DST-PORT,19303,WebRTC Block",
  "DST-PORT,19304,WebRTC Block",
  "DST-PORT,19305,WebRTC Block",
  "DST-PORT,19306,WebRTC Block",
  "DST-PORT,19307,WebRTC Block",
  "DST-PORT,19308,WebRTC Block",
  "DST-PORT,19309,WebRTC Block",
  "DOMAIN-KEYWORD,stun,WebRTC Block",
  // 自定义规则
  "DOMAIN-SUFFIX,googleapis.cn,Google", // Google服务
  "DOMAIN-SUFFIX,gstatic.com,Google", // Google静态资源
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,Google", // Google Play下载服务
  "DOMAIN-SUFFIX,github.io,Proxy", // Github Pages
  "DOMAIN,v2rayse.com,Proxy", // V2rayse节点工具
  // 哔哩哔哩全系服务及第三方客户端漫游解析
  "DOMAIN-SUFFIX,bsbsb.top,Bilibili HMT",
  "DOMAIN-SUFFIX,bilibili.com,Bilibili HMT",
  "DOMAIN-SUFFIX,biliapi.net,Bilibili HMT",
  "DOMAIN-SUFFIX,biliapi.com,Bilibili HMT",
  "DOMAIN-SUFFIX,bilivideo.com,Bilibili HMT",
  "DOMAIN-SUFFIX,bilivideo.cn,Bilibili HMT",
  "DOMAIN-SUFFIX,b23.tv,Bilibili HMT",
  "DOMAIN-SUFFIX,hdslb.com,Bilibili HMT",
  "DOMAIN-SUFFIX,biligame.com,Bilibili HMT",
  "DOMAIN-SUFFIX,bilibili.tv,Bilibili HMT",
  "DOMAIN-SUFFIX,acgvideo.com,Bilibili HMT",
  // Loyalsoldier 规则集
  "RULE-SET,applications,Direct",
  "RULE-SET,private,Direct",
  "RULE-SET,reject,AdBlock",
  "RULE-SET,apple,Apple",
  "RULE-SET,icloud,iCloud",
  "RULE-SET,Microsoft,Microsoft",
  "RULE-SET,YouTube,YouTube",
  "RULE-SET,Netflix,Netflix",
  "RULE-SET,bahamut,Bahamut",
  "RULE-SET,Spotify,Spotify",
  "RULE-SET,BilibiliHMT,Bilibili HMT",
  "RULE-SET,AI,AI",
  "RULE-SET,TikTok,TikTok",
  "RULE-SET,google,Google",
  "RULE-SET,proxy,Proxy",
  "RULE-SET,gfw,Proxy",
  "RULE-SET,telegramcidr,Telegram,no-resolve",
  "RULE-SET,direct,Direct",
  "RULE-SET,lancidr,Direct,no-resolve",
  "RULE-SET,cncidr,Direct,no-resolve",
  // 核心分流：境外非中国域名优先走代理（解决海外未被 GFW 屏蔽的测试站/小众网站误判直连导致真实 IP 泄露）
  "GEOSITE,geolocation-!cn,Proxy",
  // 国内白名单直连
  "GEOSITE,CN,Direct",
  "GEOIP,LAN,Direct,no-resolve",
  "GEOIP,CN,Direct,no-resolve",
  "MATCH,Final"
];
// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 5000,
  "url": "https://cp.cloudflare.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 配置全局 Geo 资源更新地址（采用 Loyalsoldier 经过清洗去重的 Geo 规则库）
  config["geox-url"] = {
    "geoip": "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat",
    "geosite": "https://fastly.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat",
    "mmdb": "https://fastly.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb",
    "asn": "https://fastly.jsdelivr.net/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb"
  };

  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;

  // 开启域名嗅探，防止 WebRTC / 纯 IP 泄漏
  config["sniffer"] = {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "sniff": {
      "HTTP": { "ports": [80, "8080-8880"], "override-destination": true },
      "TLS": { "ports": [443, 8443] },
      "QUIC": { "ports": [443] }
    }
  };

  // 覆盖原配置中的代理组
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "Proxy",
      "type": "select",
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png"
    },
    {
      ...groupBaseOption,
      "name": "Google",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png"
    },
    {
      ...groupBaseOption,
      "name": "YouTube",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png"
    },
    {
      ...groupBaseOption,
      "name": "Telegram",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png"
    },
    {
      ...groupBaseOption,
      "name": "Spotify",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png"
    },
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "include-all": true,
      "proxies": ["Proxy"],
      "icon": "https://fastly.jsdelivr.net/gh/chxm1023/Script_X@main/icon/ChatGPT/ChatGPT4.png"
    },
    {
      ...groupBaseOption,
      "name": "TikTok",
      "type": "select",
      "include-all": true,
      "proxies": ["Proxy"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/TikTok.png"
    },
    {
      ...groupBaseOption,
      "name": "Netflix",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png"
    },
    {
      ...groupBaseOption,
      "name": "Microsoft",
      "type": "select",
      "proxies": ["Proxy", "Direct"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Microsoft.png"
    },
    {
      ...groupBaseOption,
      "name": "Apple",
      "type": "select",
      "proxies": ["Direct", "Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png"
    },
    {
      ...groupBaseOption,
      "name": "iCloud",
      "type": "select",
      "proxies": ["Direct", "Proxy"],
      "include-all": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/iCloud.png"
    },
    {
      ...groupBaseOption,
      "name": "Bahamut",
      "type": "select",
      "proxies": ["Proxy"],
      "include-all": true,
      "filter": "(?i)台|tw|TW",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png"
    },
    {
      ...groupBaseOption,
      "name": "Bilibili HMT",
      "type": "select",
      "proxies": ["Direct", "Proxy"],
      "include-all": true,
      "filter": "(?i)^(?!.*(官网|套餐|流量|异常|剩余)).*(港|hk|hong|🇭🇰|台|tw|taiwan|🇹🇼|澳|mo|macau|🇲🇴).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png"
    },
    {
      ...groupBaseOption,
      "name": "AdBlock",
      "type": "select",
      "proxies": ["REJECT", "DIRECT", "Proxy"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png"
    },
    {
      ...groupBaseOption,
      "name": "Direct",
      "type": "select",
      "proxies": ["DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png"
    },
    {
      ...groupBaseOption,
      "name": "Reject",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Reject.png"
    },
    {
      ...groupBaseOption,
      "name": "Final",
      "type": "select",
      "proxies": ["Proxy", "Direct"],
      "include-all": true,
      "filter": "^(?!.*(官网|套餐|流量|异常|剩余)).*$",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png"
    },
    {
      ...groupBaseOption,
      "name": "WebRTC Block",
      "type": "select",
      "proxies": ["REJECT-DROP", "Proxy"],
      "icon": "https://fastly.jsdelivr.net/gh/Niklaus88/icon@main/Webrtc.png"
    }
  ];

  // 覆盖原配置中的规则与规则集
  config["rule-providers"] = ruleProviders;
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

