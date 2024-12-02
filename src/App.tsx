import styled from 'styled-components';
import Maze from './components/Maze';
import { transformMap } from './util';

const AppContainer = styled.div`
  text-align: center;
  margin: 20px;
`;
const mazeData = `
  @
  | +-C--+
  A |    |
  +---B--+
    |      x
    |      |
    +---D--+
 `;
const mazeGrid = transformMap(mazeData);

const App: React.FC = () => {
  return (
    <AppContainer>
      <h1>Maze Traversal</h1>
      <Maze mazeGrid={mazeGrid} />
    </AppContainer>
  );
};

export default App;
