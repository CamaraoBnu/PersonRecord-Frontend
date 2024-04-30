
import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: ${({ visivel }) => (visivel ? 'flex' : 'none')};
  align-items: center;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  margin-right: 10px;
`;
