import { render, screen, fireEvent } from '@testing-library/react';
import Maze from '.';
import { transformMap } from '../../util';
import { vi } from 'vitest';
import { act } from 'react';


describe('Maze', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('Basic test', async () => {
        const mazeData = `
@
| +-C--+
A |    |
+---B--+
  |      x
  |      |
  +---D--+`;
        const mazeGrid = transformMap(mazeData);
        render(<Maze mazeGrid={mazeGrid} />);


        act(() => {
            const button = screen.getByTestId('start-button');
            fireEvent.click(button);
            vi.runAllTimers();
        });


        const expectedLetters = 'ABCD';
        const expectedPath = '@|A+---B--+|+--C-+|-||+---D--+|x';

        await screen.findByText(expectedLetters);
        await screen.findByText(expectedPath);
    });
});
