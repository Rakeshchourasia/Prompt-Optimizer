import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import ShareLink from '../models/ShareLink.model.js';
import Prompt from '../models/Prompt.model.js';
import Collection from '../models/Collection.model.js';
import Workflow from '../models/Workflow.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const createShareLink = async (req, res, next) => {
    try {
        const { resourceType, resourceId, isPublic, password, expiresAt } = req.body;

        // Verify resource exists
        let resource;
        if (resourceType === 'prompt') {
            resource = await Prompt.findById(resourceId);
        } else if (resourceType === 'collection') {
            resource = await Collection.findById(resourceId);
        } else if (resourceType === 'workflow') {
            resource = await Workflow.findById(resourceId);
        }

        if (!resource) {
            throw new AppError('Resource not found', 404);
        }

        // Generate unique share token
        const shareToken = nanoid(16);

        // Hash password if provided
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const shareLink = await ShareLink.create({
            resourceType,
            resourceId,
            shareToken,
            isPublic: isPublic || false,
            password: hashedPassword,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdBy: req.user._id,
        });

        const url = `${process.env.CORS_ORIGIN}/shared/${shareToken}`;

        res.status(201).json({
            success: true,
            data: { shareLink, url },
        });
    } catch (error) {
        next(error);
    }
};

export const getSharedResource = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.query;

        const shareLink = await ShareLink.findOne({ shareToken: token }).select('+password');

        if (!shareLink) {
            throw new AppError('Share link not found', 404);
        }

        // Check expiration
        if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
            throw new AppError('Share link has expired', 410);
        }

        // Check password
        if (shareLink.password) {
            if (!password) {
                return res.status(401).json({
                    success: false,
                    message: 'Password required',
                    requiresPassword: true,
                });
            }

            const isMatch = await bcrypt.compare(password, shareLink.password);
            if (!isMatch) {
                throw new AppError('Incorrect password', 401);
            }
        }

        // Get resource
        let resource;
        if (shareLink.resourceType === 'prompt') {
            resource = await Prompt.findById(shareLink.resourceId)
                .populate('creator', 'name email avatar');
        } else if (shareLink.resourceType === 'collection') {
            resource = await Collection.findById(shareLink.resourceId)
                .populate('prompts')
                .populate('creator', 'name email avatar');
        } else if (shareLink.resourceType === 'workflow') {
            resource = await Workflow.findById(shareLink.resourceId)
                .populate('steps.prompt')
                .populate('creator', 'name email avatar');
        }

        if (!resource) {
            throw new AppError('Resource no longer exists', 404);
        }

        // Increment view count
        shareLink.viewCount += 1;
        await shareLink.save();

        res.json({
            success: true,
            data: {
                resource,
                type: shareLink.resourceType,
                viewCount: shareLink.viewCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const revokeShareLink = async (req, res, next) => {
    try {
        const shareLink = await ShareLink.findOne({ shareToken: req.params.token });

        if (!shareLink) {
            throw new AppError('Share link not found', 404);
        }

        if (shareLink.createdBy.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        await shareLink.deleteOne();

        res.json({
            success: true,
            message: 'Share link revoked successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const importSharedResource = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { targetWorkspace } = req.body;

        const shareLink = await ShareLink.findOne({ shareToken: token });

        if (!shareLink) {
            throw new AppError('Share link not found', 404);
        }

        let newResource;

        if (shareLink.resourceType === 'prompt') {
            const originalPrompt = await Prompt.findById(shareLink.resourceId);
            if (!originalPrompt) {
                throw new AppError('Original prompt not found', 404);
            }

            // Clone to user's workspace
            newResource = await Prompt.create({
                workspace: targetWorkspace || req.user.currentWorkspace,
                title: `${originalPrompt.title} (Imported)`,
                content: originalPrompt.content,
                description: originalPrompt.description,
                category: originalPrompt.category,
                tags: originalPrompt.tags,
                variables: originalPrompt.variables,
                creator: req.user._id,
            });
        } else if (shareLink.resourceType === 'collection') {
            const originalCollection = await Collection.findById(shareLink.resourceId)
                .populate('prompts');
            if (!originalCollection) {
                throw new AppError('Original collection not found', 404);
            }

            // Clone collection
            newResource = await Collection.create({
                workspace: targetWorkspace || req.user.currentWorkspace,
                name: `${originalCollection.name} (Imported)`,
                description: originalCollection.description,
                color: originalCollection.color,
                icon: originalCollection.icon,
                creator: req.user._id,
            });
        } else if (shareLink.resourceType === 'workflow') {
            const originalWorkflow = await Workflow.findById(shareLink.resourceId);
            if (!originalWorkflow) {
                throw new AppError('Original workflow not found', 404);
            }

            // Clone workflow
            newResource = await Workflow.create({
                workspace: targetWorkspace || req.user.currentWorkspace,
                name: `${originalWorkflow.name} (Imported)`,
                description: originalWorkflow.description,
                steps: originalWorkflow.steps,
                creator: req.user._id,
            });
        }

        res.status(201).json({
            success: true,
            data: { resource: newResource },
        });
    } catch (error) {
        next(error);
    }
};
