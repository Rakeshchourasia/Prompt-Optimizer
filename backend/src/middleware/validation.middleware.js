import Joi from 'joi';

export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        next();
    };
};

// Validation schemas
export const schemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).required(),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    createPrompt: Joi.object({
        title: Joi.string().min(1).max(200).required(),
        content: Joi.string().min(1).required(),
        description: Joi.string().max(500).allow(''),
        category: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()),
        variables: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                description: Joi.string().allow(''),
                defaultValue: Joi.string().allow(''),
            })
        ),
    }),

    updatePrompt: Joi.object({
        title: Joi.string().min(1).max(200),
        content: Joi.string().min(1),
        description: Joi.string().max(500).allow(''),
        category: Joi.string().allow(''),
        tags: Joi.array().items(Joi.string()),
        variables: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                description: Joi.string().allow(''),
                defaultValue: Joi.string().allow(''),
            })
        ),
    }),

    createCollection: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().max(500).allow(''),
        color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
        icon: Joi.string().max(10),
    }),

    createWorkflow: Joi.object({
        name: Joi.string().min(1).max(100).required(),
        description: Joi.string().max(500).allow(''),
        steps: Joi.array().items(
            Joi.object({
                order: Joi.number().required(),
                prompt: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
                notes: Joi.string().allow(''),
                waitForUserInput: Joi.boolean(),
            })
        ),
    }),

    createWorkspace: Joi.object({
        name: Joi.string().min(1).max(100).required(),
    }),
};
