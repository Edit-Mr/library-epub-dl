# 公共資訊圖書館電子書下載爬蟲

> 僅供學術用途。  
> 注意因為都是圖片（epub, PDF 我沒找到），因此檔案稍微會偏大且不能選取文字，但至少排版是好看的。

1. 首先請先借閱書籍並閱讀，你會看到這一大串

```
https://ebookdrm.nlpi.edu.tw/ebookservice/epubreader/hyread/v3/openbook2.jsp?sid=OGNhMDY5MWMtMzE3MC00MGZjLWExY2ItZjE0NTU2ODdhMzRm&openmode=1&eid=42490&trial=time&p=1&vid=MDNiMDVjYjEtYWY3Yy00Y2M5LWI4ZjUtMjJiODY0YTg3MjMx&returnAct=groupOnline&unit=nlpi&BP=&asset_id=4028e4757428cbd20176e129f469329d&userId=A132141782&format=&device=online
```
請從裡面複製出 `asset_id` 並添加到 `index.js`

```js
const asset_id = "4028e4757428cbd20176e129f469329d";
```

2. 接下來請你填入頁數到 `index.js`

```js
const length = 395; // 假設有 395 張圖片
```

3. 執行下載

> 記得先安裝 Node.js 和 pnpm

```bash
pnpm i
pnpm run start
```

這樣你就會在 `downloads/` 資料夾看到所以的圖片

## 製作 epub

如果你希望製作成 epub 的話可以遵循以下步驟：

> Credit: [images2epub.py by Thomas CASTELLY](https://gist.github.com/shenron/6bc94b804961743453e265295f7662f1)

1. 安裝 python 和套件

```sh
pip install imagesize lxml
```
2. 可以設定 `pagelist.txt` 指定要哪幾頁，不然他會抓全部自己排序。

```
cover.jpg
001.png
002.png
003.png
...
backcover.jpg
```

3. 可設定目錄 `toc.txt`

空白換行會被忽略，一行標題一行標記哪頁。

```
封面
cover.jpg
序章
001.png
Day 1 JavaScript 的起源與基礎（上）
009.png
Day 2 JavaScript 的起源與基礎（下）
057.png
```

4. 執行 `images2epub.py`

```
python ./images2epub.py -t "標題" -a "作者" -s "Book" --pagelist pagelist.txt --toclist toclist.txt  a/ a.epub
```

這裡有完整參數：

```
usage: images2epub.py [-h] [-t TITLE] [-a AUTHOR] [-i STORYID] [-d DIRECTION]
                      [-s SUBJECT] [-l LEVEL] [--pagelist PAGELIST]
                      [--toclist TOCLIST]
                      directory output

positional arguments:
  directory             Path to directory with images
  output                Output EPUB filename

optional arguments:
  -h, --help            show this help message and exit
  -t TITLE, --title TITLE
                        Title of the story
  -a AUTHOR, --author AUTHOR
                        Author of the story
  -i STORYID, --storyid STORYID
                        Story id (default: random)
  -d DIRECTION, --direction DIRECTION
                        Reading direction (ltr or rtl, default: ltr)
  -s SUBJECT, --subject SUBJECT
                        Subject of the story. Can be used multiple times.
  -l LEVEL, --level LEVEL
                        Compression level [0-9] (default: 9)
  --pagelist PAGELIST   Text file with list of images
  --toclist TOCLIST     Text file with table of contents
```



