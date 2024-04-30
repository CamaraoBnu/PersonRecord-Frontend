
import styled from 'styled-components';

export const ButtonWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const ButtonWrapperSave = styled.div`
  display: ${({ visivel }) => (visivel ? 'flex' : 'none')};
  margin-bottom: 20px;
`;

export const ButtonWrapperCancel = styled.div`
  display: ${({ visivel }) => (visivel ? 'flex' : 'none')};
  margin-bottom: 20px;
`;

export const ButtonWrapperConfirm = styled.div`
  display: ${({ visivel }) => (visivel ? 'flex' : 'none')};
  margin-bottom: 20px;
`;
