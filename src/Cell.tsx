// src/Cell.tsx
import React from 'react';
import styled, { css } from 'styled-components';

interface CellProps {
    x: number;
    y: number;
    value: string;
    isCurrent: boolean;
}

const CellContainer = styled.div<{ $isPath: boolean; $isLetter: boolean; $isCurrent: boolean }>`
  width: 20px;
  height: 20px;
  text-align: center;
  vertical-align: middle;
  line-height: 20px;
  font-size: 14px;
  border: 1px solid #ccc;
  ${(props) =>
        props.$isPath &&
        css`
      background-color: #fff;
    `}
  ${(props) =>
        !props.$isPath &&
        css`
      background-color: #f0f0f0;
    `}
  ${(props) =>
        props.$isLetter &&
        css`
      background-color: #ffeb3b;
    `}
  ${(props) =>
        props.$isCurrent &&
        css`
      background-color: #8bc34a;
    `}x
`;

const Cell: React.FC<CellProps> = ({ value, isCurrent }) => {
    const isPath = value === '|' || value === '-' || value === '+' || value === 'x' || value === '@';
    const isLetter = /[A-Z]/.test(value);

    return (
        <CellContainer $isPath={isPath} $isLetter={isLetter} $isCurrent={isCurrent}>
            {value.trim() ? value : ''}
        </CellContainer>
    );
};

export default Cell;
