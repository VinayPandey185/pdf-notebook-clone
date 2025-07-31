const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { getStore } = require('../services/vectorStore');
const { pdfMeta } = require('./upload'); // get numPages

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let currentPage = 1;

// helper: cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0, ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    ma += a[i] * a[i];
    mb += b[i] * b[i];
  }
  return dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

// POST /api/chat
router.post('/', async (req, res) => {
  const { question } = req.body;
  console.log('✅ User asked:', question);

  const cleaned = question.trim().toLowerCase();

  // ✅ move to next page if user types "next"
  if (cleaned === "next") {
    if (currentPage < pdfMeta.numPages) currentPage++;
  }
  // else: keep current page (don’t reset to 1)

  try {
    // Step 1: get embedding for question
    const embedRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question
    });
    const questionEmbedding = embedRes.data[0].embedding;

    // Step 2: find top chunk
    const store = getStore();
    console.log('✅ Store chunks:', store.length);

    const similarities = store.map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(questionEmbedding, chunk.embedding)
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);
    const topChunk = similarities[0] ? similarities[0].text : '';

    // Step 3: ask OpenAI using top chunk as context
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // or 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: 'You answer based on the following context from the PDF.' },
        { role: 'user', content: `Context:\n${topChunk}\n\nQuestion: ${question}` }
      ],
    });

    const answer = completion.choices[0].message.content;

    res.json({
      answer,
      page: currentPage
    });

  } catch (error) {
    console.error('❌ OpenAI error:', error);
    // fallback dummy answer if AI fails
    res.json({ answer: "Dummy answer (AI failed or quota error).", page: currentPage });
  }
});

module.exports = router;
