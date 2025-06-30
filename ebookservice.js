import fs from "fs";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

// __dirname equivalent in ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === 設定區 ===
const START_PAGE = 1;
const END_PAGE = 233;
const CONCURRENCY = 10;
const SAVE_DIR = path.join(__dirname, "downloads");
const url = `https://viewer.ebookservice.tw/api/img?p=${page}&f=jpg&r=150&preferWidth=744&preferHeight=1512&bookId=XXXXX&token=XXXXXX&bookToken=null`;
const cookie = ""; // 如果需要 cookie，請在這裡填入

// ============

if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
}

const limit = pLimit(CONCURRENCY);

async function downloadPage(page) {
    const filePath = path.join(SAVE_DIR, `${String(page).padStart(3, "0")}.jpg`);
    if (fs.existsSync(filePath)) {
        console.log(`✔ 已存在：第 ${page} 頁`);
        return;
    }

    try {
        const res = await axios.get(url, {
            responseType: "stream",
            headers: {
                Cookie: cookie,
            },
        });
        const writer = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
            res.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log(`✅ 成功下載：第 ${page} 頁`);
    } catch (err) {
        console.error(`❌ 下載失敗：第 ${page} 頁`, err.message);
    }
}

async function main() {
    const tasks = [];

    for (let i = START_PAGE; i <= END_PAGE; i++) {
        tasks.push(limit(() => downloadPage(i)));
    }

    await Promise.all(tasks);
    console.log("✅ 所有頁面下載完畢！");
}

main().catch(err => {
    console.error("❌ 程式執行出錯", err);
});
