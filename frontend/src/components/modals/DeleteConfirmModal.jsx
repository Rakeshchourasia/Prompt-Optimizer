import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './DeleteConfirmModal.module.css';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, promptTitle, isDeleting }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <motion.div
                        className={`${styles.modal} glass-card`}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <button className={styles.closeButton} onClick={onClose}>
                            <FiX />
                        </button>

                        <div className={styles.iconContainer}>
                            <div className={styles.warningIcon}>
                                <FiAlertTriangle />
                            </div>
                        </div>

                        <h2 className={styles.title}>Delete Prompt?</h2>

                        <p className={styles.message}>
                            Are you sure you want to delete <strong>"{promptTitle}"</strong>?
                        </p>

                        <p className={styles.warning}>
                            This action cannot be undone. All versions and history will be permanently deleted.
                        </p>

                        <div className={styles.actions}>
                            <button
                                className={styles.cancelButton}
                                onClick={onClose}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.deleteButton}
                                onClick={onConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    'Delete Prompt'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
