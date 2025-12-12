import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Collection name is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        prompts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Prompt',
            },
        ],
        color: {
            type: String,
            default: '#6366f1',
        },
        icon: {
            type: String,
            default: '📁',
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
    },
    {
        timestamps: true,
    }
);

// Index for workspace queries
collectionSchema.index({ workspace: 1 });
collectionSchema.index({ creator: 1 });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
