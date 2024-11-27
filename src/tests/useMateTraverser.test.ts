import { renderHook } from '@testing-library/react-hooks';
import useMazeTraverser, { TraversalState } from '../useMazeTraverser';
import { vi } from 'vitest';
import { act } from 'react';

describe('useMazeTraverser Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });
    test('Basic example', async () => {
        const mazeData = [
            ['', '', '@', '-', '-', '-', 'A', '-', '-', '-', '+', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', '|', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', '', 'x', '-', 'B', '-', '+', '', '', '', 'C'],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '|', '', '', '', '|'],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '+', '-', '-', '-', '+'],
        ];

        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeData, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters;
        const pathLetters = lastUpdate.pathLetters;

        // Expected results
        const expectedLetters = 'ACB';
        const expectedPath = '@---A---+|C|+---+|+-B-x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    // Additional tests...
});
