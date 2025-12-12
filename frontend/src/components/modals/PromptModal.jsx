import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZap, FiTrash2, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';
import styles from './PromptModal.module.css';

export default function PromptModal({ isOpen, onClose, prompt = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: '',
    });

    const [optimizedPrompt, setOptimizedPrompt] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const queryClient = useQueryClient();

    // Reset form when modal opens/closes or prompt changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: prompt?.title || '',
                description: prompt?.description || '',
                content: prompt?.content || '',
                category: prompt?.category || '',
                tags: prompt?.tags?.join(', ') || '',
            });
            setOptimizedPrompt(null);
        } else {
            // Reset form when modal closes
            setFormData({
                title: '',
                description: '',
                content: '',
                category: '',
                tags: '',
            });
            setOptimizedPrompt(null);
        }
    }, [isOpen, prompt]);

    const createMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/prompts', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Prompt created successfully!');
            queryClient.invalidateQueries(['prompts']);
            queryClient.invalidateQueries(['dashboard-stats']);
            setFormData({
                title: '',
                description: '',
                content: '',
                category: '',
                tags: '',
            });
            onClose();
        },
        onError: (error) => {
            console.error('Create prompt error:', error);
            toast.error(error.response?.data?.message || 'Failed to create prompt');
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.put(`/prompts/${prompt._id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Prompt updated successfully!');
            queryClient.invalidateQueries(['prompts']);
            queryClient.invalidateQueries(['dashboard-stats']);
            onClose();
        },
        onError: (error) => {
            console.error('Update prompt error:', error);
            toast.error(error.response?.data?.message || 'Failed to update prompt');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const response = await api.delete(`/prompts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Prompt deleted successfully!');
            queryClient.invalidateQueries(['prompts']);
            queryClient.invalidateQueries(['dashboard-stats']);
            setShowDeleteModal(false);
            onClose();
        },
        onError: (error) => {
            console.error('Delete prompt error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete prompt');
        },
    });

    const handleOptimize = async () => {
        if (!formData.content.trim()) {
            toast.error('Please enter some content to optimize');
            return;
        }

        setIsOptimizing(true);
        try {
            const response = await api.post('/ai/optimize', {
                content: formData.content,
            });

            setOptimizedPrompt(response.data.data);
            toast.success('Prompt optimized successfully!');
        } catch (error) {
            console.error('Optimization error:', error);
            toast.error(error.response?.data?.message || 'Failed to optimize prompt');
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleApplyOptimized = () => {
        if (optimizedPrompt) {
            setFormData({ ...formData, content: optimizedPrompt.optimized });
            setOptimizedPrompt(null);
            toast.success('Optimized content applied!');
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteMutation.mutate(prompt._id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (createMutation.isPending || updateMutation.isPending) {
            return;
        }

        const submitData = {
            ...formData,
            tags: formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag),
        };

        if (prompt) {
            updateMutation.mutate(submitData);
        } else {
            createMutation.mutate(submitData);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
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
                            <div className={styles.header}>
                                <h2>{prompt ? 'Edit Prompt' : 'Create New Prompt'}</h2>
                                <button className={styles.closeButton} onClick={onClose}>
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter prompt title"
                                        required
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Brief description of this prompt"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="content">Content *</label>
                                    <textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        placeholder="Enter your prompt content here..."
                                        required
                                        rows={8}
                                        className={styles.textarea}
                                    />
                                </div>

                                {/* AI Enhancement Section */}
                                <div className={styles.aiSection}>
                                    <button
                                        type="button"
                                        onClick={handleOptimize}
                                        disabled={isOptimizing || !formData.content.trim()}
                                        className={styles.optimizeButton}
                                    >
                                        {isOptimizing ? (
                                            <>
                                                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                                <span>Optimizing with AI...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiZap />
                                                <span>Optimize with AI</span>
                                            </>
                                        )}
                                    </button>

                                    {optimizedPrompt && (
                                        <motion.div
                                            className={`${styles.optimizedPreview} glass-card`}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <div className={styles.previewHeader}>
                                                <div className={styles.aiLabel}>
                                                    <FiZap />
                                                    <span>AI Optimized Version</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setOptimizedPrompt(null)}
                                                    className={styles.dismissButton}
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                            <div className={styles.previewContent}>
                                                {optimizedPrompt.optimized}
                                            </div>
                                            {optimizedPrompt.suggestions && optimizedPrompt.suggestions.length > 0 && (
                                                <div className={styles.suggestions}>
                                                    <p className={styles.suggestionsTitle}>Improvements:</p>
                                                    <ul>
                                                        {optimizedPrompt.suggestions.map((suggestion, idx) => (
                                                            <li key={idx}>
                                                                <FiCheck />
                                                                <span>{suggestion}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleApplyOptimized}
                                                className={styles.applyButton}
                                            >
                                                <FiCheck />
                                                <span>Apply This Version</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="category">Category</label>
                                        <input
                                            type="text"
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            placeholder="e.g., Writing, Coding"
                                            className={styles.input}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="tags">Tags</label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            placeholder="tag1, tag2, tag3"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <div className={styles.leftActions}>
                                        {prompt && (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className={styles.deleteButton}
                                            >
                                                <FiTrash2 />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className={styles.rightActions}>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.submitButton}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                        >
                                            {createMutation.isPending || updateMutation.isPending
                                                ? 'Saving...'
                                                : prompt
                                                    ? 'Update Prompt'
                                                    : 'Create Prompt'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                promptTitle={prompt?.title}
                isDeleting={deleteMutation.isPending}
            />
        </>
    );
}
