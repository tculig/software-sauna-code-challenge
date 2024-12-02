import { useRef, useCallback } from 'react';

export interface Position {
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
    errors: Error[];
}

export default function useMazeTraverser(mazeGrid: string[][], onUpdate: (state: TraversalState) => void) {
    const errorsRef = useRef<Error[]>([]);
    const isTraversing = useRef<boolean>(false);
    const traversalTimeoutRef = useRef<number | null>(null);
    const collectedLettersRef = useRef<string[]>([]);
    const pathLettersRef = useRef<string[]>([]);
    const currentPositionRef = useRef<Position | null>(null);
    const directionRef = useRef<Direction>({ x: 0, y: 0 });
    const visitedRef = useRef<Position[]>([]);
    const delayTime = 150;

    const sendUpdate = useCallback(() => {
        onUpdate({
            currentPosition: currentPositionRef.current,
            collectedLetters: collectedLettersRef.current,
            pathLetters: pathLettersRef.current,
            isTraversing: isTraversing.current,
            errors: errorsRef.current,
        });
    }, [onUpdate]);

    const traverse = useCallback(() => {
        if (!isTraversing.current || !currentPositionRef.current) return;

        directionRef.current = findDirection(mazeGrid, currentPositionRef.current, directionRef.current);
        if (directionRef.current.x === 0 && directionRef.current.y == 0) {
            isTraversing.current = false;
            sendUpdate();
            return;
        }

        const { x, y } = currentPositionRef.current;
        // Move to next position
        currentPositionRef.current = {
            x: x + directionRef.current.x,
            y: y + directionRef.current.y,
        };

        const content = mazeGrid[currentPositionRef.current.y][currentPositionRef.current.x];
        pathLettersRef.current.push(content);
        if (content === 'x') {
            // Reached the end
            isTraversing.current = false;
            sendUpdate();
            return;
        }

        if (/[A-Z]/.test(content)) {
            // Collect letter
            let alreadyIncludes = false;
            // Check if already used
            for (let i = 0; i < visitedRef.current.length; i++) {
                if (visitedRef.current[i].x === currentPositionRef.current.x && visitedRef.current[i].y === currentPositionRef.current.y) {
                    alreadyIncludes = true;
                    break;
                }
            }
            if (!alreadyIncludes) {
                collectedLettersRef.current.push(content);
                visitedRef.current.push(currentPositionRef.current);
            }
        }

        sendUpdate();

        // Continue traversal after a delay
        traversalTimeoutRef.current = window.setTimeout(traverse, delayTime);
    }, [mazeGrid, sendUpdate]);

    const findDirection = (mazeGrid: string[][], currentPosition: Position, currentDirection: Direction): Direction => {
        const currentValue = mazeGrid[currentPosition.y][currentPosition.x];
        //const shouldTurn = /[A-Z+]/.test(currentValue);
        const shouldTurn = currentValue === '+';
        const goStraight = currentValue === '-' || currentValue === '|';

        if (!shouldTurn) {
            // First check "Go straight through intersections" condition
            const optimisticX = currentPosition.x + currentDirection.x;
            const optimisticY = currentPosition.y + currentDirection.y;
            const stepSameDirection = mazeGrid[optimisticY]?.[optimisticX];

            if (stepSameDirection && stepSameDirection !== '' && stepSameDirection !== ' ' && (optimisticX !== currentPosition.x || optimisticY !== currentPosition.y)) return currentDirection;
        }

        // If not going straight
        const directions: Direction[] = goStraight
            ? [currentDirection]
            : [
                  { x: -1, y: 0 }, // left
                  { x: 1, y: 0 }, // right
                  { x: 0, y: -1 }, // up
                  { x: 0, y: 1 }, // down
              ];

        const validDirections: Direction[] = [];

        for (const { x: dx, y: dy } of directions) {
            const newX = currentPosition.x + dx;
            const newY = currentPosition.y + dy;
            if (dx === -currentDirection.x && dy === -currentDirection.y) {
                // this is the direction we came from, no retracements
                continue;
            }
            if (shouldTurn && dx === currentDirection.x && dy === currentDirection.y) {
                continue;
            }
            //check bounds
            if (newY >= 0 && newY < mazeGrid.length && newX >= 0 && newX < mazeGrid[newY].length) {
                const currentTile = mazeGrid[newY][newX];
                if (currentTile !== '' && currentTile !== ' ') {
                    validDirections.push({ x: dx, y: dy });
                }
            } else {
                if (goStraight) errorsRef.current.push(new Error('Invalid maze: Path leades outside bounds.'));
            }
        }
        if (validDirections.length === 1) {
            return validDirections[0];
        } else if (validDirections.length === 0) {
            if (currentValue === '+') {
                errorsRef.current.push(new Error('Invalid maze: Fake turn found.'));
            } else {
                errorsRef.current.push(new Error('Invalid maze: Broken path found.'));
            }
            isTraversing.current = false;

            return { x: 0, y: 0 };
        } else {
            if (currentValue === '@') {
                errorsRef.current.push(new Error('Invalid maze: Multiple starting paths found.'));
            } else {
                errorsRef.current.push(new Error('Invalid maze: Fork in path found.'));
            }
            isTraversing.current = false;
            return { x: 0, y: 0 };
        }
    };

    const startTraversal = useCallback(() => {
        collectedLettersRef.current = [];
        pathLettersRef.current = [];
        errorsRef.current = [];
        visitedRef.current = [];
        isTraversing.current = true;
        directionRef.current = { x: 0, y: 0 };
        // Find the starting position '@'
        let posX = -1;
        let posY = -1;
        for (let y = 0; y < mazeGrid.length; y++) {
            const x = mazeGrid[y].indexOf('@');
            if (x !== -1) {
                posX = x;
                posY = y;
                break;
            }
        }
        const mazeGridString = JSON.stringify(mazeGrid);

        if (posX === -1 || posY === -1) {
            isTraversing.current = false;
            errorsRef.current.push(new Error('Invalid maze: Start character "@" not found.'));
        } else if (!mazeGridString.includes('x')) {
            isTraversing.current = false;
            errorsRef.current.push(new Error('Invalid maze: End character "x" not found.'));
        } else if (mazeGridString.split('@').length - 1 > 1) {
            isTraversing.current = false;
            errorsRef.current.push(new Error('Invalid maze: Multiple starts "@" found.'));
        } else {
            currentPositionRef.current = { x: posX, y: posY };
            pathLettersRef.current.push(mazeGrid[posY][posX]);
            window.setTimeout(traverse, delayTime);
        }

        sendUpdate();
    }, [mazeGrid, sendUpdate, traverse]);

    return { startTraversal };
}
