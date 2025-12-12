import express from 'express';
import {
    createShareLink,
    getSharedResource,
    revokeShareLink,
    importSharedResource,
} from '../controllers/share.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createShareLink);
router.get('/:token', getSharedResource); // Public
router.delete('/:token', protect, revokeShareLink);
router.post('/:token/import', protect, importSharedResource);

export default router;
