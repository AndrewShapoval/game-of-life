import React, {useEffect, useRef, useState} from 'react';
import styles from './App.module.scss';
import produce from "immer"

export const App: React.FC = () => {

    const [numRows, setNumRows] = useState<number>(50)
    const [numCols, setNumCols] = useState<number>(50)
    const [newNumRows, setNewNumRows] = useState<number>(10)
    const [newNumCols, setNewNumCols] = useState<number>(10)

    const operations = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

    const installCells = [[21, 24], [23, 23], [23, 25], [24, 22], [24, 26], [25, 22], [25, 26], [26, 22], [26, 26],
        [27, 22], [27, 26], [28, 22], [28, 26], [29, 22], [29, 26], [30, 23], [30, 25], [31, 24]]

    useEffect(() => {
        setGrid(generateEmptyGrid())
    }, [numRows, numCols])

    const generateEmptyGrid = () => {
        const rows = []
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0))
        }
        return rows
    }

    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid()
    })

    const [lastGrid, setLastGrid] = useState(() => {
        return generateEmptyGrid()
    })
    console.log(grid)
    const [running, setRunning] = useState(false)
    const runningRef = useRef(running)
    runningRef.current = running

    const runningLogicLife = () => {
        setGrid((g) => {
            setLastGrid(g)
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0
                        operations.forEach(([x, y]) => {
                            const newI = i + x
                            const newK = k + y
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK]
                            }
                        })

                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k] = 0
                        } else if (g[i][k] === 0 && neighbors === 3) {
                            gridCopy[i][k] = 1
                        }
                    }
                }
            })
        })
    }

    const runSimulation = () => {
        if (!runningRef.current) {
            return
        }
        runningLogicLife()
        setTimeout(runSimulation, 1000)
    }

    const installCellsGrid = () => {
        setGrid((g) => {
            debugger
            setLastGrid(g)
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        installCells.forEach(([x, y]) => {
                            if (x === i && y === k) {
                                gridCopy[i][k] = 1
                            }
                        })
                    }
                }
            })
        })
    }

    return (
        <div className={styles.app}>
            <h1>Game of Life</h1>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => {
                    setRunning(!running)
                    if (!running) {
                        runningRef.current = true
                        runSimulation()
                    }
                }}
                >{running ? "Stop" : "Start"}
                </button>
                <button className={styles.button} onClick={() => {
                    setGrid(generateEmptyGrid())
                }}
                >Clear
                </button>
                <button className={styles.button} disabled={numRows < 35 || numCols < 45} onClick={() => {
                    installCellsGrid()
                }}>
                    Installed cells
                </button>
                <button className={styles.button} onClick={() => {
                    runningLogicLife()
                }}>
                    Next move
                </button>
                <button className={styles.button} disabled={grid === lastGrid} onClick={() => {
                    setGrid(lastGrid)
                }}>
                    Last move
                </button>
                {newNumRows < 10 || newNumRows > 100 || newNumCols < 10 || newNumCols > 100
                    ? <div className={styles.error}>
                        The number must be between 10 and 100
                    </div>
                    : undefined}
                <div className={styles.button}>
                    <input type="number" placeholder={`${newNumRows} rows`}
                           onChange={(e) => setNewNumRows(Number(e.currentTarget.value))}/>
                    <button disabled={newNumRows < 10 || newNumRows > 100} onClick={(e) => {
                        setNumRows(newNumRows)
                    }}
                    >Set rows
                    </button>
                </div>
                <div className={styles.button}>
                    <input type="number" placeholder={`${newNumCols} columns`}
                           onChange={(e) => setNewNumCols(Number(e.currentTarget.value))}/>
                    <button disabled={newNumCols < 10 || newNumCols > 100} onClick={() => {
                        setNumCols(newNumCols)
                    }}>Set columns
                    </button>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.grid}>
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
                    )}
                    <div>
                    </div>
                </div>
            </div>
        </div>
    );
}
