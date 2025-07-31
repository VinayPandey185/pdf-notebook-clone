const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Removed real OpenAI call to avoid quota
// const OpenAI = require('openai');
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// in-memory vector store: [{ id, text, embedding }]
let store = [];

// chunk text into ~1500 char parts & add dummy embeddings
async function indexPDFText(textFile) {
  const text = fs.readFileSync(textFile, 'utf-8');

  // Split into chunks
  const chunks = text.match(/.{1,1500}/g) || [];
  console.log(`Splitting text into ${chunks.length} chunks`);

  for (const chunk of chunks) {
    // Use dummy embedding: array of zeros (size 1536)
    store.push({
      id: uuidv4(),
      text: chunk,
      embedding: Array(1536).fill(0)
    });
  }

  console.log(`Indexed ${chunks.length} chunks (dummy embeddings)`);
}

// get store to do search later
function getStore() {
  return store;
}

module.exports = { indexPDFText, getStore };
