const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { indexPDFText } = require('../services/vectorStore');

const router = express.Router();

// Store PDF metadata like numPages
let pdfMeta = { numPages: 1 };

// Configure where to store uploaded PDFs
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  console.log('File uploaded:', req.file.filename);

  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    try {
      const data = await pdfParse(dataBuffer);
      console.log(`Extracted ${data.text.length} chars from PDF`);
      console.log(`PDF has ${data.numpages} pages`);

      // Save number of pages globally
      pdfMeta.numPages = data.numpages;

      // Save extracted text to /texts folder
      const textFile = `texts/${req.file.filename}.txt`;
      fs.mkdirSync('texts', { recursive: true });
      fs.writeFileSync(textFile, data.text);
      console.log('Extracted text saved to:', textFile);

      // Index text chunks
      await indexPDFText(textFile);

    } catch (parseErr) {
      console.error('pdf-parse failed:', parseErr.message);
      // Fallback: save empty text file so app doesn't break
      const textFile = `texts/${req.file.filename}.txt`;
      fs.mkdirSync('texts', { recursive: true });
      fs.writeFileSync(textFile, '');
      console.log('Saved empty text file due to parse error');
    }

    res.json({ filePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error('Upload / parse error:', error.message);
    res.status(500).json({ error: 'Failed to handle this PDF. Try a different file.' });
  }
});

// Export router & pdfMeta to use in chat.js
module.exports = router;
module.exports.pdfMeta = pdfMeta;
