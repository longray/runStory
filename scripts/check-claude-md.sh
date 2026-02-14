#!/usr/bin/env bash
set -e

echo "🔍 检查 CLAUDE.md 渐进式披露合规性..."

# 检查 1: 行数限制
LINES=$(wc -l < CLAUDE.md)
if [ $LINES -gt 100 ]; then
    echo "⚠️  警告：CLAUDE.md 超过 100 行（当前：$LINES）"
    echo "建议：将详细内容移到 reference/"
else
    echo "✅ 行数正常：$LINES"
fi

# 检查 2: 链接目标存在（修复后的 grep 模式）
echo "🔍 检查链接目标..."
MISSING=0

# 修复：使用更精确的 grep 模式
grep -oE '\[.*\]\([^)]+)\)' CLAUDE.md | while read -r link; do
    # 去掉末尾的 )
    file="${link%)}"

    if [ ! -f "$file" ] && [ ! -f "reference/$file" ]; then
        echo "❌ 链接目标不存在：$file"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -eq 0 ]; then
    echo "✅ 所有链接目标存在"
else
    echo "❌ 发现 $MISSING 个缺失链接"
    exit 1
fi

# 检查 3: 重复内容
echo "🔍 检查重复内容..."
# （这里可以添加更复杂的检查）

echo "✅ 检查完成！"
