#!/usr/bin/env bash
set -euo pipefail

BASE_URL="https://ebookdrm.nlpi.edu.tw/hyreadipadservice3/hyread/v3/asset/4028e4757428cbd20176e129f469329d/_epub"
TMP_DIR="epub_tmp"
OUT_FILE="book.epub"

# ❗ 你要先從瀏覽器複製 Cookie 字串貼在這裡（可從 DevTools 的 Request Headers 中複製）
COOKIE=''
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR/META-INF" "$TMP_DIR/OEBPS"

echo "📄 下載基本結構..."
curl -s "$BASE_URL/mimetype" -o "$TMP_DIR/mimetype"
curl -s "$BASE_URL/META-INF/container.xml" -o "$TMP_DIR/META-INF/container.xml"
curl -s "$BASE_URL/OEBPS/content.opf" -o "$TMP_DIR/OEBPS/content.opf"

echo "🔍 解析 manifest..."
manifest_files=$(grep -oE 'href="[^"]+"' "$TMP_DIR/OEBPS/content.opf" | sed -E 's/href="([^"]+)"/\1/' | sort -u)
cover_image=$(grep '<meta[^>]*name="cover"' "$TMP_DIR/OEBPS/content.opf" | grep -oE 'content="[^"]+"' | cut -d'"' -f2)

if [[ -n "$cover_image" ]] && ! echo "$manifest_files" | grep -q "$cover_image"; then
  manifest_files="$manifest_files"$'\n'"Images/$cover_image"
fi

echo "📥 下載 manifest 檔案..."
for path in $manifest_files; do
  echo "→ $path"
  mkdir -p "$TMP_DIR/OEBPS/$(dirname "$path")"
  if [[ "$path" == Text/* ]]; then
    # 需要 Cookie 的 XHTML
    curl -s --cookie "$COOKIE" "$BASE_URL/OEBPS/$path" -o "$TMP_DIR/OEBPS/$path"
  else
    # 圖片、CSS、nav 等不需要 Cookie
    curl -s "$BASE_URL/OEBPS/$path" -o "$TMP_DIR/OEBPS/$path"
  fi
done

# 封面頁自動偵測補抓
for coverpage in Text/Cover.html Text/cover.xhtml; do
  if curl -s --head --cookie "$COOKIE" "$BASE_URL/OEBPS/$coverpage" | grep -q "200 OK"; then
    echo "📗 發現封面頁：$coverpage"
    mkdir -p "$TMP_DIR/OEBPS/$(dirname "$coverpage")"
    curl -s --cookie "$COOKIE" "$BASE_URL/OEBPS/$coverpage" -o "$TMP_DIR/OEBPS/$coverpage"
  fi
done

echo "📦 打包 EPUB..."
pushd "$TMP_DIR" > /dev/null
zip -X0 "../$OUT_FILE" mimetype
zip -Xr9 "../$OUT_FILE" . -x mimetype
popd > /dev/null

echo "✅ EPUB 完成：$OUT_FILE"
