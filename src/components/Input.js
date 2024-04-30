
import styled from 'styled-components';

export const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 300px;
  ${({ readOnly }) =>
    readOnly &&
    `
    background-color: #f5f5f5;
    color: #777;
    cursor: default;
    user-select: none;
  `}
`;
