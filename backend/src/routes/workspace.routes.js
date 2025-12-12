import express from 'express';
import {
    getWorkspaces,
    getWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
    removeMember,
    updateMemberRole,
} from '../controllers/workspace.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getWorkspaces)
    .post(validate(schemas.createWorkspace), createWorkspace);

router.route('/:id')
    .get(getWorkspace)
    .put(updateWorkspace)
    .delete(deleteWorkspace);

router.post('/:id/members', inviteMember);
router.delete('/:id/members/:userId', removeMember);
router.patch('/:id/members/:userId/role', updateMemberRole);

export default router;
