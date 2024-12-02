import { useState } from 'react';
import styled from 'styled-components';
import Cell from '../Cell';
import Controls from '../Controls';
import useMazeTraverser, { TraversalState } from '../../hooks/useMazeTraverser';

const MazeContainer = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 20px);
  grid-gap: 1px;
  justify-content: center;
  margin-bottom: 20px;
`;

interface MazeProps {
  mazeGrid: string[][],
}

const Maze = ({ mazeGrid }: MazeProps) => {
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
      <MazeContainer $columns={mazeGrid[0].length}>
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
