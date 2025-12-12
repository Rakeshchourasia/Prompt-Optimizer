import Collection from '../models/Collection.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const getCollections = async (req, res, next) => {
    try {
        const workspace = req.query.workspace || req.user.currentWorkspace;

        const collections = await Collection.find({ workspace })
            .populate('prompts')
            .populate('creator', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { collections },
        });
    } catch (error) {
        next(error);
    }
};

export const getCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('prompts')
            .populate('creator', 'name email avatar');

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        res.json({
            success: true,
            data: { collection },
        });
    } catch (error) {
        next(error);
    }
};

export const createCollection = async (req, res, next) => {
    try {
        const collection = await Collection.create({
            ...req.body,
            workspace: req.user.currentWorkspace,
            creator: req.user._id,
        });

        const populated = await Collection.findById(collection._id)
            .populate('prompts')
            .populate('creator', 'name email avatar');

        res.status(201).json({
            success: true,
            data: { collection: populated },
        });
    } catch (error) {
        next(error);
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        if (collection.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        Object.assign(collection, req.body);
        await collection.save();

        const updated = await Collection.findById(collection._id)
            .populate('prompts')
            .populate('creator', 'name email avatar');

        res.json({
            success: true,
            data: { collection: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        if (collection.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        await collection.deleteOne();

        res.json({
            success: true,
            message: 'Collection deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const addPrompt = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        const { promptId } = req.body;

        if (!collection.prompts.includes(promptId)) {
            collection.prompts.push(promptId);
            await collection.save();
        }

        const updated = await Collection.findById(collection._id)
            .populate('prompts')
            .populate('creator', 'name email avatar');

        res.json({
            success: true,
            data: { collection: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const removePrompt = async (req, res, next) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection) {
            throw new AppError('Collection not found', 404);
        }

        collection.prompts = collection.prompts.filter(
            (p) => p.toString() !== req.params.promptId
        );
        await collection.save();

        const updated = await Collection.findById(collection._id)
            .populate('prompts')
            .populate('creator', 'name email avatar');

        res.json({
            success: true,
            data: { collection: updated },
        });
    } catch (error) {
        next(error);
    }
};
