import React from 'react';
import { FiLogOut, FiUser, FiBriefcase } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>⚡</div>
                    <span className={styles.logoText}>Prompt Manager</span>
                </div>

                <div className={styles.navRight}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            <FiUser />
                        </div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.name}</span>
                            <span className={styles.userEmail}>{user?.email}</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className={styles.logoutButton}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
