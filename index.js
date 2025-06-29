import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { promisify } from 'util';
import pLimit from 'p-limit';

const writeFile = promisify(fs.writeFile);

// 串的基本路徑
const baseUrl = 'https://ebookdrm.nlpi.edu.tw/hyreadipadservice3/hyread/v3/asset/4028e4757428cbd20176e129f469329d/_epub/OEBPS/Images/';
const outputDir = './downloads';

// 建立資料夾（如果還沒存在）
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const downloadImage = async (filename) => {
  const url = baseUrl + filename;
  const outputPath = path.join(outputDir, filename);
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await writeFile(outputPath, response.data);
    console.log(`✅ Downloaded ${filename}`);
  } catch (err) {
    console.error(`❌ Failed ${filename}:`, err.response?.status || err.message);
  }
};

const main = async () => {
  const staticImages = ['cover.jpg', 'backcover.jpg'];
  const numberedImages = Array.from({ length: 395 }, (_, i) =>
    String(i + 1).padStart(3, '0') + '.png'
  );

  const allImages = [...staticImages, ...numberedImages];

  const limit = pLimit(10); // 同時最多 10 個下載
  const downloadJobs = allImages.map(filename =>
    limit(() => downloadImage(filename))
  );

  await Promise.all(downloadJobs);
  console.log('🎉 All downloads complete.');
};

main();
