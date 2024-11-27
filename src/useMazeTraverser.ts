import { useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

type DirectionValue = 0 | 1 | -1;
interface Direction {
  x: DirectionValue;
  y: DirectionValue;
}

export interface TraversalState {
  currentPosition: Position | null;
  collectedLetters: string[];
  pathLetters: string[];
  isTraversing: boolean;
}

export default function useMazeTraverser(
  mazeGrid: string[][],
  onUpdate: (state: TraversalState) => void
) {
  const isTraversing = useRef<boolean>(false);
  const traversalTimeoutRef = useRef<number | null>(null);
  const collectedLettersRef = useRef<string[]>([]);
  const pathLettersRef = useRef<string[]>([]);
  const currentPositionRef = useRef<Position | null>(null);
  const directionRef = useRef<Direction>({ x: 0, y: 0 });
  const delayTime = 150;

  const traverse = useCallback(() => {
    if (!isTraversing || !currentPositionRef.current) return;

    directionRef.current = findDirection(
      mazeGrid,
      currentPositionRef.current,
      directionRef.current
    );
    const { x, y } = currentPositionRef.current;
    // Move to next position
    currentPositionRef.current = {
      x: x + directionRef.current.x,
      y: y + directionRef.current.y,
    };

    // Check bounds
    if (
      currentPositionRef.current.y < 0 ||
      currentPositionRef.current.y > mazeGrid.length - 1 ||
      currentPositionRef.current.x < 0 ||
      currentPositionRef.current.x >
        mazeGrid[currentPositionRef.current.y].length - 1
    ) {
      isTraversing.current = false;
      onUpdate({
        currentPosition: currentPositionRef.current,
        collectedLetters: collectedLettersRef.current,
        pathLetters: pathLettersRef.current,
        isTraversing: false,
      });
      return;
    }

    const c =
      mazeGrid[currentPositionRef.current.y][currentPositionRef.current.x];
    pathLettersRef.current.push(c);
    if (c === "x") {
      // Reached the end
      isTraversing.current = false;
      onUpdate({
        currentPosition: currentPositionRef.current,
        collectedLetters: collectedLettersRef.current,
        pathLetters: pathLettersRef.current,
        isTraversing: false,
      });
      return;
    }

    if (/[A-Z]/.test(c)) {
      // Collect letter
      if (!collectedLettersRef.current.includes(c)) {
        collectedLettersRef.current.push(c);
      }
    }

    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      pathLetters: pathLettersRef.current,
      isTraversing: true,
    });

    // Continue traversal after a delay
    traversalTimeoutRef.current = window.setTimeout(traverse, delayTime);
  }, [isTraversing, mazeGrid, onUpdate]);

  const findDirection = (
    mazeGrid: string[][],
    currentPosition: Position,
    currentDirection: Direction
  ): Direction => {
    // First check "Go straight through intersections" condition
    const optimisticX = currentPosition.x + currentDirection.x;
    const optimisticY = currentPosition.y + currentDirection.y;
    const stepSameDirection = mazeGrid[optimisticY]?.[optimisticX];

    if (
      stepSameDirection &&
      stepSameDirection !== "" &&
      (optimisticX !== currentPosition.x || optimisticY !== currentPosition.y)
    )
      return currentDirection;

    // If not going straight
    const directions: Direction[] = [
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }, // right
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 }, // down
    ];

    for (const { x: dx, y: dy } of directions) {
      const newX = currentPosition.x + dx;
      const newY = currentPosition.y + dy;
      if (dx === -currentDirection.x && dy === -currentDirection.y) {
        // this is the direction we came from, no retracements
        continue;
      }
      //check bounds
      if (
        newY >= 0 &&
        newY < mazeGrid.length &&
        newX >= 0 &&
        newX < mazeGrid[newY].length
      ) {
        const currentTile = mazeGrid[newY][newX];

        if (currentTile !== "") {
          return { x: dx, y: dy };
        }
      }
    }
    return { x: 0, y: 0 };
  };

  const startTraversal = useCallback(() => {
    collectedLettersRef.current = [];
    isTraversing.current = true;

    // Find the starting position '@'
    let posX = -1;
    let posY = -1;
    for (let y = 0; y < mazeGrid.length; y++) {
      const x = mazeGrid[y].indexOf("@");
      if (x !== -1) {
        posX = x;
        posY = y;
        break;
      }
    }

    if (posX === -1 || posY === -1) {
      alert('Starting position "@" not found.');
      isTraversing.current = false;
      return;
    }

    currentPositionRef.current = { x: posX, y: posY };
    pathLettersRef.current.push(mazeGrid[posY][posX]);
    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      pathLetters: pathLettersRef.current,
      isTraversing: true,
    });

    window.setTimeout(traverse, delayTime);
  }, [mazeGrid, onUpdate, traverse]);

  const stopTraversal = useCallback(() => {
    isTraversing.current = false;
    if (traversalTimeoutRef.current !== null) {
      clearTimeout(traversalTimeoutRef.current);
    }
    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      pathLetters: pathLettersRef.current,
      isTraversing: false,
    });
  }, [onUpdate]);

  return { startTraversal, stopTraversal };
}
