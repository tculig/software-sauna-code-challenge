import { useState, useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface TraversalState {
  currentPosition: Position | null;
  collectedLetters: string[];
  isTraversing: boolean;
}

export default function useMazeTraverser(
  mazeGrid: string[][],
  onUpdate: (state: TraversalState) => void
) {
  const [isTraversing, setIsTraversing] = useState(false);
  const traversalTimeoutRef = useRef<number | null>(null);
  const collectedLettersRef = useRef<string[]>([]);
  const currentPositionRef = useRef<Position | null>(null);
  const directionRef = useRef<[number, number]>([0, 0]);

  const traverse = useCallback(() => {
    if (!isTraversing || !currentPositionRef.current) return;

    const { x, y } = currentPositionRef.current;
    const c = mazeGrid[y][x];

    if (c === "x") {
      // Reached the end
      setIsTraversing(false);
      onUpdate({
        currentPosition: currentPositionRef.current,
        collectedLetters: collectedLettersRef.current,
        isTraversing: false,
      });
      return;
    } else if (c === " " || c === "") {
      // End of path
      setIsTraversing(false);
      onUpdate({
        currentPosition: currentPositionRef.current,
        collectedLetters: collectedLettersRef.current,
        isTraversing: false,
      });
      return;
    } else if (c === "+") {
      // Intersection: change direction
      const directions: [number, number][] = [
        [-1, 0], // left
        [1, 0], // right
        [0, -1], // up
        [0, 1], // down
      ];

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          dx === -directionRef.current[0] &&
          dy === -directionRef.current[1]
        ) {
          continue;
        }
        if (
          newY >= 0 &&
          newY < mazeGrid.length &&
          newX >= 0 &&
          newX < mazeGrid[newY].length
        ) {
          const c2 = mazeGrid[newY][newX];
          if (c2 !== " " && c2 !== "") {
            directionRef.current = [dx, dy];
            break;
          }
        }
      }
    } else if (/[A-Z]/.test(c)) {
      // Collect letter
      if (!collectedLettersRef.current.includes(c)) {
        collectedLettersRef.current.push(c);
      }
    }

    // Move to next position
    currentPositionRef.current = {
      x: x + directionRef.current[0],
      y: y + directionRef.current[1],
    };

    // Check bounds
    if (
      currentPositionRef.current.y < 0 ||
      currentPositionRef.current.y >= mazeGrid.length ||
      currentPositionRef.current.x < 0 ||
      currentPositionRef.current.x >=
        mazeGrid[currentPositionRef.current.y].length
    ) {
      setIsTraversing(false);
      onUpdate({
        currentPosition: currentPositionRef.current,
        collectedLetters: collectedLettersRef.current,
        isTraversing: false,
      });
      return;
    }

    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      isTraversing: true,
    });

    // Continue traversal after a delay
    traversalTimeoutRef.current = window.setTimeout(traverse, 300);
  }, [isTraversing, mazeGrid, onUpdate]);

  const startTraversal = useCallback(() => {
    collectedLettersRef.current = [];
    setIsTraversing(true);

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
      setIsTraversing(false);
      return;
    }

    currentPositionRef.current = { x: posX, y: posY };
    directionRef.current = [1, 0]; // Moving right

    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      isTraversing: true,
    });

    traverse();
  }, [mazeGrid, onUpdate, traverse]);

  const stopTraversal = useCallback(() => {
    setIsTraversing(false);
    if (traversalTimeoutRef.current !== null) {
      clearTimeout(traversalTimeoutRef.current);
    }
    onUpdate({
      currentPosition: currentPositionRef.current,
      collectedLetters: collectedLettersRef.current,
      isTraversing: false,
    });
  }, [onUpdate]);

  return { startTraversal, stopTraversal };
}
