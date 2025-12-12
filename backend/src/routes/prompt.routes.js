import express from 'express';
import {
    getPrompts,
    getPrompt,
    createPrompt,
    updatePrompt,
    deletePrompt,
    clonePrompt,
    toggleFavorite,
    getVersions,
    rollbackToVersion,
    executePrompt,
} from '../controllers/prompt.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
    .get(getPrompts)
    .post(validate(schemas.createPrompt), createPrompt);

router.route('/:id')
    .get(getPrompt)
    .put(validate(schemas.updatePrompt), updatePrompt)
    .delete(deletePrompt);

router.post('/:id/clone', clonePrompt);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/execute', executePrompt);

router.get('/:id/versions', getVersions);
router.post('/:id/rollback/:versionId', rollbackToVersion);

export default router;
