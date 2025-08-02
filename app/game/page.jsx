"use client"

import React from 'react'
import { useState, useEffect } from 'react';

class Tile {
  constructor(row, col, value, isBomb, isCovered, isFlagged) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.isBomb = isBomb;
    this.isCovered = isCovered;
    this.isFlagged = isFlagged;
  }

  onClick = (grid, setGrid, newGame) => {
    const tempGrid = grid.map(row =>
      row.map(tile =>
        new Tile(tile.row, tile.col, tile.value, tile.isBomb, tile.isCovered, tile.isFlagged)
      )
    );

    const clickedTile = tempGrid[this.row][this.col];
    if (!clickedTile.isBomb){
      clickedTile.isCovered = false;
    }
    else {
      clickedTile.isCovered = false;
      setGrid(tempGrid)
      setTimeout(()=>{
        alert("You suck bro");
        newGame(setGrid);
      }, 10)
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

const ROWS = 12
const COLUMNS = 12
const BOMB_RATIO = 0.15

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

const newGame = (setGrid) =>{
  const tempGrid = [];

  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLUMNS; c++) {
      row.push(new Tile(r, c, null, randomizeBomb(BOMB_RATIO), true, false));
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
}

const GamePage = () => {
  const [grid, setGrid] = useState(null);

  const newGame = () => {
    const tempGrid = [];
    
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLUMNS; c++) {
        row.push(new Tile(r, c, null, randomizeBomb(BOMB_RATIO), true, false));
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
  }

  useEffect(() => {
    newGame();
  }, []);

  if (!grid) return <div>Loading grid...</div>;

  return (
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
            cursor: 'pointer',
          }}
          onClick={() => tile.onClick(grid, setGrid, newGame)} //left click
          onContextMenu={(e) => {                              //right click
            e.preventDefault();
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
  )
}

export default GamePage