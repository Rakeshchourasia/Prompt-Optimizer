import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSearch, FiStar, FiCopy } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import PromptModal from '../components/modals/PromptModal';
import styles from './PromptsPage.module.css';

export default function PromptsPage() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['prompts'],
        queryFn: async () => {
            try {
                const response = await api.get('/prompts');
                console.log('Prompts response:', response.data);
                return response.data.data.prompts;
            } catch (err) {
                console.error('Error fetching prompts:', err.response?.data || err.message);
                throw err;
            }
        },
    });

    const prompts = data || [];

    const filteredPrompts = search
        ? prompts.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase())
        )
        : prompts;

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
    };

    const handleOpenModal = (prompt = null) => {
        setSelectedPrompt(prompt);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPrompt(null);
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Prompts</h1>
                    <p>Manage your AI prompts and templates</p>
                </div>
                <button
                    className={styles.createButton}
                    onClick={() => handleOpenModal()}
                >
                    <FiPlus />
                    <span>New Prompt</span>
                </button>
            </div>

            <div className={`${styles.searchBar} glass-card`}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search prompts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <div className="spinner" style={{ width: '48px', height: '48px' }} />
                </div>
            ) : filteredPrompts.length === 0 ? (
                <div className={styles.empty}>
                    <p>No prompts found. Create your first one!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filteredPrompts.map((prompt, index) => (
                        <motion.div
                            key={prompt._id}
                            className={`${styles.promptCard} glass-card hover-glow`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleOpenModal(prompt)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.cardHeader}>
                                <h3>{prompt.title}</h3>
                                {prompt.isFavorite && (
                                    <FiStar className={styles.starIcon} fill="var(--color-accent-orange)" />
                                )}
                            </div>
                            {prompt.description && (
                                <p className={styles.description}>{prompt.description}</p>
                            )}
                            <div className={styles.content}>
                                {prompt.content.substring(0, 150)}
                                {prompt.content.length > 150 && '...'}
                            </div>
                            {prompt.tags && prompt.tags.length > 0 && (
                                <div className={styles.tags}>
                                    {prompt.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className={styles.cardFooter}>
                                <button
                                    className={styles.copyButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(prompt.content);
                                    }}
                                >
                                    <FiCopy />
                                    <span>Copy</span>
                                </button>
                                <span className={styles.usageCount}>
                                    Used {prompt.usageCount || 0} times
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <PromptModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                prompt={selectedPrompt}
            />
        </div>
    );
}
