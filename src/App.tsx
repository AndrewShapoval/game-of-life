import React, {useState} from 'react';
import styles from './App.module.scss';
import produce from "immer"

export const App: React.FC = () => {

    const numRows = 37
    const numCols = 50

    const [grid, setGrid] = useState(() => {
        const rows = []
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0))
        }
        return rows
    })
    console.log(grid)

    return (
        <div className={styles.app}>
            <h1>Game of Life</h1>
            <div className={styles.container}>
                {grid.map((rows, i) =>
                    <div key={i} className={styles.rows}>
                        {rows.map((col, k) =>
                            <div key={`${i}-${k}`} className={grid[i][k] ? styles.busyCell : styles.cell}
                                 onClick={() => {
                                     const newGrid = produce(grid, gridCopy => {
                                         gridCopy[i][k] = gridCopy[i][k] ? 0 : 1
                                     })
                                     setGrid(newGrid)
                                 }}/>
                        )}</div>
                )}</div>
        </div>
    );
}
