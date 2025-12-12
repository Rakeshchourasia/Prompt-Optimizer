import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
    return (
        <div className={styles.layout}>
            <Navbar />
            <div className={styles.container}>
                <Sidebar />
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
