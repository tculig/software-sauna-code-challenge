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
            <Button onClick={onStart} disabled={isTraversing} data-testid="start-button">
                {isTraversing ? 'Traversing...' : 'Start Traversal'}
            </Button>
            <CollectedLetters>
                Letters: <span>{collectedLetters.join('')}</span>
            </CollectedLetters>
            <CollectedLetters>
                Path as characters : <span>{pathLetters.join('')}</span>
            </CollectedLetters>
        </>
    );
};

export default Controls;
