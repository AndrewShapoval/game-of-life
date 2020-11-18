import React from 'react';
import styles from './App.module.scss';

export const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <h1>Game of Life</h1>
    </div>
  );
}
