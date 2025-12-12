import mongoose from 'mongoose';

const promptVersionSchema = new mongoose.Schema(
    {
        prompt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prompt',
            required: true,
        },
        versionNumber: {
            type: Number,
            required: true,
        },
        title: String,
        content: {
            type: String,
            required: true,
        },
        description: String,
        tags: [String],
        variables: [
            {
                name: String,
                description: String,
                defaultValue: String,
            },
        ],
        changeNote: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for quick version retrieval
promptVersionSchema.index({ prompt: 1, versionNumber: -1 });

const PromptVersion = mongoose.model('PromptVersion', promptVersionSchema);

export default PromptVersion;
