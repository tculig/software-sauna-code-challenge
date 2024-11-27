import styled from 'styled-components';

interface ControlsProps {
    collectedLetters: string[];
    pathLetters: string[];
    onStart: () => void;
    isTraversing: boolean;
}

const Button = styled.button`
  padding: 10px 20px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const CollectedLetters = styled.p`
  font-size: 18px;
`;

const Controls: React.FC<ControlsProps> = ({ collectedLetters, pathLetters, onStart, isTraversing }) => {
    return (
        <>
            <Button onClick={onStart} disabled={isTraversing}>
                {isTraversing ? 'Traversing...' : 'Start Traversal'}
            </Button>
            <CollectedLetters>
                Letters: {collectedLetters.join('')}
            </CollectedLetters>
            <CollectedLetters>
                Path as characters : {pathLetters.join('')}
            </CollectedLetters>
        </>
    );
};

export default Controls;
