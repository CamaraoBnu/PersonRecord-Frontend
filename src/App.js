import React, { useState } from 'react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { ButtonWrapper, ButtonWrapperSave, ButtonWrapperCancel, ButtonWrapperConfirm } from './components/ButtonWrapper';
import { InputWrapper, Label } from './components/InputWrapper';
import { ButtonEnum } from './enums/ButtonEnum';
import { useLastButton, LastButtonProvider } from './contexts/LastButtonContext';
import axios from 'axios';
import styled from 'styled-components';
import Popup from './components/PopupWrapper'; // Importando o componente Popup

const Title = styled.h2`
  margin-bottom: 20px;
`;

const App = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [number, setNumber] = useState('');
  const [comp, setComp] = useState('');
  const [editavel, setEditavel] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [cpfBuscado, setCpfBuscado] = useState('');

  const { lastButton, setLastButton } = useLastButton();

  
  const formatCpf = (value) => {
    return value
      .replace(/\D/g, '') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 
  };

  const formatCep = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2');
  };
  
  const generateCSVReport = async () => {
    try {
      const response = await axios.get('http://localhost:8080/person/getAll'); // Rota para obter todas as pessoas cadastradas
      const persons = response.data;

       // Nome das colunas
       const columnNames = 'Nome,Telefone,CPF,CEP,Bairro,Município,Estado,Número,Complemento\n';

       // Formatar os dados como CSV
       const csvData = `${columnNames}${persons.map((person) => {
         return `${person.name},${person.phone},${person.cpf},${person.cep},${person.district},${person.city},${person.state},${person.number},${person.comp}`;
       }).join('\n')}`;

      // Criar um objeto Blob com os dados CSV
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      // Criar um link temporário para download do arquivo CSV
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_pessoas.csv');
      document.body.appendChild(link);

      // Simular o clique no link para iniciar o download
      link.click();

      // Remover o link temporário
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao gerar relatório CSV:', error);
      // Adicione a lógica para lidar com erros aqui, como exibir uma mensagem de erro para o usuário
    }
  };

  const handleSearchCep = async () => {
    try {
      const formattedCep = cep.replace(/\D/g, '');
      const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = response.data;
      // Verifica se os dados foram retornados corretamente
      if (!data.erro) {
        // Atualiza os estados com os dados retornados
        setDistrict(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
        setComp(data.complemento);
      } else {
        console.error('CEP não encontrado');
        // Adicione a lógica para lidar com o CEP não encontrado, como exibir uma mensagem para o usuário
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      // Adicione a lógica para lidar com erros de requisição
    }
  };

  const handleNovo = () => {
    setEditavel(true);
    setLastButton(ButtonEnum.ADICIONAR);
  };

  const handleCancelar = () => {
    setEditavel(false);
    setExcluindo(false);

    setName('');
    setPhone('');
    setCpf('');
    setCep('');
    setDistrict('');
    setCity('');
    setState('');
    setNumber('');
    setComp('');
  };

  const handleExcluir = () => {
    setEditavel(false);
    setExcluindo(true);
    
    setLastButton(ButtonEnum.EXCLUIR);
  };

  const handleConfirmarExclusao = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/person/delete/teste`);
      const { data } = response;
      if (data) {
        
        console.error('foi');
      } else {
          console.error('CPF não encontrado');
          setPopupMessage('CPF não encontrado');
          setShowErrorPopup(true);
          setCpf('');
      }
    } catch (error) {
      console.error('Erro ao buscar pessoa para deletar:');
      // Adicione a lógica para lidar com erros aqui
    }
  };

  const handleSalvar = async () => {
    if (editavel && !excluindo && lastButton === ButtonEnum.ADICIONAR) {
      try {
        const response = await axios.post('http://localhost:8080/person/create', {
          name,
          phone,
          cpf,
          cep,
          district,
          city,
          state,
          number,
          comp
        });
        console.log('Dados salvos:', response.data);
        setPopupMessage('Dados salvos com sucesso!');
        setShowSuccessPopup(true);
        // Adicione qualquer lógica adicional aqui, como atualizar o estado após salvar
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        setPopupMessage('Erro ao salvar dados.');
        setShowErrorPopup(true);
        // Adicione a lógica para lidar com erros aqui, como exibir uma mensagem de erro para o usuário
      }
    }
    if (editavel && !excluindo && lastButton === ButtonEnum.ATUALIZAR) {
      if(cpf == cpfBuscado) {
        try {
          const response = await axios.put(`http://localhost:8080/person/update/${cpf}`, {
            name,
            phone,
            cpf,
            cep,
            district,
            city,
            state,
            number,
            comp
          });
          console.log('Dados atualizados:', response.data);
          setPopupMessage('Dados atualizados com sucesso!');
          setShowSuccessPopup(true);
          // Adicione qualquer lógica adicional aqui, como atualizar o estado após salvar
        } catch (error) {
          console.error('Erro ao atualizar dados:', error);
          setPopupMessage('Erro ao atualizar dados.');
          setShowErrorPopup(true);
          // Adicione a lógica para lidar com erros aqui, como exibir uma mensagem de erro para o usuário
        }
      } else {
        console.error('O CPF não pode ser alterado');
        setPopupMessage('O CPF não pode ser alterado');
        setShowErrorPopup(true);
        setCpf(cpfBuscado);
      }
      
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
  };

  const handleDeletar = () => {
    // Implemente a lógica para deletar o registro aqui
  };

  const handleAtualizar = () => {
    setEditavel(true); // Habilita a edição dos campos
    setExcluindo(false);
    setLastButton(ButtonEnum.ATUALIZAR);
  };

  const handleListar = () => {
    generateCSVReport();
    setLastButton(ButtonEnum.LISTAR);
  };

  const handleBuscarPessoa = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/person/get/${cpf}`);
      const { data } = response;
      if (data) {
        setName(data.name);
        setPhone(data.phone);
        setCep(data.cep);
        setDistrict(data.district);
        setCity(data.city);
        setState(data.state);
        setNumber(data.number);
        setComp(data.comp);
        setCpfBuscado(data.cpf);
      } else {
          console.error('CPF não encontrado');
          setPopupMessage('CPF não encontrado');
          setShowErrorPopup(true);
          setCpf('');
      }
    } catch (error) {
      console.error('Erro ao buscar pessoa:', error);
      // Adicione a lógica para lidar com erros aqui
    }
  };

  const isFormDirty = () => {
    return (
      name !== '' ||
      phone !== '' ||
      cep !== '' ||
      district !== '' ||
      city !== '' ||
      state !== '' ||
      number !== '' ||
      comp !== ''
    );
  };

  return (
    <div>
      <Title>Cadastro de Pessoa Física</Title>
      <ButtonWrapper>
        <Button onClick={handleNovo} disabled={editavel || excluindo}>
          Adicionar
        </Button>
        <Button onClick={handleAtualizar} disabled={editavel || excluindo}>
          Consulta/Atualizar
        </Button>
        <Button onClick={handleListar} disabled={editavel || excluindo}>
          Listar
        </Button>
        <Button danger onClick={handleExcluir} disabled={editavel}>
          Excluir
        </Button>
      </ButtonWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>CPF:</Label>
        <Input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          maxLength={14}
          disabled={!editavel && !excluindo}
        />
        {(lastButton === ButtonEnum.ATUALIZAR || lastButton === ButtonEnum.EXCLUIR) && (
          <Button onClick={handleBuscarPessoa}>Buscar Pessoa</Button>
        )}
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Nome:</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Telefone:</Label>
        <Input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={14}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>CEP:</Label>
        <Input
          type="text"
          value={formatCep(cep)}
          onChange={(e) => setCep(e.target.value)}
          maxLength={9}
          disabled={!editavel || excluindo}
        />
        <Button onClick={handleSearchCep}>Buscar CEP</Button>
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Bairro:</Label>
        <Input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Município:</Label>
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Estado:</Label>
        <Input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Número:</Label>
        <Input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <InputWrapper visivel={editavel || excluindo}>
        <Label>Complemento:</Label>
        <Input
          type="text"
          value={comp}
          onChange={(e) => setComp(e.target.value)}
          maxLength={255}
          disabled={!editavel || excluindo}
        />
      </InputWrapper>
      <ButtonWrapperCancel visivel={editavel || excluindo}>
        <Button onClick={handleCancelar} danger>
          Cancelar
        </Button>
      </ButtonWrapperCancel>
      <ButtonWrapperSave visivel={editavel}>
        <Button onClick={handleSalvar} disabled={!isFormDirty() && lastButton === ButtonEnum.ATUALIZAR}>Salvar</Button>
      </ButtonWrapperSave>
      <ButtonWrapperConfirm visivel={excluindo}>
        <Button onClick={handleConfirmarExclusao} danger>
          Confirmar Exclusão do Registro
        </Button>
      </ButtonWrapperConfirm>
      {showSuccessPopup && <Popup message={popupMessage} onClose={closePopup} />}
      {showErrorPopup && <Popup message={popupMessage} onClose={closePopup} />}
    </div>
  );
};

export default App;
