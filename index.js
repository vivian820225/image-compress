const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const [, , INPUT_DIR] = process.argv

const OUTPUT_DIR = `${INPUT_DIR}/dist`

// 圖片壓縮
const compressImage = async (img) => {
  const imgName = path.parse(img).base

  const metadata = await sharp(img).metadata()
  const format = metadata.format

  let options = {} // sharp 配置
  let formatOptions = {} // 不同格式方法参数

  switch (format) {
    case 'gif':
      options = {
        animated: true,
        limitInputPixels: false,
      }
      formatOptions = { colours: 128 }
      break
    case 'raw':
    case 'tile':
      break
    default:
      formatOptions = { quality: 75 }
  }

  try {
    // 取得輸出路徑相對於輸入路徑的相對路徑
    const relativePath = path.relative(INPUT_DIR, img)
    // 產生輸出路徑，保留子資料夾結構
    const outputDir = path.join(OUTPUT_DIR, path.dirname(relativePath))

    createDirectoryIfNotExists(outputDir)

    const outputPath = path.join(outputDir, imgName)

    // 檢查是否存在相同名稱及格式的檔案，若存在則刪除原檔案
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }

    await sharp(img, options)?.[format](formatOptions).toFile(outputPath)

    console.log(`已將 ${img} 成功壓縮`)
  } catch (error) {
    console.error(`壓縮 ${img} 時發生錯誤:`, error)
  }
}

// 將圖片轉換為 WebP 格式
const convertToWebp = async (img) => {
  try {
    const imgName = path.parse(img).name

    // 取得輸出路徑相對於輸入路徑的相對路徑
    const relativePath = path.relative(INPUT_DIR, img)
    // 產生輸出路徑，保留子資料夾結構
    const outputDir = path.join(OUTPUT_DIR, path.dirname(relativePath))

    createDirectoryIfNotExists(outputDir)

    const outputPath = path.join(outputDir, `${imgName}.webp`)

    // 檢查是否存在相同名稱及格式的檔案，若存在則刪除原檔案
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }

    await sharp(img).webp().toFile(outputPath)

    console.log(`已將 ${img} 轉換為 WebP`)
  } catch (error) {
    console.error(`轉換 ${img} 時發生錯誤:`, error)
  }
}

// 遍歷資料夾中的圖片並進行轉換
const processDirectory = async (dir) => {
  try {
    const files = await fs.promises.readdir(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)

      const stat = await fs.promises.stat(filePath)

      if (stat.isDirectory()) {
        await processDirectory(filePath)
      } else {
        compressImage(filePath, files.indexOf(file))

        const ext = path.extname(file).toLowerCase()

        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          await convertToWebp(filePath, files.indexOf(file))
        }
      }
    }
  } catch (error) {
    console.error('處理圖片時發生錯誤:', error)
  }
}

// 檢查目錄是否存在，不存在則創建目錄
const createDirectoryIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 圖片處理
const processImages = async () => {
  try {
    await processDirectory(INPUT_DIR)
  } catch (error) {
    console.error('處理圖片時發生錯誤:', error)
  }
}

processImages()
