import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: false,
        },
        title: {
            type: String,
            required: [true, 'Prompt title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Prompt content is required'],
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            default: '',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        variables: [
            {
                name: {
                    type: String,
                    required: true,
                },
                description: String,
                defaultValue: String,
            },
        ],
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        currentVersion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PromptVersion',
        },
        usageCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
promptSchema.index({ workspace: 1, creator: 1 });
promptSchema.index({ tags: 1 });
promptSchema.index({ category: 1 });
promptSchema.index({ createdAt: -1 });
promptSchema.index({ title: 'text', content: 'text' });

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;
