import Prompt from '../models/Prompt.model.js';
import PromptVersion from '../models/PromptVersion.model.js';
import { AppError } from '../middleware/error.middleware.js';

// @desc    Get all prompts
// @route   GET /api/prompts
// @access  Private
export const getPrompts = async (req, res, next) => {
    try {
        console.log('GET /api/prompts - User:', req.user?._id, 'Workspace:', req.user?.currentWorkspace);
        const { workspace, category, tags, search, favorite } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter - handle null workspace gracefully
        const filter = {};

        if (workspace) {
            filter.workspace = workspace;
        } else if (req.user.currentWorkspace) {
            filter.workspace = req.user.currentWorkspace;
        } else {
            // If no workspace set, show prompts created by user
            filter.creator = req.user._id;
        }

        if (category) filter.category = category;
        if (tags) filter.tags = { $in: tags.split(',') };
        if (favorite === 'true') filter.isFavorite = true;
        if (search) {
            filter.$text = { $search: search };
        }

        // Get prompts
        const prompts = await Prompt.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('creator', 'name email avatar')
            .lean();

        const total = await Prompt.countDocuments(filter);

        res.json({
            success: true,
            data: {
                prompts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single prompt
// @route   GET /api/prompts/:id
// @access  Private
export const getPrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id)
            .populate('creator', 'name email avatar')
            .populate('currentVersion');

        if (!prompt) {
            throw new AppError('Prompt not found', 404);
        }

        res.json({
            success: true,
            data: { prompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create prompt
// @route   POST /api/prompts
// @access  Private
export const createPrompt = async (req, res, next) => {
    try {
        const promptData = {
            ...req.body,
            workspace: req.user.currentWorkspace || null,
            creator: req.user._id,
        };

        const prompt = await Prompt.create(promptData);

        // Create initial version
        const version = await PromptVersion.create({
            prompt: prompt._id,
            versionNumber: 1,
            title: prompt.title,
            content: prompt.content,
            description: prompt.description,
            tags: prompt.tags,
            variables: prompt.variables,
            changeNote: 'Initial version',
            createdBy: req.user._id,
        });

        prompt.currentVersion = version._id;
        await prompt.save();

        const populatedPrompt = await Prompt.findById(prompt._id)
            .populate('creator', 'name email avatar')
            .populate('currentVersion');

        res.status(201).json({
            success: true,
            data: { prompt: populatedPrompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update prompt
// @route   PUT /api/prompts/:id
// @access  Private
export const updatePrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);

        if (!prompt) {
            throw new AppError('Prompt not found', 404);
        }

        // Check ownership or workspace membership
        if (prompt.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized to update this prompt', 403);
        }

        // Get current version number
        const lastVersion = await PromptVersion.findOne({ prompt: prompt._id })
            .sort({ versionNumber: -1 });

        const newVersionNumber = (lastVersion?.versionNumber || 0) + 1;

        // Create new version
        const version = await PromptVersion.create({
            prompt: prompt._id,
            versionNumber: newVersionNumber,
            title: req.body.title || prompt.title,
            content: req.body.content || prompt.content,
            description: req.body.description || prompt.description,
            tags: req.body.tags || prompt.tags,
            variables: req.body.variables || prompt.variables,
            changeNote: req.body.changeNote || `Update v${newVersionNumber}`,
            createdBy: req.user._id,
        });

        // Update prompt
        Object.assign(prompt, req.body);
        prompt.currentVersion = version._id;
        await prompt.save();

        const updatedPrompt = await Prompt.findById(prompt._id)
            .populate('creator', 'name email avatar')
            .populate('currentVersion');

        res.json({
            success: true,
            data: { prompt: updatedPrompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete prompt
// @route   DELETE /api/prompts/:id
// @access  Private
export const deletePrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);

        if (!prompt) {
            throw new AppError('Prompt not found', 404);
        }

        if (prompt.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized to delete this prompt', 403);
        }

        // Delete all versions
        await PromptVersion.deleteMany({ prompt: prompt._id });

        // Delete prompt
        await prompt.deleteOne();

        res.json({
            success: true,
            message: 'Prompt deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clone prompt
// @route   POST /api/prompts/:id/clone
// @access  Private
export const clonePrompt = async (req, res, next) => {
    try {
        const originalPrompt = await Prompt.findById(req.params.id);

        if (!originalPrompt) {
            throw new AppError('Prompt not found', 404);
        }

        const clonedPrompt = await Prompt.create({
            workspace: req.user.currentWorkspace,
            title: req.body.title || `${originalPrompt.title} (Copy)`,
            content: originalPrompt.content,
            description: originalPrompt.description,
            category: originalPrompt.category,
            tags: originalPrompt.tags,
            variables: originalPrompt.variables,
            creator: req.user._id,
        });

        // Create initial version for cloned prompt
        const version = await PromptVersion.create({
            prompt: clonedPrompt._id,
            versionNumber: 1,
            title: clonedPrompt.title,
            content: clonedPrompt.content,
            description: clonedPrompt.description,
            tags: clonedPrompt.tags,
            variables: clonedPrompt.variables,
            changeNote: 'Cloned from another prompt',
            createdBy: req.user._id,
        });

        clonedPrompt.currentVersion = version._id;
        await clonedPrompt.save();

        const populatedPrompt = await Prompt.findById(clonedPrompt._id)
            .populate('creator', 'name email avatar')
            .populate('currentVersion');

        res.status(201).json({
            success: true,
            data: { prompt: populatedPrompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle favorite
// @route   POST /api/prompts/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);

        if (!prompt) {
            throw new AppError('Prompt not found', 404);
        }

        prompt.isFavorite = !prompt.isFavorite;
        await prompt.save();

        res.json({
            success: true,
            data: { prompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get versions
// @route   GET /api/prompts/:id/versions
// @access  Private
export const getVersions = async (req, res, next) => {
    try {
        const versions = await PromptVersion.find({ prompt: req.params.id })
            .sort({ versionNumber: -1 })
            .populate('createdBy', 'name email avatar');

        res.json({
            success: true,
            data: { versions },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Rollback to version
// @route   POST /api/prompts/:id/rollback/:versionId
// @access  Private
export const rollbackToVersion = async (req, res, next) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        const version = await PromptVersion.findById(req.params.versionId);

        if (!prompt || !version) {
            throw new AppError('Prompt or version not found', 404);
        }

        if (prompt.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        // Restore from version
        prompt.title = version.title;
        prompt.content = version.content;
        prompt.description = version.description;
        prompt.tags = version.tags;
        prompt.variables = version.variables;

        // Create rollback version
        const lastVersion = await PromptVersion.findOne({ prompt: prompt._id })
            .sort({ versionNumber: -1 });

        const newVersion = await PromptVersion.create({
            prompt: prompt._id,
            versionNumber: (lastVersion?.versionNumber || 0) + 1,
            title: version.title,
            content: version.content,
            description: version.description,
            tags: version.tags,
            variables: version.variables,
            changeNote: `Rolled back to version ${version.versionNumber}`,
            createdBy: req.user._id,
        });

        prompt.currentVersion = newVersion._id;
        await prompt.save();

        const updatedPrompt = await Prompt.findById(prompt._id)
            .populate('creator', 'name email avatar')
            .populate('currentVersion');

        res.json({
            success: true,
            data: { prompt: updatedPrompt },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Increment usage count
// @route   POST /api/prompts/:id/execute
// @access  Private
export const executePrompt = async (req, res, next) => {
    try {
        const prompt = await Prompt.findByIdAndUpdate(
            req.params.id,
            { $inc: { usageCount: 1 } },
            { new: true }
        );

        if (!prompt) {
            throw new AppError('Prompt not found', 404);
        }

        res.json({
            success: true,
            data: { prompt },
        });
    } catch (error) {
        next(error);
    }
};
