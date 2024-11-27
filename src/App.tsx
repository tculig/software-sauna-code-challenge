import React from 'react';
import styled from 'styled-components';
import Maze from './Maze';

const AppContainer = styled.div`
  text-align: center;
  margin: 20px;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <h1>Maze Traversal Game</h1>
      <Maze />
    </AppContainer>
  );
};

export default App;
