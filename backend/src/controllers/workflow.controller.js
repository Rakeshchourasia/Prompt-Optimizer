import Workflow from '../models/Workflow.model.js';
import Prompt from '../models/Prompt.model.js';
import { AppError } from '../middleware/error.middleware.js';

export const getWorkflows = async (req, res, next) => {
    try {
        const workspace = req.query.workspace || req.user.currentWorkspace;

        const workflows = await Workflow.find({ workspace })
            .populate('steps.prompt')
            .populate('creator', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { workflows },
        });
    } catch (error) {
        next(error);
    }
};

export const getWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id)
            .populate('steps.prompt')
            .populate('creator', 'name email avatar');

        if (!workflow) {
            throw new AppError('Workflow not found', 404);
        }

        res.json({
            success: true,
            data: { workflow },
        });
    } catch (error) {
        next(error);
    }
};

export const createWorkflow = async (req, res, next) => {
    try {
        const { name, description, steps } = req.body;

        // Create snapshots for steps
        const stepsWithSnapshots = [];
        for (const step of steps || []) {
            if (step.prompt) {
                const prompt = await Prompt.findById(step.prompt);
                if (prompt) {
                    stepsWithSnapshots.push({
                        ...step,
                        promptSnapshot: {
                            title: prompt.title,
                            content: prompt.content,
                        },
                    });
                }
            } else {
                stepsWithSnapshots.push(step);
            }
        }

        const workflow = await Workflow.create({
            name,
            description,
            steps: stepsWithSnapshots,
            workspace: req.user.currentWorkspace,
            creator: req.user._id,
        });

        const populated = await Workflow.findById(workflow._id)
            .populate('steps.prompt')
            .populate('creator', 'name email avatar');

        res.status(201).json({
            success: true,
            data: { workflow: populated },
        });
    } catch (error) {
        next(error);
    }
};

export const updateWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            throw new AppError('Workflow not found', 404);
        }

        if (workflow.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        // Update snapshots if steps are provided
        if (req.body.steps) {
            const stepsWithSnapshots = [];
            for (const step of req.body.steps) {
                if (step.prompt) {
                    const prompt = await Prompt.findById(step.prompt);
                    if (prompt) {
                        stepsWithSnapshots.push({
                            ...step,
                            promptSnapshot: {
                                title: prompt.title,
                                content: prompt.content,
                            },
                        });
                    }
                } else {
                    stepsWithSnapshots.push(step);
                }
            }
            req.body.steps = stepsWithSnapshots;
        }

        Object.assign(workflow, req.body);
        await workflow.save();

        const updated = await Workflow.findById(workflow._id)
            .populate('steps.prompt')
            .populate('creator', 'name email avatar');

        res.json({
            success: true,
            data: { workflow: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            throw new AppError('Workflow not found', 404);
        }

        if (workflow.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        await workflow.deleteOne();

        res.json({
            success: true,
            message: 'Workflow deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const reorderSteps = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id);

        if (!workflow) {
            throw new AppError('Workflow not found', 404);
        }

        if (workflow.creator.toString() !== req.user._id.toString()) {
            throw new AppError('Not authorized', 403);
        }

        // Reorder steps based on provided array
        const { steps } = req.body;
        workflow.steps = steps;
        await workflow.save();

        const updated = await Workflow.findById(workflow._id)
            .populate('steps.prompt')
            .populate('creator', 'name email avatar');

        res.json({
            success: true,
            data: { workflow: updated },
        });
    } catch (error) {
        next(error);
    }
};

export const executeWorkflow = async (req, res, next) => {
    try {
        const workflow = await Workflow.findById(req.params.id)
            .populate('steps.prompt');

        if (!workflow) {
            throw new AppError('Workflow not found', 404);
        }

        // Sort steps by order
        const sortedSteps = workflow.steps.sort((a, b) => a.order - b.order);

        // Build execution result
        const result = {
            workflowName: workflow.name,
            steps: sortedSteps.map((step, index) => ({
                stepNumber: index + 1,
                order: step.order,
                title: step.promptSnapshot?.title || step.prompt?.title,
                content: step.promptSnapshot?.content || step.prompt?.content,
                notes: step.notes,
                waitForUserInput: step.waitForUserInput,
            })),
        };

        // Increment execution count
        workflow.executionCount += 1;
        await workflow.save();

        res.json({
            success: true,
            data: { result },
        });
    } catch (error) {
        next(error);
    }
};
