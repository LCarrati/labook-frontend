import { useRef, useState, useEffect } from "react";
// import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";

import axios from "../api/axios";
import Register from "./Register";
const LOGIN_URL = "/users/login/";

const Login = () => {
  // const { setAuth } = useContext(AuthContext);
  // troquei todo esse código do useContext por um custom hook
  const { persist, setPersist, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // para alterar o foco quando necessário
  const userRef = useRef(); //ao carregar o component
  const errRef = useRef(); //ao apresentar um erro

  const [user, setUser] = useLocalStorage("user", ""); //useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  // const [success, setSuccess] = useState(false); //só como exemplo

  // mudando foco para o campo username ao carregar o componente
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // ao alterar o valor no input username ou password, limpar a msg de erro
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  // recebo o (e) por padrão mesmo que não tenha declarado, pois é padrão do submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response));
      // console.log(JSON.stringify(response?.data));
      // console.log(JSON.stringify(response));
      const accessToken = response?.data?.token;
      console.log('a merda do token é ' + accessToken)
      const role = response?.data?.role; // (se tiver definido as roles no backend, vai receber um array
      const name = response?.data?.name
      console.log("a merda do name é " + name)
      // com os valores das roles (os números))
      //console.log(roles);
      //console.log({ user, pwd, accessToken, roles });
      setAuth({ user, name, pwd, accessToken, role }); // colocar roles aí no bolo tambem
      setUser("");
      setPwd("");
      navigate(from, { replace: true }); // ao logar com sucesso ir pra página onde estava ou para a principal (setado na variavel 'from', e mudar o histórico)
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist(true);
    // setPersist((prev) => !prev);
    console.log(persist);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
        {errMsg}
      </p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {" "}
        {/* não preciso passar parâmetro, pois o submit envia por padrão o event! */}
        <label htmlFor="username">Usuário:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user} //isso é importante se eu quiser limpar o input
          required
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd} //isso é importante se eu quiser limpar o input
          required
        />
        <button>Login</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="perist">Manter-se logado</label>
        </div>
      </form>
      <p>
        Ainda não criou sua conta?
        <br />
        <span className="line">
          {/* aqui deve ser um LINK do RRD */}
          <Link to="/register">Register</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;
