// build-manifest.js
const fs = require('fs');
const path = require('path');

console.log('Starting manifest generation...');

// 定義要掃描的資料夾路徑
const dataDir = path.join(__dirname, 'data');
const manuscriptsDir = path.join(__dirname, 'manuscripts');
const rigzinDir = path.join(__dirname, 'rigzintsewangnorbu');
const imagesDir = path.join(__dirname, 'images');

// 準備儲存清單的物件
const manifest = {
    documents: [],
    images: {
        manuscripts: [],
        rigzintsewangnorbu: [],
        others: []
    }
};

try {
    // 1. 掃描 data 資料夾中的 JSON 文獻檔案
    const dataFiles = fs.readdirSync(dataDir);
    manifest.documents = dataFiles.filter(file => 
        file.endsWith('.json') && 
        file !== 'all_runtime_documents.json' && // 排除舊的合併檔
        file !== 'file_manifest.json' // 排除清單檔本身
    );
    console.log(`Found ${manifest.documents.length} document files.`);

    // 2. 掃描 manuscripts 資料夾中的圖片
    if (fs.existsSync(manuscriptsDir)) {
        const manuscriptFiles = fs.readdirSync(manuscriptsDir);
        manifest.images.manuscripts = manuscriptFiles.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        console.log(`Found ${manifest.images.manuscripts.length} manuscript images.`);
    } else {
        console.warn('Warning: manuscripts directory not found.');
    }

    // 3. 掃描 rigzintsewangnorbu 資料夾中的圖片
    if (fs.existsSync(rigzinDir)) {
        const rigzinFiles = fs.readdirSync(rigzinDir);
        manifest.images.rigzintsewangnorbu = rigzinFiles.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        console.log(`Found ${manifest.images.rigzintsewangnorbu.length} rigzintsewangnorbu images.`);
    } else {
        console.warn('Warning: rigzintsewangnorbu directory not found.');
    }
    
    // 4. 掃描 images 資料夾中的圖片
    if (fs.existsSync(imagesDir)) {
        const otherImages = fs.readdirSync(imagesDir);
        manifest.images.others = otherImages.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        console.log(`Found ${manifest.images.others.length} other images.`);
    } else {
        console.warn('Warning: images directory not found.');
    }


    // 將產生的清單物件寫入到 data/file_manifest.json 檔案中
    const manifestPath = path.join(dataDir, 'file_manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✅ Manifest successfully created at: ${manifestPath}`);

} catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1); // 讓 GitHub Actions 知道任務失敗
}