import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiPlay } from 'react-icons/fi';
import api from '../services/api';
import styles from './WorkflowsPage.module.css';

export default function WorkflowsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['workflows'],
        queryFn: async () => {
            const response = await api.get('/workflows');
            return response.data.data.workflows;
        },
    });

    const workflows = data || [];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Workflows</h1>
                    <p>Create and manage multi-step prompt sequences</p>
                </div>
                <button className={styles.createButton}>
                    <FiPlus />
                    <span>New Workflow</span>
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <div className="spinner" style={{ width: '48px', height: '48px' }} />
                </div>
            ) : workflows.length === 0 ? (
                <div className={styles.empty}>
                    <p>No workflows yet. Create your first automation!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {workflows.map((workflow, index) => (
                        <motion.div
                            key={workflow._id}
                            className={`${styles.workflowCard} glass-card hover-glow`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <h3>{workflow.name}</h3>
                            {workflow.description && <p>{workflow.description}</p>}
                            <div className={styles.steps}>
                                {workflow.steps?.length || 0} steps
                            </div>
                            <div className={styles.cardFooter}>
                                <button className={styles.executeButton}>
                                    <FiPlay />
                                    <span>Execute</span>
                                </button>
                                <span className={styles.execCount}>
                                    Executed {workflow.executionCount || 0}x
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
