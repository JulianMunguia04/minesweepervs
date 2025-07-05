"use client"

import React from 'react'
import { useState } from 'react';

class Tile {
    constructor(value, isBomb) {
      this.value = value
      this.isBomb = isBomb;
    }

    onClick = () => {
      alert(`Tile ${this.value} clicked! and isBomb = ${this.isBomb}`);
    }
  }

const GamePage = () =>{
  const ROWS = 10
  const COLUMNS = 10
  const BOMB_RATIO = 0.10

  const randomizeBomb = (BOMB_RATIO)=>{
    const isBomb = Math.random() < BOMB_RATIO;
    return isBomb;
  }

  const [grid] = useState(() => {
    const rows = ROWS;
    const cols = COLUMNS;
    const tempGrid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(new Tile(`${r}-${c}`, randomizeBomb(BOMB_RATIO)));
      }
      tempGrid.push(row);
    }
    return tempGrid;
  });

  

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLUMNS}, 60px)`,
        gridTemplateRows: `repeat(${ROWS}, 60px)`,
        gap: '5px',
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
          onClick={() => tile.onClick()}
        >
          {tile.isBomb ? (
            <div>❌</div>
          ) : (
            <div>{tile.value}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export default GamePage