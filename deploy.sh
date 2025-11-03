#!/bin/bash

echo "🚀 开始部署宝可梦图鉴到 Vercel..."

# 检查项目状态
echo "📋 检查Git状态..."
if ! git status; then
    echo "❌ Git仓库状态异常"
    exit 1
fi

# 检查构建
echo "🔨 运行构建测试..."
if npm run build; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败"
    exit 1
fi

# 提交更改（如果有）
echo "📝 检查是否有未提交的更改..."
if [ -n "$(git status --porcelain)" ]; then
    echo "📤 提交更改..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
else
    echo "✅ 没有未提交的更改"
fi

echo "🎯 部署完成！"
echo "📱 查看部署状态: https://vercel.com/dashboard"