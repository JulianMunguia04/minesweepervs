"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { memo } from 'react';

class Tile {
  constructor(row, col, value, isBomb, isCovered, isFlagged, isPowerUp, powerUpType, isPowerUpUsed) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.isBomb = isBomb;
    this.isCovered = isCovered;
    this.isFlagged = isFlagged;
    this.isPowerUp = isPowerUp;
    this.powerUpType = powerUpType;
    this.isPowerUpUsed = isPowerUpUsed;
  }

  onClick = (grid, setGrid, newGame, activatePowerUp, points, setPoints) => {
    let currentPoints = Number(points);
    const tempGrid = grid.map(row =>
      row.map(tile =>
        new Tile(tile.row, tile.col, tile.value, tile.isBomb, tile.isCovered, tile.isFlagged, tile.isPowerUp, tile.powerUpType, tile.isPowerUpUsed)
      )
    );

    const clickedTile = tempGrid[this.row][this.col];

    if (!clickedTile.isCovered && !clickedTile.isPowerUp) {
      return;
    }

    if (!clickedTile.isFlagged){
      if (clickedTile.isPowerUp) {
        if (clickedTile.isCovered){
          clickedTile.isCovered = false;
          setGrid(tempGrid);
        }else if (!clickedTile.isCovered && !clickedTile.isPowerUpUsed){
          clickedTile.isCovered = false;
          clickedTile.isPowerUpUsed = true;
          activatePowerUp(clickedTile.powerUpType, clickedTile, tempGrid);
          if (!(clickedTile.powerUpType === 'flag-reveal')){
            setGrid(tempGrid);
          }
        }
        return;
      }

      if (!clickedTile.isBomb){
        clickedTile.isCovered = false;
        let currentPoints = Number(points);
        currentPoints += clickedTile.value * 10;
        setPoints(currentPoints)
      }
      else {
        clickedTile.isCovered = false;
        currentPoints -= 500;
        setPoints(currentPoints)
        setGrid(tempGrid)
        setTimeout(()=>{
          newGame(setGrid);
        }, 1000)
        return;
      }
      if (clickedTile.value === 0) {
        this.floodReveal(grid, setGrid, points, setPoints);
      } else {
        setGrid(tempGrid);
      }

      if (checkWin(tempGrid)) {
        currentPoints += 1500;
        setPoints(currentPoints)
        newGame(setGrid);
      }
    }
  }

  onContextMenu = (grid, setGrid) => {
    const tempGrid = grid.map(row => row.map(tile => ({ ...tile })));

    const clickedTile = tempGrid[this.row][this.col];
    if (clickedTile.isFlagged){
      clickedTile.isFlagged = false;
    }
    else if (!clickedTile.isFlagged && clickedTile.isCovered){
      clickedTile.isFlagged = true;
    }

    setGrid(tempGrid);
  }

  floodReveal = (grid, setGrid, points, setPoints) => {
    const tempGrid = grid.map(row => row.map(tile => ({ ...tile })));
    const queue = [];
    const visited = new Set();

    const key = (r, c) => `${r},${c}`;

    queue.push([this.row, this.col]);

    let currentPoints = Number(points);
    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (r < 0 || r >= ROWS || c < 0 || c >= COLUMNS) continue;
      if (visited.has(key(r, c))) continue;

      const tile = tempGrid[r][c];
      visited.add(key(r, c));

      if (!tile.isBomb) {
        tile.isCovered = false;
        currentPoints += tile.value * 10;
        // if it's 0, add neighbors to queue
        if (tile.value === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (!(dr === 0 && dc === 0)) {
                queue.push([r + dr, c + dc]);
              }
            }
          }
        }
      }
    }
    setPoints(currentPoints)
    setGrid(tempGrid);
  };
}

const ROWS = 12;
const COLUMNS = 12;
const BOMB_RATIO = 0.15;
const POWERUP_CHANCE = 0.05; // % Chance of a tile being a power up

const POWERUP_PROBABILITIES = {
  'freeze': 0.3,
  'flag-reveal': 0.2,
  'smokescreen': 0.2,
  'defensive-shield': 0.2,
  'clicker': 0.1,
};
const randomizePowerUp = () => {
  if (Math.random() >= POWERUP_CHANCE) {
    return { isPowerUp: false, powerUpType: null };
  }

  const rand = Math.random();
  let cumulative = 0;

  for (const [type, chance] of Object.entries(POWERUP_PROBABILITIES)) {
    cumulative += chance;
    if (rand < cumulative) {
      return { isPowerUp: true, powerUpType: type };
    }
  }

  return { isPowerUp: true, powerUpType: Object.keys(POWERUP_PROBABILITIES).pop() };
};

const randomizeBomb = (BOMB_RATIO)=>{
  const isBomb = Math.random() < BOMB_RATIO;
  return isBomb;
}

