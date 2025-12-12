import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiFolder, FiGitBranch, FiStar } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const [promptsRes, collectionsRes, workflowsRes] = await Promise.all([
                api.get('/prompts'),
                api.get('/collections'),
                api.get('/workflows'),
            ]);

            return {
                prompts: promptsRes.data.data.prompts.length,
                collections: collectionsRes.data.data.collections.length,
                workflows: workflowsRes.data.data.workflows.length,
                favorites: promptsRes.data.data.prompts.filter(p => p.isFavorite).length,
            };
        },
    });

    const cards = [
        { icon: FiFileText, label: 'Total Prompts', value: stats?.prompts || 0, color: 'var(--color-primary-500)' },
        { icon: FiFolder, label: 'Collections', value: stats?.collections || 0, color: 'var(--color-accent-cyan)' },
        { icon: FiGitBranch, label: 'Workflows', value: stats?.workflows || 0, color: 'var(--color-accent-pink)' },
        { icon: FiStar, label: 'Favorites', value: stats?.favorites || 0, color: 'var(--color-accent-orange)' },
    ];

    return (
        <div className={styles.dashboard}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>Dashboard</h1>
                <p>Welcome to your prompt management workspace</p>
            </motion.div>

            <div className={styles.statsGrid}>
                {cards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        className={`${styles.statCard} glass-card hover-glow`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.statIcon} style={{ background: card.color }}>
                            <card.icon />
                        </div>
                        <div className={styles.statContent}>
                            <h3>{isLoading ? '...' : card.value}</h3>
                            <p>{card.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className={`${styles.quickActions} glass-card`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h2>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <button className={styles.actionButton}>
                        <FiFileText />
                        <span>New Prompt</span>
                    </button>
                    <button className={styles.actionButton}>
                        <FiFolder />
                        <span>New Collection</span>
                    </button>
                    <button className={styles.actionButton}>
                        <FiGitBranch />
                        <span>New Workflow</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
