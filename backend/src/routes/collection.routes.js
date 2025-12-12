import express from 'express';
import {
    getCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addPrompt,
    removePrompt,
} from '../controllers/collection.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getCollections)
    .post(validate(schemas.createCollection), createCollection);

router.route('/:id')
    .get(getCollection)
    .put(updateCollection)
    .delete(deleteCollection);

router.post('/:id/prompts', addPrompt);
router.delete('/:id/prompts/:promptId', removePrompt);

export default router;
