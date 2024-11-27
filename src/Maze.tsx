// src/Maze.tsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import Controls from './Controls';

const mazeData = [
  ['', '', '', '', '', 'x', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '|', '', '', '+', '-', '-', '+', '', '', '', ''],
  ['', '', '', '', '', 'A', '', '', '|', '', '', 'C', '', '', '', ''],
  ['', '@', '-', '-', '-', '|', '-', '-', '-', '-', 'E', '|', '-', '-', '+', ''],
  ['', '', '', '', '', '|', '', '', '|', '', '', '|', '', '', 'D', ''],
  ['', '', '', '', '', '+', 'B', '-', '+', '', '', '+', '-', '-', '+', ''],
];

const MazeContainer = styled.div<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 20px);
  grid-gap: 1px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Maze: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  const startTraversal = useCallback(() => {
    setCollectedLetters([]);
    setIsTraversing(true);

    // Find the starting position '@'
    let posX = -1;
    let posY = -1;
    for (let y = 0; y < mazeData.length; y++) {
      const x = mazeData[y].indexOf('@');
      if (x !== -1) {
        posX = x;
        posY = y;
        break;
      }
    }

    if (posX === -1 || posY === -1) {
      alert('Starting position "@" not found.');
      setIsTraversing(false);
      return;
    }
    console.log(posX + " " + posY)

    let direction: [number, number] = [1, 0]; // Initial direction (moving right)

    const letters: string[] = [];

    const traverse = () => {
      if (!isTraversing) return;

      const x = posX;
      const y = posY;
      const c = mazeData[y][x];

      setCurrentPosition({ x, y });

      if (c === 'x') {
        // Reached the end
        setIsTraversing(false);
        return;
      } else if (c === ' ' || c === '') {
        // End of path
        setIsTraversing(false);
        return;
      } else if (c === '+') {
        const directions: [number, number][] = [
          [-1, 0], // left
          [1, 0],  // right
          [0, -1], // up
          [0, 1],  // down
        ];

        for (const [dx, dy] of directions) {
          const newX = x + dx;
          const newY = y + dy;
          if (dx === -direction[0] && dy === -direction[1]) {
            continue;
          }
          if (
            newY >= 0 &&
            newY < mazeData.length &&
            newX >= 0 &&
            newX < mazeData[newY].length
          ) {
            const c2 = mazeData[newY][newX];
            if (c2 !== ' ' && c2 !== '') {
              direction = [dx, dy];
              break;
            }
          }
        }
      } else if (/[A-Z]/.test(c)) {
        if (!letters.includes(c)) {
          letters.push(c);
          setCollectedLetters([...letters]);
        }
      }

      // Move to next position
      posX += direction[0];
      posY += direction[1];

      // Check bounds
      if (
        posY < 0 ||
        posY >= mazeData.length ||
        posX < 0 ||
        posX >= mazeData[posY].length
      ) {
        setIsTraversing(false);
        return;
      }

      // Continue traversal after a delay
      setTimeout(traverse, 300);
    };

    traverse();
  }, [isTraversing]);

  return (
    <>
      <MazeContainer $columnCount={mazeData[0].length}>
        {mazeData.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              value={cell}
              isCurrent={currentPosition?.x === x && currentPosition?.y === y}
            />
          ))
        )}
      </MazeContainer>
      <Controls
        collectedLetters={collectedLetters}
        onStart={startTraversal}
        isTraversing={isTraversing}
      />
    </>
  );
};

export default Maze;
