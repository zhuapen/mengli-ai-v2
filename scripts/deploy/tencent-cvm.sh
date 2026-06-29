#!/bin/bash
# 腾讯云 CVM 部署脚本
# 使用方式：
#   export TENCENT_CVM_HOST=YOUR_SERVER_IP
#   export TENCENT_CVM_USER=root
#   export TENCENT_CVM_TARGET_DIR=/var/www/mengli-ai-platform/dist
#   npm run deploy:tencent

set -e

# 检查必要环境变量
if [ -z "$TENCENT_CVM_HOST" ]; then
  echo "❌ 错误：请设置 TENCENT_CVM_HOST 环境变量（服务器 IP）"
  exit 1
fi

if [ -z "$TENCENT_CVM_USER" ]; then
  echo "❌ 错误：请设置 TENCENT_CVM_USER 环境变量（SSH 用户名）"
  exit 1
fi

if [ -z "$TENCENT_CVM_TARGET_DIR" ]; then
  echo "❌ 错误：请设置 TENCENT_CVM_TARGET_DIR 环境变量（服务器目标目录）"
  exit 1
fi

echo "🚀 开始部署到腾讯云 CVM..."
echo "   服务器: ${TENCENT_CVM_USER}@${TENCENT_CVM_HOST}"
echo "   目标目录: ${TENCENT_CVM_TARGET_DIR}"

# 执行构建
echo ""
echo "📦 执行构建..."
npm run build

# 检查 dist 是否存在
if [ ! -d "dist" ]; then
  echo "❌ 错误：dist 目录不存在，构建可能失败"
  exit 1
fi

echo "✅ 构建完成"

# 上传 dist 到服务器
echo ""
echo "📤 上传 dist 到服务器..."
rsync -avz --delete dist/ ${TENCENT_CVM_USER}@${TENCENT_CVM_HOST}:${TENCENT_CVM_TARGET_DIR}

echo ""
echo "✅ 部署完成！"
echo "   请在服务器上执行 'sudo systemctl reload nginx' 使配置生效"
