import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Workflow name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        steps: [
            {
                order: {
                    type: Number,
                    required: true,
                },
                prompt: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Prompt',
                },
                promptSnapshot: {
                    title: String,
                    content: String,
                },
                waitForUserInput: {
                    type: Boolean,
                    default: false,
                },
                notes: String,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        executionCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for workspace queries
workflowSchema.index({ workspace: 1 });
workflowSchema.index({ creator: 1 });

const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;
