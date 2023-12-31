// Importa as bibliotecas necessárias do React
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Importa a instância configurada do Axios do arquivo api.js
import api from '../api'; // Caminho para o arquivo api.js
import { useUser } from '../UserContext.js';

// Importa os estilos para esta página
import '../css/reset.css';
import '../css/index.css';
import '../css/login.css';

// Importa componentes de cabeçalho e rodapé
import Header from './header';
import Footer from './footer';


// Define o componente funcional LoginForm
function LoginForm() {

  // Estados para controlar os campos de login e senha
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [linkClicado, setLinkClicado] = useState(false);
  const [linkClicado2, setLinkClicado2] = useState(false);

  // Obtém a função navigate
  const navigate = useNavigate();
  const { setUserData } = useUser();

  // Função assíncrona para lidar com o login do usuário
  async function handleLogin(e) {
    e.preventDefault(); // Evita o comportamento padrão do formulário

    try {
      // Chama a API para fazer login com as credenciais fornecidas
      const response = await api.post('/user', { login, senha });
      console.log('Resposta da API:', response.data);
      const user = response.data.user[0];

      const userName = response.data.user[0].nm_usuario;
      const userCargo = response.data.user[0].cd_cargo;

      // Atualiza os estados com os dados do usuário e o estado de login
      setIsLoggedIn(true);
      setUserData(user);

      const userData = {
        cd_cargo: response.data.user[0].cd_cargo,
        cd_matricula_usuario: response.data.user[0].cd_matricula_usuario,
        cd_senha_usuario: response.data.user[0].cd_senha_usuario,
        nm_usuario: response.data.user[0].nm_usuario,
      };
      /////////////////////////////// PARTE QUE PEGA AS INFORMAÇÕES DO USER
      localStorage.setItem('userData', JSON.stringify(user));
      // Obtém dados do usuário do armazenamento local (localStorage)
      ///////////////////// PARA ACESSAR COLE ESSA LINHA ABAIXO NO CODIGO E FAÇA userData.cd_matricula por exemplo
      //const userData = JSON.parse(localStorage.getItem('userData'));

      // Imprime informações para depuração
      console.log('Login:', login);
      console.log('Senha:', senha);
      console.log('Nome do usuário:', userName);
      console.log('Cargo do usuário:', userCargo);

      switch (userCargo) {
        case 'ADMCBT':
          setIsLoggedIn(true);
          setLoginError(false);
          navigate('/perfil', { state: { userData } }); // Redireciona para a página específica para alunos
          break;
        default:
          setIsLoggedIn(true);
          setLoginError(false);
          navigate('/main', { state: { userData } }); // Redireciona para a página principal padrão
      }

    } catch (error) {
      // Trata erros de login, define o estado de login como falso e exibe uma mensagem de alerta
      setIsLoggedIn(false);
      setLoginError(true);
      alert("Login ou senha incorretos");
      console.error('Erro ao realizar login:', error);
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLogin('');
    setSenha('');
  };
  const handleClique = () => {
    setLinkClicado(true);
  };
  const handleClique2 = () => {
    setLinkClicado2(true);
  };

  // Retorna a estrutura do componente JSX
  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="main-content">
          {/* Conteúdo da página main pode ser renderizado aqui */}
        </div>
      ) : (
        <div>
          <Header />
          <div className="formulario">
            <div className="formulario-login container">
              <h3 className="formulario-login__titulo">Iniciar Sessão</h3>
              <form className="formulario-login_form" onSubmit={handleLogin}>
                <div className="formulario-login__input-container">
                  <input
                    name="login"
                    id="login"
                    className="input inputs"
                    type="text"
                    placeholder="Login"
                    required
                    oninput="formatarProntuario(this)"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                  <label className="input-label" htmlFor="login">
                    Escreva seu prontuario
                  </label>
                  <span className="input-message-error">Este campo não é válido</span>
                  <div class="hint">Formato esperado: CB1234567</div>
                </div>
                <div className="formulario-login__input-container">
                  <input
                    name="senha"
                    id="senha"
                    className="input inputs"
                    type="password"
                    placeholder="Senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <label className="input-label" htmlFor="senha">
                    Escreva sua senha
                  </label>
                  <span className="input-message-error">Este campo não é válido</span>
                </div>
                <input
                  className="boton-formulario-login"
                  type="submit"
                  name="enviar"
                  id="enviar-login"
                  value="Entrar"
                />
                <br />
                {linkClicado ? (
                  <p>Dirija-se a recepção para efetuar seu cadastro.</p>
                ) : (
                  <a href="#" onClick={handleClique}>
                    Cadastrar-se
                  </a>
                )}
                <br />
                <br />
                {linkClicado2 ? (
                  <p>Dirija-se a recepção para efetuar redefinir a senha.</p>
                ) : (
                  <a href="#" onClick={handleClique2}>
                    Esqueceu a senha?
                  </a>
                )}
              </form>
              {loginError && <p className="error-message">Login ou senha incorretos.</p>}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
}

// Exporta o componente LoginForm para ser utilizado em outras partes do código
export default LoginForm;