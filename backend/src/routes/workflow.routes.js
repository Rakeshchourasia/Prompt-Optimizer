import express from 'express';
import {
    getWorkflows,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    reorderSteps,
    executeWorkflow,
} from '../controllers/workflow.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWorkflows)
    .post(validate(schemas.createWorkflow), createWorkflow);

router.route('/:id')
    .get(getWorkflow)
    .put(updateWorkflow)
    .delete(deleteWorkflow);

router.patch('/:id/reorder', reorderSteps);
router.post('/:id/execute', executeWorkflow);

export default router;
