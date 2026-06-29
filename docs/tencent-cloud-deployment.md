# 腾讯云 CVM + Nginx 部署指南

## 一、部署架构

```
Vue/Vite 前端项目
  → npm run build 生成 dist/
  → 上传 dist/ 到腾讯云 CVM
  → Nginx 托管静态文件
  → Nginx 支持 Vue Router SPA fallback
  → Nginx 反向代理 /api 到后端服务
```

---

## 二、推荐服务器目录

```
/var/www/mengli-ai-platform/dist
```

---

## 三、服务器准备

### 3.1 腾讯云 CVM

- 推荐配置：2 核 4G 起步
- 操作系统：Ubuntu 22.04 LTS 或 CentOS 8+

### 3.2 安全组

| 端口 | 协议 | 用途 |
|------|------|------|
| 22 | TCP | SSH 连接 |
| 80 | TCP | HTTP 访问 |
| 443 | TCP | HTTPS 访问 |

### 3.3 安装 Nginx

**Ubuntu:**
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

**CentOS:**
```bash
sudo yum install epel-release -y
sudo yum install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 3.4 域名解析

将域名 A 记录指向服务器公网 IP。

### 3.5 后端 API

确保后端服务可访问，例如运行在 `http://127.0.0.1:3000`。

---

## 四、本地构建

```bash
npm install
npm run build
```

构建产物在 `dist/` 目录。

---

## 五、上传 dist 到服务器

### 方式一：scp

```bash
scp -r dist/* root@YOUR_SERVER_IP:/var/www/mengli-ai-platform/dist/
```

### 方式二：rsync（推荐）

```bash
rsync -avz --delete dist/ root@YOUR_SERVER_IP:/var/www/mengli-ai-platform/dist/
```

### 方式三：使用部署脚本

```bash
export TENCENT_CVM_HOST=YOUR_SERVER_IP
export TENCENT_CVM_USER=root
export TENCENT_CVM_TARGET_DIR=/var/www/mengli-ai-platform/dist
npm run deploy:tencent
```

> **注意：** 不要将真实 IP、密码、密钥写入代码或文档。

---

## 六、Nginx 配置

### 6.1 创建配置文件

```bash
sudo nano /etc/nginx/sites-available/mengli-ai-platform
```

### 6.2 配置内容

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/mengli-ai-platform/dist;
    index index.html;

    # 前端路由 fallback（SPA 必须）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 必须保留 Authorization header（Bearer token）
        proxy_set_header Authorization $http_authorization;
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss image/svg+xml;
}
```

### 6.3 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/mengli-ai-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.4 配置说明

| 配置项 | 说明 |
|--------|------|
| `location /` + `try_files` | 前端路由 fallback，刷新页面不 404 |
| `location /api/` | 后端 API 反向代理 |
| `proxy_set_header Authorization` | 保留 Bearer token 传递 |
| `gzip` | 静态资源压缩 |

> 如果后端不是本机 3000 端口，修改 `proxy_pass` 地址。

---

## 七、HTTPS 配置

生产环境建议开启 HTTPS。

### 方式一：腾讯云 SSL 证书

1. 在腾讯云控制台申请免费 SSL 证书
2. 下载证书文件
3. 上传到服务器 `/etc/nginx/ssl/`
4. 修改 Nginx 配置：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/your-domain.com.crt;
    ssl_certificate_key /etc/nginx/ssl/your-domain.com.key;

    # ... 其余配置同上
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

### 方式二：Certbot（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

> **安全提醒：** 不要将证书私钥提交到代码仓库。

---

## 八、常用 Nginx 命令

```bash
# 检查配置语法
nginx -t

# 重新加载配置（不中断服务）
systemctl reload nginx

# 重启服务
systemctl restart nginx

# 查看状态
systemctl status nginx

# 查看错误日志
tail -f /var/log/nginx/error.log
```

---

## 九、生产检查

部署后逐项检查：

- [ ] `VITE_ENABLE_MOCK=false`
- [ ] `VITE_API_BASE_URL=/api`
- [ ] `dist/` 已上传到正确目录
- [ ] Nginx `root` 指向 `dist`
- [ ] `try_files` fallback 已配置
- [ ] `/api` 能转发到后端
- [ ] 刷新任意路由不 404
- [ ] HTTPS 证书有效（如已配置）
