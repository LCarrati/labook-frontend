import axios from "../api/axios";
import useAuth from "./useAuth";

// quando o AT estiver vencido vou receber um erro UNAUTHORIZED,
//então uso esse hook para, através do RT gerar um novo AT, atualizar a request com esse novo AT.
// Essa nova request será então reenviada com os novos dados do estado Auth que foram atualizados aqui.
const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // envio a request de atualizar AT
    const response = await axios.get("/api/refresh", {
      withCredentials: true
    });
    // atualizo o estado Auth com o novo AT
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return {
        ...prev,
        roles: response.data.roles,
        accessToken: response.data.accessToken
      };
    });
    // disponibilizo o novo AT para ser usado além da nova request
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
