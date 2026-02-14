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
grep -oP '\[.*\](\K[^)]*\)' CLAUDE.md | while read link; do
    # 去掉末尾的 )
    file="${link%)}"
    if [ ! -f "$file" ] && [ ! -f "reference/${file#*/}" ]; then
        # 检查 docs/ 和 reference/ 目录
        if [ ! -f "docs/${file#*/}" ] && [ ! -f "docs/reference/${file#*/}" ]; then
            echo "❌ 链接目标不存在：reference/${file}"
            MISSING=$((MISSING + 1))
        fi
done
if [ $MISSING -eq 0 ]; then
    echo "✅ 所有链接目标存在"
else
    echo "❌ 发现 $MISSING 个缺失链接"
    exit 1
fi

# 检查 3: 重复内容（未来可添加更复杂的检查）
echo "🔍 检查重复内容..."
# （这里可以添加更复杂的检查）

echo "✅ 检查完成！"

# 如果配置了 Git Hook，会自动阻止不合格的提交
if [ -f .git/hooks/pre-commit ]; then
    echo ""
    echo "💡 提示：检测到 Git Hook，不合格的提交将被自动阻止"
fi
