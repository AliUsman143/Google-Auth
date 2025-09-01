// backend/utils/fileUpload.js
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '../public/uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const saveFileLocally = async (fileBuffer, originalName) => {
  try {
    const fileExt = path.extname(originalName);
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await fs.promises.writeFile(filePath, fileBuffer);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save file');
  }
};

const deleteLocalFile = async (filePath) => {
  try {
    const fileName = path.basename(filePath);
    const fullPath = path.join(UPLOAD_DIR, fileName);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error('Error deleting local file:', error);
    throw error;
  }
};

module.exports = { saveFileLocally, deleteLocalFile };