const getBombCount = (tile, grid) => {
  const row = tile.row;
  const col = tile.col;
  let bombCount = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 && newRow < ROWS &&
        newCol >= 0 && newCol < COLUMNS &&
        !(dr === 0 && dc === 0)
      ) {
        if (grid[newRow][newCol].isBomb) {
          bombCount++;
        }
      }
    }
  }

  return bombCount;
};

const flagRevealPowerUp = (grid, setGrid) => {
  // Make deep copy of the grid
  const tempGrid = grid.map(row =>
    row.map(tile => new Tile(
      tile.row, tile.col, tile.value,
      tile.isBomb, tile.isCovered, tile.isFlagged,
      tile.isPowerUp, tile.powerUpType, tile.isPowerUpUsed
    ))
  );

  // Collect all bombs that are still covered and not flagged
  const hiddenBombs = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const t = tempGrid[r][c];
      if (t.isBomb && t.isCovered && !t.isFlagged) {
        hiddenBombs.push(t);
      }
    }
  }

  console.log("hidden bombs: ", hiddenBombs);

  if (hiddenBombs.length === 0) return; // nothing to flag

  // Decide how many bombs to flag (between 1–5, but not more than available)
  const count = Math.min(
    hiddenBombs.length,
    Math.floor(Math.random() * 5) + 1
  );

  // Shuffle hidden bombs
  for (let i = hiddenBombs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hiddenBombs[i], hiddenBombs[j]] = [hiddenBombs[j], hiddenBombs[i]];
  }

  // Flag the chosen bombs
  hiddenBombs.slice(0, count).forEach(bomb => {
    bomb.isFlagged = true;
    console.log("bomb flagged", bomb.row, bomb.col);
  });

  console.log("updated grid:", tempGrid);

  // ✅ Correct state update
  setGrid(tempGrid);
};

const checkWin = (grid) => {
  for (const row of grid) {
    for (const tile of row) {
      if (!tile.isBomb && tile.isCovered) {
        return false;
      }
    }
  }
  return true;
};

// const newGame = (setGrid) =>{
//   const tempGrid = [];

//   for (let r = 0; r < ROWS; r++) {
//     const row = [];
//     for (let c = 0; c < COLUMNS; c++) {
//       row.push(new Tile(r, c, null, randomizeBomb(BOMB_RATIO), true, false));
//     }
//     tempGrid.push(row);
//   }

//   for (let r = 0; r < ROWS; r++) {
//     for (let c = 0; c < COLUMNS; c++) {
//       const tile = tempGrid[r][c];
//       tile.value = getBombCount(tile, tempGrid);
//     }
//   }

//   setGrid(tempGrid);
// }

