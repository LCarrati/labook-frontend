import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    // deu um erro no react, dizendo "memory leak ao alterar um componente desmontado"
    // para resolver criamos uma varíavel para só realizar essa lógica se o componente
    // estiver montado.
    let isMounted = true;

    const verifyRefreshToken = async () => {
      // enviar o RT com o cookie para o backend e tentar obter um novo AT
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        // se isMounted for true então altero o estado (corrige aquele erro do memory leak)
        isMounted && setIsLoading(false);
      }
    };

    // só chamar a função acima se eu não tiver um AT (se eu já tenho, não preciso pedir outro)
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    //cleanup function do useEffect, também para evitar o erro do memory leak
    //mudo o isMounted para false
    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`AT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return (
    <>
      {!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}
      {/* Outlet representa as rotas protegidas que estão aninhadas dentro do PersistLogin (ver no arquivo das rotas) */}
    </>
  );
};

export default PersistLogin;
