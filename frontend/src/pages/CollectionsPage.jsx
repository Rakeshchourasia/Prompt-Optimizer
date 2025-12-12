import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiFolderPlus } from 'react-icons/fi';
import api from '../services/api';
import styles from './CollectionsPage.module.css';

export default function CollectionsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: async () => {
            const response = await api.get('/collections');
            return response.data.data.collections;
        },
    });

    const collections = data || [];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Collections</h1>
                    <p>Organize your prompts into collections</p>
                </div>
                <button className={styles.createButton}>
                    <FiPlus />
                    <span>New Collection</span>
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <div className="spinner" style={{ width: '48px', height: '48px' }} />
                </div>
            ) : collections.length === 0 ? (
                <div className={styles.empty}>
                    <FiFolderPlus className={styles.emptyIcon} />
                    <p>No collections yet. Create your first one!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection._id}
                            className={`${styles.collectionCard} glass-card hover-glow`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className={styles.cardIcon} style={{ background: collection.color }}>
                                {collection.icon || '📁'}
                            </div>
                            <h3>{collection.name}</h3>
                            {collection.description && <p>{collection.description}</p>}
                            <div className={styles.promptCount}>
                                {collection.prompts?.length || 0} prompts
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
