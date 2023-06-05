import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

// validar input de usuário:
// 1) ^ significa início, primeiro caractere deve ser uma letra minúscula ou maiúscula
// 2) segundo caractere em diante pode ser letra minúscula, maiúscula ou números (de 0 a 9)
// 3) precisa ter no mínimo 4 caracteres e no máximo 24 ({3,23} é para validar o último bloco,
// então temos 1 caractere do primeiro bloco + 3 a 23 caracteres do segundo bloco)
// $ significa fim
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/;

// validar input de senha:
// 1) precisa ter de 8 a 24 caracteres
// 2) precisa incluir pelo menos 1 letra minuscula, 1 letra maiuscula, 1 numero e 1 caractere
// especial (! @ # $ %)
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const REGISTER_URL = "/users/signup/";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const emailRef = useRef()

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // para o campo email
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false); //verifica se o foco está neste campo

  // para o campo nome de usuário
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false); //verifica se o foco está neste campo

  // para o campo senha
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // para o campo de repetir a senha
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // para o tooltip (eu acho)!!!!!
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // deixar o foco no campo de usuário quando carregar o componente
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // validar o input do campo user com REGEX e salvar no estado validName
  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  // validar o input do campo email com REGEX e salvar no estado validEmail
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    console.log(email);
    setValidEmail(result);
  }, [email]);

  // validar o input do campo password com REGEX e salvar no estado validPwd
  // se o input for válido e for a senha correta, atualizar o estado match
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  // após ser exibida uma msg de erro, o usuário começará
  // a digitar novamente naquele campo, para corrigir a informação
  // nesse caso vamos limpar a mensagem de erro
  useEffect(() => {
    setErrMsg("");
  }, [email, user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // se não tiver dados nos inputs mas o botão for habilitado por um JS Hack simples
    // (tipo mudar o botão pra enable via devTools) então nada deve ser enviado no submit
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Entrada inválida");
      return;
    }
    try {
      //o back end está esperando uma requisição contendo 'user' e 'pwd' no body, precisa ver
      //qual problema vai dar pq eu setei no backend pra receber 'newUserName' e 'password'
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email: email, name: user, password: pwd }),
        // {
        //   headers: { "Content-Type": "application/json" },
        //   withCredentials: true
        // }
      );
      // console.log(response.data);
      // console.log(response.accessToken);
      console.log(JSON.stringify(response)); //se não por o stringify, a resposta será Object{object}
      // setSuccess(true); // mudar para página de sucesso
      navigate(from, { replace: true });
      // posso limpar os campos do input agora, não fiz essa lógica ainda
    } catch (err) {
      if (!err?.response) {
        //se nao tiver erro mas tb não receber uma response, ou seja, nenhuma resposta
        console.log(err);
        setErrMsg("Sem resposta do servidor");
      } else if (err.response?.status === 409) {
        //se tiver erro.response e tambem o status for 409 (conflict)
        setErrMsg("Nome de usuário não disponível");
      } else {
        console.log(err);
        setErrMsg("Registro falhou, tente novamente");
      }
      errRef.current.focus(); // mudar o foco para a msg de erro
    }
  };

  return (
    <section>
      {/* se errMsg existir, a classe será errmsg, senão será offscreen */}
      {/* usar a referência errRef e mostrar a mensagem de erro */}
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
        {errMsg}
      </p>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Nome:
          <span className={validName ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validName || !user ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          required
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
        />
        {/* aria-describedby chama uma tooltip, definida no parágrafo abaixo */}
        <p
          id="uinote"
          className={
            userFocus && user && !validName ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          4 a 24 caracteres.
          <br />
          Precisa começar com uma letra.
          <br />
          Letras, numeros, - e _ permitidos.
        </p>

        <label htmlFor="email">
          Email:
          <span className={validEmail ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validEmail || !email ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="text"
          id="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          required
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          aria-invalid={validEmail ? "false" : "true"}
          aria-describedby="uidnote"
        />
        {/* aria-describedby chama uma tooltip, definida no parágrafo abaixo */}
        <p
          id="uinote"
          className={
            emailFocus && email && !validEmail ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          4 a 24 caracteres.
          <br />
          Precisa começar com uma letra.
          <br />
          Letras, numeros, - e _ permitidos.
        </p>

        <label htmlFor="password">
          Password:
          <span className={validPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validPwd || !pwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          required
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          // campos tipo "password" não permitem autocomplete
          // não usamos ref aqui, pois não queremos o foco neste campo ao carregar o componente
        />
        {/* aria-describedby chama uma tooltip, definida no parágrafo abaixo */}
        <p
          id="uinote"
          className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          8 a 24 caracteres.
          <br />
          Precisa incluir pelo menos
          <br />
          1 letra maíuscula
          <br />
          1 letra minúscula
          <br />
          1 número
          <br />1 caractere especial (! @ # $ %)
        </p>

        <label htmlFor="confirm_pwd">
          Confirmar Password:
          <span className={validMatch && matchPwd ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          required
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
        />
        <p
          id="confirmnote"
          className={matchFocus && !validMatch ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Confirme a senha informada
        </p>

        {/* Não preciso passar type=submit pois se só tem 1 botão em um form, o padrão dele será submit */}
        <button
          disabled={!validName || !validPwd || !validMatch ? true : false}
        >
          Registrar
        </button>
      </form>

      <p>
        Já é registrado?
        <br />
        <span className="line">
          {/* alterar para LINK do RRD */}
          <Link to="/login">Login</Link>
        </span>
      </p>
    </section>
  );
};

export default Register;
