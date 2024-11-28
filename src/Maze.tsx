import React, { useState } from 'react';
import styled from 'styled-components';
import Cell from './Cell';
import Controls from './Controls';
import useMazeTraverser, { TraversalState } from './useMazeTraverser';
import { transformMap } from './utils';
/*
const mazeData = [
  ['', '', '', '', '', 'x', '', '', '', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '|', '', '', '+', '-', '-', '+', '', '', '', ''],
  ['', '', '', '', '', 'A', '', '', '|', '', '', 'C', '', '', '', ''],
  ['', '@', '-', '-', '-', '|', '-', '-', '-', '-', 'E', '|', '-', '-', '+', ''],
  ['', '', '', '', '', '|', '', '', '|', '', '', '|', '', '', 'D', ''],
  ['', '', '', '', '', '+', 'B', '-', '+', '', '', '+', '-', '-', '+', ''],
];
*/
const mazeData = `
 +-L-+  
 |  +A-+
@B+ ++ H
 ++    x`;
const mazeGrid = transformMap(mazeData);

const MazeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${mazeGrid[0].length}, 20px);
  grid-gap: 1px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Maze: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [pathLetters, setPathLetters] = useState<string[]>([]);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  const handleUpdate = ({ currentPosition, collectedLetters, isTraversing, pathLetters }: TraversalState) => {
    setCurrentPosition(currentPosition);
    setCollectedLetters(collectedLetters);
    setPathLetters(pathLetters);
    setIsTraversing(isTraversing);
  };

  const { startTraversal } = useMazeTraverser(mazeGrid, handleUpdate);

  return (
    <>
      <MazeContainer>
        {mazeGrid.map((row, y) =>
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
        pathLetters={pathLetters}
      />
    </>
  );
};

export default Maze;
