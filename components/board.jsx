"use client"

import React from 'react'
import { useState, useEffect } from 'react';

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

  onClick = (grid, setGrid, newGame, activatePowerUp) => {
    const tempGrid = grid.map(row =>
      row.map(tile =>
        new Tile(tile.row, tile.col, tile.value, tile.isBomb, tile.isCovered, tile.isFlagged, tile.isPowerUp, tile.powerUpType, tile.isPowerUpUsed)
      )
    );

    const clickedTile = tempGrid[this.row][this.col];
    if (!clickedTile.isFlagged){
      if (clickedTile.isPowerUp) {
        if (clickedTile.isCovered){
          clickedTile.isCovered = false;
          setGrid(tempGrid);
        }else if (!clickedTile.isCovered && !clickedTile.isPowerUpUsed){
          activatePowerUp(clickedTile.powerUpType);
          clickedTile.isCovered = false;
          clickedTile.isPowerUpUsed = true; // Remove power-up after activation
          setGrid(tempGrid);
        }
        return;
      }

      if (!clickedTile.isBomb){
        clickedTile.isCovered = false;
      }
      else {
        clickedTile.isCovered = false;
        setGrid(tempGrid)
        setTimeout(()=>{
          newGame(setGrid);
        }, 1000)
        return;
      }
      if (clickedTile.value === 0) {
        this.floodReveal(grid, setGrid);
      } else {
        setGrid(tempGrid);
      }

      if (checkWin(tempGrid)) {
        alert("🎉 You won!");
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

  floodReveal = (grid, setGrid) => {
    const tempGrid = grid.map(row => row.map(tile => ({ ...tile })));
    const queue = [];
    const visited = new Set();

    const key = (r, c) => `${r},${c}`;

    queue.push([this.row, this.col]);

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (r < 0 || r >= ROWS || c < 0 || c >= COLUMNS) continue;
      if (visited.has(key(r, c))) continue;

      const tile = tempGrid[r][c];
      visited.add(key(r, c));

      if (!tile.isBomb) {
        tile.isCovered = false;
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

const Board = ({gameStarted: initialGameStarted, gridData}) => {
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

  const activatePowerUp = (powerUpType) => {
    // Add the power-up to active power-ups
    setActivePowerUps(prev => [...prev, powerUpType]);
    
    // Implement different effects for different power-ups
    switch(powerUpType) {
      case 'freeze':
        alert('Freeze other player');
        // You can implement the actual effect here 
        break;
      case 'flag-reveal':
        alert('Random flags on the board revealed');
        // You can implement the actual effect here
        break;
      case 'smokescreen':
        alert('Oppenents board blinded');
        // You can implement the actual effect here
        break;
      case 'defensive-shield':
        alert('Defended from opponents freeze and smoke and cliker for 10 seconds');
        // You can implement the actual effect here
        break;
      case 'clicker':
        alert('Click the opponents tile once');
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

  if (!grid) return <div>Loading grid...</div>;

  return (
    <div>  
      <div>Bombs Left: {bombsLeftCount}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLUMNS}, 40px)`,
          gridTemplateRows: `repeat(${ROWS}, 40px)`,
          gap: '0px',
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
              tile.onClick(grid, setGrid, newGame, activatePowerUp);
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
            ) : (
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
    </div>
  )
}

export default Board