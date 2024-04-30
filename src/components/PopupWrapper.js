import React, { useState } from 'react';
import styled from 'styled-components';

const PopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid black;
`;

const Popup = ({ message, onClose }) => {
  return (
    <PopupWrapper>
      <p>{message}</p>
      <button onClick={onClose}>Fechar</button>
    </PopupWrapper>
  );
};

export default Popup;
