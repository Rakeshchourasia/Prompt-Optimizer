import express from 'express';
import {
    optimizePrompt,
    generateVariations,
    summarizePrompt,
    expandPrompt,
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Test endpoint to check API key status (public for debugging)
router.get('/status', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    res.json({
        configured: !!apiKey,
        keyLength: apiKey ? apiKey.length : 0,
        keyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
    });
});

router.use(protect);
router.use(aiLimiter); // Rate limit AI endpoints

router.post('/optimize', optimizePrompt);
router.post('/variations', generateVariations);
router.post('/summarize', summarizePrompt);
router.post('/expand', expandPrompt);

export default router;
