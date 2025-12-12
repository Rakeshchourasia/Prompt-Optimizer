import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiFolder, FiGitBranch } from 'react-icons/fi';
import styles from './Sidebar.module.css';

const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/prompts', icon: FiFileText, label: 'Prompts' },
    { path: '/collections', icon: FiFolder, label: 'Collections' },
    { path: '/workflows', icon: FiGitBranch, label: 'Workflows' },
];

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                    >
                        <item.icon className={styles.icon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
