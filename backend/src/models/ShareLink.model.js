import mongoose from 'mongoose';

const shareLinkSchema = new mongoose.Schema(
    {
        resourceType: {
            type: String,
            enum: ['prompt', 'collection', 'workflow'],
            required: true,
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        shareToken: {
            type: String,
            unique: true,
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            select: false,
        },
        expiresAt: {
            type: Date,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
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

// Index for resource lookup
shareLinkSchema.index({ resourceId: 1, resourceType: 1 });

const ShareLink = mongoose.model('ShareLink', shareLinkSchema);

export default ShareLink;
