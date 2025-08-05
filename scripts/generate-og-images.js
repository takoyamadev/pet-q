#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// OG画像のSVGテンプレート
const createOgSvg = () => {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bgGradient)"/>
  
  <!-- ペットアイコン -->
  <g transform="translate(460, 200)">
    <path d="M4.5 6.5C4.5 5.39543 5.39543 4.5 6.5 4.5C7.60457 4.5 8.5 5.39543 8.5 6.5V8.5C8.5 9.60457 7.60457 10.5 6.5 10.5C5.39543 10.5 4.5 9.60457 4.5 8.5V6.5Z" fill="white" transform="scale(3.33)"/>
    <path d="M15.5 6.5C15.5 5.39543 16.3954 4.5 17.5 4.5C18.6046 4.5 19.5 5.39543 19.5 6.5V8.5C19.5 9.60457 18.6046 10.5 17.5 10.5C16.3954 10.5 15.5 9.60457 15.5 8.5V6.5Z" fill="white" transform="scale(3.33)"/>
    <path d="M4.5 15.5C4.5 13.5 6 11.5 8.5 11.5H15.5C18 11.5 19.5 13.5 19.5 15.5C19.5 17.5 18 19.5 15.5 19.5H8.5C6 19.5 4.5 17.5 4.5 15.5Z" fill="white" transform="scale(3.33)"/>
  </g>
  
  <!-- PetQ ロゴ -->
  <text x="600" y="280" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white">PetQ</text>
  
  <!-- ペットキュー -->
  <text x="600" y="340" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="white">ペットキュー</text>
  
  <!-- 説明文 -->
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white" opacity="0.9">
    ペット飼育者のための匿名相談コミュニティ
  </text>
  
  <!-- サブテキスト -->
  <text x="600" y="450" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="white" opacity="0.8">
    悩みを共有、経験をシェア、仲間と繋がる
  </text>
</svg>`;
};

// Twitter用SVGテンプレート（同じデザイン）
const createTwitterSvg = createOgSvg;

async function generateImages() {
  const outputDir = path.join(__dirname, '..', 'public', 'og');
  
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // OG画像生成
    const ogSvg = createOgSvg();
    await sharp(Buffer.from(ogSvg))
      .png()
      .toFile(path.join(outputDir, 'petq-og.png'));
    console.log('✓ Generated petq-og.png');

    // Twitter画像生成
    const twitterSvg = createTwitterSvg();
    await sharp(Buffer.from(twitterSvg))
      .png()
      .toFile(path.join(outputDir, 'petq-twitter.png'));
    console.log('✓ Generated petq-twitter.png');

  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

generateImages();