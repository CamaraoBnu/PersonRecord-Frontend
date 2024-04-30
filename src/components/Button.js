
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: ${({ danger }) => (danger ? '#dc3545' : '#007bff')};
  color: #fff;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

export const Button = ({ children, onClick, disabled, danger }) => (
  <StyledButton onClick={onClick} disabled={disabled} danger={danger}>
    {children}
  </StyledButton>
);
