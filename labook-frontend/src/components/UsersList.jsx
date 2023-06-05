import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const UsersList = () => {
  const [usersList, setUsersList] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth()
  const token = auth?.accessToken
console.log("aqui no user list o token é " + token)
  useEffect(() => {
    // variável de controle para fazer a quest
    let isMounted = true;
    // criando um controller para permitir abortar a request
    // const controller = new AbortController();

    const getUsersList = async (token) => {
      console.log("o token é " + token)
      try {
        const response = await axiosPrivate.get("/users/userslist", {
          //passo o controller.signal (que veio do AbortController nativo do JS)
          //como um valor do objeto OPTIONS dessa request (feita pelo axios, mas
          //poderia ser pelo FETCH nativo do JS). Dessa forma posso, caso queira,
          //cancelar essa request usando controller.abort() para não entrar em loop.
          headers: {
            Authorization: `${token}`
          },
          // signal: controller.signal
        });
        console.log(response.data)
        console.log(response.data.items);
        // se isMounted é true então a UserList será a resposta que eu recebo
        isMounted && setUsersList(response.data);
      } catch (err) {
        console.error(err);
        // se der erro, enviar o usuário para a tela de login salvando a página atual
        // (que mostra a lista de usuários) como destino a ser redirecionado ao efetuar o login
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsersList(token);

    return () => {
      // depois de executar a função setar o isMounted para false e abortar caso tenha requisições pendentes
      isMounted = false;
      // controller.abort();
    };
  }, []);
  
  return (
    <article>
      <h2>Users List</h2>
      {usersList?.length > 0 ? (
        <ul>
          {usersList.map((user, i) => (
            <li key={i}>{user?.name}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default UsersList;
