import React, { useState, useEffect } from 'react';
import Header from './header.js';
import Footer from './footer.js';
import '../css/cadastroChave.css';

import { useNavigate, useLocation } from 'react-router-dom'; // Importa useNavigate

import api from '../api';

function DeletarUser() {

    const [mensagem, setMensagem] = useState('');

    const [matricula, setMatricula] = useState('');
    const [cargo, setcargo] = useState('');

    const [cdcargo, setCdcargo] = useState('');
    const [cargoSelecionado, setCargoSelecionado] = useState(false);

    const [prof, setProf] = useState('');
    const [nome, setNome] = useState('');

    // Obtém a função navigate do React Router para redirecionamento
    const navigate = useNavigate();
    const location = useLocation();

    // Obtém dados do usuário do armazenamento local (localStorage)
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Define o prontuário e o nome do usuário com base nos dados do usuário, se disponíveis
    const prontuario = userData ? userData.cd_matricula_usuario : 'N/A';
    const userName = userData ? userData.nm_usuario : 'Usuário';

    const handleDeletarUsuario = async () => {
        try {
            const response = await api.delete(`/user/${matricula}`);
            setMensagem('Usuário deletado com sucesso!');
            console.log("Usuário deletado:", response.data);
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            setMensagem('Erro ao deletar usuário.');
        }
    };

    const buscarNome = async () => {
        try {
            // Faz uma chamada à API, com o código padrão de professores como parâmetro
            const response = await api.get(`/user/cargo/${cdcargo}`);
            // Obtém os dados da resposta da API
            const dados = response.data;
            // Verifica se a resposta da API contém dados do usuário
            if (dados.usuario && dados.usuario.length > 0) {
                // Obtém o nome do professor
                const nome = dados.usuario[0].nm_usuario;
                // Imprime o nome do professor
                console.log("nome user:", dados.usuario);
                // Retorna o nome do estudante
                return dados.usuario;
            } else {
                // Erro: a resposta da API não contém dados do usuário
                console.error('Resposta da API não contém dados de usuário:', dados.usuario);
                // Retorna 'Nome não encontrado'
                return 'Nome não encontrado';
            }
        } catch (error) {
            // Erro ao fazer a chamada à API
            console.error('Erro ao buscar nome do Professor:', error);
            // Retorna 'Nome não encontrado'
            return 'Nome não encontrado';
        }
    }

    const buscarCargo = async () => {
        try {
            // Faz uma chamada à API, com o código padrão de professores como parâmetro
            const response = await api.get(`/user/tbcargo`);
            // Obtém os dados da resposta da API
            const dadosCargo = response.data;
            // Verifica se a resposta da API contém dados do usuário
            if (dadosCargo && dadosCargo.length > 0) {
                // Obtém o nome do professor
                const cargo = dadosCargo[0].cd_cargo;
                // Imprime o nome do professor
                console.log("nome:", cargo);
                // Retorna o nome do estudante
                return dadosCargo;
            } else {
                // Erro: a resposta da API não contém dados do usuário
                console.error('Resposta da API não contém dados de usuário:', dadosCargo);
                // Retorna 'Nome não encontrado'
                return 'Nome não encontrado';
            }
        } catch (error) {
            // Erro ao fazer a chamada à API
            console.error('Erro ao buscar nome do Professor:', error);
            // Retorna 'Nome não encontrado'
            return 'Nome não encontrado';
        }
    }
    const optionComboBoxCargo = async () => {
        try {
            // Chama a função para buscar os nomes dos professores na API
            const arrayCargos = await buscarCargo();

            // Obtém a referência ao elemento select
            const selectCargo = document.querySelector('select[name="select-cargo"]');

            // Limpa as opções existentes no select
            selectCargo.innerHTML = "";

            // Adiciona uma opção padrão
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = "Selecione um cargo";
            selectCargo.appendChild(defaultOption);

            // Adiciona as opções com os nomes dos professores
            arrayCargos.forEach((cargo) => {
                const option = document.createElement("option");
                option.value = cargo.cd_cargo;
                option.text = cargo.ds_cargo;
                selectCargo.appendChild(option);
            });

            // Adiciona um ouvinte de evento para capturar a matrícula selecionada
            selectCargo.addEventListener('change', async function () {
                // Obtém o código do cargo selecionado
                const cargoSelecionado = arrayCargos.find(cargo => cargo.cd_cargo === this.value)?.cd_cargo;
                console.log('Código do cargo selecionado:', cargoSelecionado);
                setCdcargo(cargoSelecionado);
                setCargoSelecionado(true);
                await buscarNome();
            });

        } catch (error) {
            // Trate os erros, se necessário
            console.error('Erro ao preencher as opções do combo box:', error);
        }

    }

    const optionComboBoxProf = async () => {
        try {
            // Chama a função para buscar os nomes dos professores na API
            const arrayProfessores = await buscarNome();

            // Obtém a referência ao elemento select
            const selectProf = document.querySelector('select[name="select-prof"]');

            // Limpa as opções existentes no select
            selectProf.innerHTML = "";

            // Adiciona uma opção padrão
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.text = "Selecione um professor";
            selectProf.appendChild(defaultOption);

            // Adiciona as opções com os nomes dos professores
            arrayProfessores.forEach((professor) => {
                const option = document.createElement("option");
                option.value = professor.cd_matricula_usuario;
                option.text = professor.nm_usuario;
                selectProf.appendChild(option);
            });

            // Adiciona um ouvinte de evento para capturar a matrícula selecionada
            // Adiciona um ouvinte de evento para capturar a matrícula selecionada
            // Adiciona um ouvinte de evento para capturar a matrícula selecionada
            selectProf.addEventListener('change', function (e) {
                console.log('Valor selecionado:', e.target.value);
                console.log('Array de professores:', arrayProfessores);
                
                // Obtém a matrícula do professor selecionado
                const matriculaSelecionada = arrayProfessores.find(professor => professor.cd_matricula_usuario === e.target.value)?.cd_matricula_usuario;
                
                console.log('Matrícula encontrada:', matriculaSelecionada);
                setMatricula(matriculaSelecionada);
            });
            
            



        } catch (error) {
            // Trate os erros, se necessário
            console.error('Erro ao preencher as opções do combo box:', error);
        }
    }


    useEffect(() => {

        optionComboBoxCargo();
        if (cargoSelecionado) {
            optionComboBoxProf();
        }
    }, [cargoSelecionado]);


    return (
        <div>
            <Header />
            <div className="formulario_cadastro_area">
                <div className="formulario-cadastro container">
                    <div className='container_botao'>
                        <a className="local_botao" href="/main"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/main', { state: { user: userData } })
                            }}>Voltar:</a>
                    </div>

                    <h3 className="formulario-cadastro__titulo">Deletar Usuario:</h3>
                    <form action="" className="formulario-cadastro_form">
                        {mensagem && <p className='mensagem'>{mensagem}</p>}

                        <div className='formulario-approved__input-container'>
                            <label for="select-cargo" className='input-label'>Cargo:</label>
                            <select name="select-cargo" className="input inputs"
                                onChange={(e) => setcargo(e.target.value)}>
                                <option value="cargo">Cargo X</option>
                            </select>
                        </div>

                        <div className='formulario-approved__input-container'>
                            <label for="select-prof" className='input-label'>Professor:</label>
                            <select name="select-prof" className="input inputs"
                                onChange={(e) => setProf(e.target.value)}>
                                <option value="professor">Usuario X</option>
                            </select>
                        </div>


                        <button
                            className="boton-formulario-approved"
                            type="button"
                            onClick={handleDeletarUsuario}
                        >
                            Deletar
                        </button>

                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default DeletarUser;

