import useMazeTraverser, { TraversalState } from './useMazeTraverser';
import { vi } from 'vitest';
import { act } from 'react';
import { transformMap } from '../util';
import { renderHook } from '@testing-library/react';

describe('useMazeTraverser Hook valid inputs', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('A basic example', async () => {
        const mazeData = `
@---A---+
        |
x-B-+   C
    |   |
    +---+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'ACB';
        const expectedPath = '@---A---+|C|+---+|+-B-x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    test('Go straight through intersections', async () => {
        const mazeData = `
@
| +-C--+
A |    |
+---B--+
  |      x
  |      |
  +---D--+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'ABCD';
        const expectedPath = '@|A+---B--+|+--C-+|-||+---D--+|x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    test('Letters may be found on turns', async () => {
        const mazeData = `
@---A---+
        |
x-B-+   |
    |   |
    +---C`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'ACB';
        const expectedPath = '@---A---+|||C---+|+-B-x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    test('Do not collect a letter from the same location twice', async () => {
        const mazeData = `
    +-O-N-+
    |     |
    |   +-I-+
@-G-O-+ | | |
    | | +-+ E
    +-+     S
            |
            x`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'GOONIES';
        const expectedPath = '@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    test('Keep direction, even in a compact space', async () => {
        const mazeData = `
 +-L-+
 |  +A-+
@B+ ++ H
 ++    x`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'BLAH';
        const expectedPath = '@B+++B|+-L-+A+++A-+Hx';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });

    test('Ignore stuff after end of path', async () => {
        const mazeData = `
@-A--+
     |
     +-B--x-C--D`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const collectedLetters = lastUpdate.collectedLetters.join('');
        const pathLetters = lastUpdate.pathLetters.join('');

        // Expected results
        const expectedLetters = 'AB';
        const expectedPath = '@-A--+|+-B--x';

        expect(collectedLetters).toBe(expectedLetters);
        expect(pathLetters).toBe(expectedPath);
    });
});

describe('useMazeTraverser Hook invalid inputs', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('Missing start character', async () => {
        const mazeData = `
     -A---+
          |
  x-B-+   C
      |   |
      +---+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Start character "@" not found.'));
    });

    test('Missing end character', async () => {
        const mazeData = `
   @--A---+
          |
    B-+   C
      |   |
      +---+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: End character "x" not found.'));
    });

    test('Multiple starts 1', async () => {
        const mazeData = `
   @--A-@-+
          |
  x-B-+   C
      |   |
      +---+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Multiple starts "@" found.'));
    });

    test('Multiple starts 2', async () => {
        const mazeData = `
   @--A---+
          |
          C
          x
      @-B-+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Multiple starts "@" found.'));
    });

    test('Multiple starts 3', async () => {
        const mazeData = `
   @--A--x

  x-B-+
      |
      @`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Multiple starts "@" found.'));
    });

    test('Fork in path', async () => {
        const mazeData = `
        x-B
          |
   @--A---+
          |
     x+   C
      |   |
      +---+`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Fork in path found.'));
    });

    test('Broken path', async () => {
        const mazeData = `
    @--A-+
         |
         
         B-x`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Broken path found.'));
    });

    test('Multiple starting paths', async () => {
        const mazeData = `
  x-B-@-A-x`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Multiple starting paths found.'));
    });

    test('Fake turn', async () => {
        const mazeData = `
  @-A-+-B-x`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Fake turn found.'));
    });

    test('Outside bounds', async () => {
        const mazeData = `
   @--A---+
          |
          C
          |
         x|`;
        const mazeGrid = transformMap(mazeData);
        const onUpdate = vi.fn<(state: TraversalState) => void>();

        // Render the hook
        const { result } = renderHook(() => useMazeTraverser(mazeGrid, onUpdate));

        // Start traversal
        act(() => {
            result.current.startTraversal();
        });
        vi.runAllTimers();

        const lastUpdate = onUpdate.mock.calls[onUpdate.mock.calls.length - 1][0];
        const errors = lastUpdate.errors;

        expect(errors[0]).toStrictEqual(new Error('Invalid maze: Path leades outside bounds.'));
    });
});
