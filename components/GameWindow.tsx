import React, { ReactNode } from 'react';
import styles from './GameWindow.module.css';

interface GameWindowProps {
  children: ReactNode;
}

export default function GameWindow({ children }: GameWindowProps) {
  return (
    <div className={styles.gameWindow}>
      {children}
    </div>
  );
} 