const Board = memo((
  { gameStarted: initialGameStarted, 
    gridData, 
    sendUpdatedBoard, 
    points, 
    setPoints, 
    frozen, 
    freezeOpponent, 
    shield, 
    activateShield, 
    smokescreenOpponent, 
    smokescreen,
    clicker,
    activateClicker,
    lastUpdateFromClickerRef
  }) => {
  const [gameStarted, setGameStarted] = useState(initialGameStarted);
  const [grid, setGrid] = useState(null);
  const [activePowerUps, setActivePowerUps] = useState([]);
  const [bombsLeftCount, setBombsLeftCount] = useState(0);

  useEffect(() => {
    setGameStarted(initialGameStarted);
  }, [initialGameStarted]);

  useEffect(()=>{
    if (grid){
      let currentBombsLeftCount = 0
      console.log(grid)
      grid.forEach((row, i)=>{
        row.forEach((tile, i)=>{
          if (tile.isBomb){
            currentBombsLeftCount++
          }
          if (tile.isFlagged){
            currentBombsLeftCount--
          }
        })
      })
      setBombsLeftCount(currentBombsLeftCount)
    }
  }, [grid])

  useEffect(() => {
    if (gridData) {
      const tempGrid = gridData.map(row =>
        row.map(tile =>
          new Tile(tile.row, tile.col, tile.value, tile.isBomb, tile.isCovered, tile.isFlagged, tile.isPowerUp, tile.powerUpType, tile.isPowerUpUsed)
        )
      );
      setGrid(tempGrid);
    } else {
      newGame(setGrid);
    }
  }, [gridData]);

  const activatePowerUp = (powerUpType, tile, grid) => {
    // Add the power-up to active power-ups
    setActivePowerUps(prev => [...prev, powerUpType]);
    
    // Implement different effects for different power-ups
    switch(powerUpType) {
      case 'freeze':
        freezeOpponent() 
        break;
      case 'flag-reveal':
          flagRevealPowerUp(grid, setGrid)
        break;
      case 'smokescreen':
        smokescreenOpponent()
        // You can implement the actual effect here
        break;
      case 'defensive-shield':
          activateShield()
        break;
      case 'clicker':
        activateClicker()
        // You can implement the actual effect here
        break;
      default:
        break;
    }
    
    // Remove the power-up after 5 seconds
    setTimeout(() => {
      setActivePowerUps(prev => prev.filter(p => p !== powerUpType));
    }, 5000);
  };

  const newGame = () => {
    const tempGrid = [];
    
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLUMNS; c++) {
        const isBomb = randomizeBomb(BOMB_RATIO);
        const { isPowerUp, powerUpType } = randomizePowerUp();

        row.push(new Tile(
          r, c, null, 
          isPowerUp ? false : isBomb,
          true, false, 
          isPowerUp, powerUpType, false
        ));
      }
      tempGrid.push(row);
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLUMNS; c++) {
        const tile = tempGrid[r][c];
        tile.value = getBombCount(tile, tempGrid);
      }
    }

    setGrid(tempGrid);
    setActivePowerUps([]);
  }

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    if (lastUpdateFromClickerRef.current) {
      lastUpdateFromClickerRef.current = false;
      return;
    }
    if (grid && points !== null) {
      sendUpdatedBoard(grid, points)
      console.log("Sent board and points to the socket:",  grid, points );
    }
  }, [grid]);

  if (!grid) return <div>Loading grid...</div>;

  return (
    <div>  
      <div style={{ 
        position: 'relative', 
        display: 'inline-block', 
        width: `${COLUMNS * 40}px`,
        height: `${ROWS * 40}px`, 
        border: '4px solid #7c7c7c',
        boxSizing: 'content-box',
        zIndex: 1
      }}
      >
        {frozen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/game_images/frozen.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 2,
            }}
          ></div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLUMNS}, 40px)`,
            gridTemplateRows: `repeat(${ROWS}, 40px)`,
            gap: '0px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {grid.flat().map((tile, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #333',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
                backgroundColor: '#eee',
                cursor: gameStarted ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (!gameStarted) return;
                tile.onClick(grid, setGrid, newGame, activatePowerUp, points, setPoints, freezeOpponent);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                if (!gameStarted) return;
                tile.onContextMenu(grid, setGrid);
              }}
            >
              {tile.isFlagged ? (
                <div
                  style={{
                      backgroundImage: 'url("/game_images/flag.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                ></div>
              ) : tile.isCovered ? (
                <div
                  style={{
                    backgroundImage: 'url("/game_images/empty-block.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                ></div>
              ) : tile.isPowerUp && !tile.isPowerUpUsed? (
                <div
                  style={{
                      backgroundImage: `url("/game_images/${tile.powerUpType}.png")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                ></div>
              ) : tile.isPowerUp ? (
                <div
                  style={{
                      backgroundImage: `url("/game_images/${tile.powerUpType}-clicked.png")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                ></div>
              ) : tile.isBomb ? (
                <div
                  style={{
                      backgroundImage: 'url("/game_images/bomb-at-clicked-block.png")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                ></div>
              ) : smokescreen & tile.value > 0 ? (
                <div
                  style={{
                    position: 'relative',
                    backgroundImage: `url("/game_images/empty-block.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <img
                    src="/game_images/smokescreen-activated.png"
                    alt="Overlay"
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              ):(
                <div
                  style={{
                      backgroundImage: `url("/game_images/${tile.value}.png")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:"space-between", alignItems: 'center', height: '5vh'}}>
          <div>Bombs Left: {bombsLeftCount}</div>
          <div style={{width: '23%'}}>Points: {points}</div>
        </div>
        <div 
          className="concave-minesweeper-no-hover"
          style={{
            margin: 0,
            cursor: 'pointer',
            width: '100%',
            height: '10vh',
            position: 'relative',
          }}
        >
          {clicker && (
            <div style={{
              width: "10%",
              backgroundImage: "url('/powerup-icons/clicker.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: 'absolute',
              top: '50%',
              left: '10%',
              transform: 'translateY(-50%)'
            }}>
              <div style={{ paddingTop: "100%" }}></div>
            </div>
          )}

          {shield && (
            <div style={{
              width: "10%",
              backgroundImage: "url('/powerup-icons/shield.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: 'absolute',
              top: '50%',
              left: '30%',
              transform: 'translateY(-50%)'
            }}>
              <div style={{ paddingTop: "100%" }}></div>
            </div>
          )}

          {smokescreen && (
            <div style={{
              width: "10%",
              backgroundImage: "url('/powerup-icons/smokescreen.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateY(-50%)'
            }}>
              <div style={{ paddingTop: "100%" }}></div>
            </div>
          )}

          {frozen && (
            <div style={{
              width: "10%",
              backgroundImage: "url('/powerup-icons/frozen.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: 'absolute',
              top: '50%',
              left: '70%',
              transform: 'translateY(-50%)'
            }}>
              <div style={{ paddingTop: "100%" }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default Board