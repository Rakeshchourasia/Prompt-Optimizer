import Workspace from '../models/Workspace.model.js';
import User from '../models/User.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const getWorkspaces = async (req, res, next) => {
    try {
        const workspaces = await Workspace.find({
            $or: [
                { owner: req.user._id },
                { 'members.user': req.user._id },
            ],
        }).populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: { workspaces },
        });
    } catch (error) {
        next(error);
    }
};

export const getWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        res.json({
            success: true,
            data: { workspace },
        });
    } catch (error) {
        next(error);
    }
};

export const createWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.create({
            name: req.body.name,
            owner: req.user._id,
            members: [{ user: req.user._id, role: 'owner' }],
            settings: req.body.settings || {},
        });

        const populated = await Workspace.findById(workspace._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.status(201).json({
            success: true,
            data: { workspace: populated },
        });
    } catch (error) {
        next(error);
    }
};

export const updateWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        if (workspace.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        Object.assign(workspace, req.body);
        await workspace.save();

        const updated = await Workspace.findById(workspace._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: { workspace: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWorkspace = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        if (workspace.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        await workspace.deleteOne();

        res.json({
            success: true,
            message: 'Workspace deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const inviteMember = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        if (workspace.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        const { email, role } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new AppError('User not found with this email', 404);
        }

        // Check if already a member
        const isMember = workspace.members.some(
            (m) => m.user.toString() === user._id.toString()
        );

        if (isMember) {
            throw new AppError('User is already a member', 400);
        }

        workspace.members.push({ user: user._id, role: role || 'member' });
        await workspace.save();

        const updated = await Workspace.findById(workspace._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: { workspace: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const removeMember = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        if (workspace.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        workspace.members = workspace.members.filter(
            (m) => m.user.toString() !== req.params.userId
        );
        await workspace.save();

        const updated = await Workspace.findById(workspace._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: { workspace: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const updateMemberRole = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);

        if (!workspace) {
            throw new AppError('Workspace not found', 404);
        }

        if (workspace.owner.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        const member = workspace.members.find(
            (m) => m.user.toString() === req.params.userId
        );

        if (!member) {
            throw new AppError('Member not found', 404);
        }

        member.role = req.body.role;
        await workspace.save();

        const updated = await Workspace.findById(workspace._id)
            .populate('owner', 'name email avatar')
            .populate('members.user', 'name email avatar');

        res.json({
            success: true,
            data: { workspace: updated },
        });
    } catch (error) {
        next(error);
    }
};
