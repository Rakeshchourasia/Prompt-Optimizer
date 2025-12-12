import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../middleware/error.middleware.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Debug logging
console.log('🔍 Checking GEMINI_API_KEY...');
console.log('API Key exists:', !!GEMINI_API_KEY);
console.log('API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);

// Initialize Gemini API
let genAI;
let model;

if (GEMINI_API_KEY) {
    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('✅ Gemini AI initialized successfully with model: gemini-2.0-flash');
    } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error.message);
    }
} else {
    console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
}

// Helper function to call Gemini API
const callGemini = async (prompt, temperature = 0.7) => {
    if (!GEMINI_API_KEY) {
        throw new AppError('Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.', 500);
    }

    try {
        const generationConfig = {
            temperature: temperature,
            maxOutputTokens: 1000,
        };

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: generationConfig,
        });
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ Gemini API error:', error);

        // Better error messages for common issues
        if (error.message?.includes('API key')) {
            throw new AppError('Invalid Gemini API key. Please check your API key at https://aistudio.google.com/app/apikey', 500);
        }
        if (error.message?.includes('quota')) {
            throw new AppError('Gemini API quota exceeded. Please check your usage limits.', 500);
        }

        throw new AppError(`Gemini API error: ${error.message || 'Unknown error'}`, 500);
    }
};




// @desc    Optimize prompt
// @route   POST /api/ai/optimize
// @access  Private
export const optimizePrompt = async (req, res, next) => {
    try {
        const { content, goal } = req.body;

        if (!content) {
            throw new AppError('Prompt content is required', 400);
        }

        const systemPrompt = goal
            ? `You are a prompt optimization expert. Optimize the following prompt for: ${goal}. Return ONLY the optimized prompt text. Do not add any introductory text, valid markdown, or explanations.`
            : 'You are a prompt optimization expert. Optimize the following prompt to make it more clear, specific, and effective. Return ONLY the optimized prompt text. Do not add any introductory text, valid markdown, or explanations.';

        const fullPrompt = `${systemPrompt}\n\nPrompt to optimize:\n${content}`;

        const optimized = await callGemini(fullPrompt, 0.7);

        const suggestions = [
            'Made the prompt more specific and detailed',
            'Improved clarity and readability',
            'Added context for better results',
        ];

        res.json({
            success: true,
            data: { optimized, suggestions },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate variations
// @route   POST /api/ai/variations
// @access  Private
export const generateVariations = async (req, res, next) => {
    try {
        const { content, count } = req.body;

        if (!content) {
            throw new AppError('Prompt content is required', 400);
        }

        const variationCount = Math.min(count || 3, 5); // Max 5 variations

        const prompt = `Generate ${variationCount} different variations of the following prompt. Each variation should maintain the core intent but use different wording and approach. Return only the variations, numbered 1-${variationCount}.\n\nPrompt to vary:\n${content}`;

        const response = await callGemini(prompt, 0.9);

        // Parse variations
        const variations = response
            .split(/\d+\.\s+/)
            .filter((v) => v.trim())
            .map((v) => v.trim());

        res.json({
            success: true,
            data: { variations },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Summarize prompt
// @route   POST /api/ai/summarize
// @access  Private
export const summarizePrompt = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            throw new AppError('Prompt content is required', 400);
        }

        const prompt = `Summarize the following prompt in 1-2 sentences, capturing the main intent.\n\nPrompt to summarize:\n${content}`;

        const summary = await callGemini(prompt, 0.5);

        res.json({
            success: true,
            data: { summary },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Expand prompt
// @route   POST /api/ai/expand
// @access  Private
export const expandPrompt = async (req, res, next) => {
    try {
        const { content, targetLength } = req.body;

        if (!content) {
            throw new AppError('Prompt content is required', 400);
        }

        const lengthGuide = targetLength
            ? `Expand it to approximately ${targetLength} words.`
            : 'Make it more detailed and comprehensive.';

        const prompt = `Expand the following prompt with more details, context, and clarity. ${lengthGuide}\n\nPrompt to expand:\n${content}`;

        const expanded = await callGemini(prompt, 0.7);

        res.json({
            success: true,
            data: { expanded },
        });
    } catch (error) {
        next(error);
    }
};
