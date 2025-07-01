# 圖書館電子書下載

僅供學術用途。  
圖書館是讓你學習的地方，我學習爬蟲。

## TL;DR

底下是一邊研究的筆記，簡單來說就是：

* PDF: 似乎都有經過加密
* EPUB:
  * 圖片：有的直接送你，有的切得很醜。
  * 內文：都有 DRM，下載的 xhtml 是二進制，目前還沒空研究。

所以純圖片的有的平台可以輕鬆下載，純文字的不行。

## [公共資訊圖書館](https://ebook.nlpi.edu.tw/)

![](https://ebook.nlpi.edu.tw/images/logo.png)

### EPUB



目前遇到兩種情況，可以開 F12 看看，建議可以直接篩選圖片封包：

#### 情況 1：整本 EPUB 送你

如果到中間的頁面看得出來是文字而不是圖片，那看來他整本 EPUB 送你了。圖片不會，但內容會看 Cookie。

觀察下載的網址

```
https://ebookdrm.nlpi.edu.tw/hyreadipadservice3/hyread/v3/asset/4028e4757c7909bc017cf172c9096a49/_EPUB/OEBPS/image/p11.jpg
```

可以看到 `OEBPS`，熟悉的 EPUB 資料夾，因此可以根據目錄結構找到完整的書。

```
https://ebookdrm.nlpi.edu.tw/hyreadipadservice3/hyread/v3/asset/4028e4757c7909bc017cf172c9096a49/_EPUB/OEBPS/content.opf
```

#### 情況 2：純圖片

靜態資源，不會看 cookie 跟 token。一樣跟上面一樣可以下載

檔案稍微會偏大且不能選取文字，但至少排版是好看的。

1. 首先請先借閱書籍並閱讀，你會看到這一大串

```
https://ebookdrm.nlpi.edu.tw/ebookservice/EPUBreader/hyread/v3/openbook2.jsp?sid=xxx...&asset_id=4028e4757428cbd20176e129f469329d&userId=...
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

### PDF

看起來是下載一張張圖片，但經過加密，或是單純編碼沒設好。目前還沒研究怎麼下載。

## [台灣雲端書櫃](https://www.ebookservice.tw/tc)

![](https://www.ebookservice.tw/images/logo.png)


會看 Cookie，純圖片。不確定有沒有其他格式。

借閱書籍並填入 `ebookservice.js`

```js
const START_PAGE = 1;
const END_PAGE = 233;
const CONCURRENCY = 10;
const SAVE_DIR = path.join(__dirname, "downloads");
const url = `https://viewer.ebookservice.tw/api/img?p=${page}&f=jpg&r=150&preferWidth=744&preferHeight=1512&bookId=XXXXX&token=XXXXXX&bookToken=null`;
const cookie = ""; // 如果需要 cookie，請在這裡填入
```
最後執行

```sh
node ebookservice.js
```

## [HyRead ebook 臺中市立圖書館](https://taichunggov.ebook.hyread.com.tw/)

![](https://taichunggov.ebook.hyread.com.tw/Template/RWD3.0/images/hyread-logo-1.png)

### EPUB

跟公共資訊圖書館一樣有純圖片跟完整的 EPUB。完整 EPUB 處理方式相同，但是純圖片的很醜：

![](https://service.ebook.hyread.com.tw/hyreadipadservice3/hyread/v3/asset/8a8a84ca88aebaf6018c18b8fba7618e/_epub/OEBPS/Images/106.png)

### PDF

還沒看

## [臺中市立圖書館 | udn 讀書館](https://reading.udn.com/udnlib/taich)

![](https://reading.udn.com/udnlib/images/udn-logo.png)

### PDF

讀圖片，吃 cookie。

### EPUB

目前看到是直接送 EPUB。不吃 cookie，隨便抓張圖片就能看到 EPUB 目錄了。

```
https://reading.udn.com/v2/mag_demo2/downloadEpub.do?cp_book_id=51880/OEBPS/Images/2648861_36_1.jpg
```

## [iRead eBooks 華藝電子書](https://www.airitibooks.com/)

![](https://www.airitibooks.com/Content/images/logo.jpg)

沒登入成功。大學登不進去，高中需要學校的通用帳號密碼。



## 圖片製作 EPUB

如果你希望製作成 EPUB 的話可以遵循以下步驟：

> Credit: [images2EPUB.py by Thomas CASTELLY](https://gist.github.com/shenron/6bc94b804961743453e265295f7662f1)

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

4. 執行 `images2EPUB.py`

```
python ./images2EPUB.py -t "哎呀！早知道就不會破版的CSS設計技巧：前端工程師防止佈局意外的必學密技" -a "陳泰銘 Taiming" -s "Book" --pagelist pagelist.txt --toclist toclist.txt  downloads/ output.EPUB
```

這裡有完整參數：

```
usage: images2EPUB.py [-h] [-t TITLE] [-a AUTHOR] [-i STORYID] [-d DIRECTION]
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

