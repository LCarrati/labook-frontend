import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // interceptors fazem coisas antes da request ser processada (seja antes do envio ou antes da resposta)
    // nesse caso, o axiosPrivate é para requisições que PRECISAM DE AUTORIZAÇÃO, então vamos incluir essa
    // autorização... (attach)

    // antets de enviar faça:
    const requestIntercept = axiosPrivate.interceptors.request.use(
      // se na request não tiver um header "Authorization" então é a primeira request, adicionar a ela um header com "Bearer AccessToken"
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      }, // em caso de erro, rejeitar a promise pelo motivo 'error'
      (error) => Promise.reject(error)
    );

    // OBS essa estrutura está nas DOCs do axios, é padrão do interceptor.

    // antes de disponibilizar a resposta faça:
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // a resposta será a resposta, a não ser que essa resposta tenha erro
      (response) => response,
      // em caso de  erro:
      async (error) => {
        // error é um objeto com vários parâmetros: (dar um console.log(error) pra ver todas, tem muita informação aqui)
        // config guarda as OPTIONS da request que foi feita
        // response guarda as propriedades da resposta

        // prevRequest recebe a request que foi feita e gerou o erro
        const prevRequest = error?.config;
        // se o status da resposta for 403 e na request anterior o valor de SENT for 'false' (ou sent não existir), é pq essa é a primeira requisição
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          // alterar prevRequest.sent para true (sinalizar assim que essa será a segunda tentativa de enviar a requisição)
          prevRequest.sent = true;
          // gerar novo AT (refresh = useRefreshToken())
          const newAccessToken = await refresh();
          // adicionar o novo AT ao header
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          // envio a requisição através do axiosPrivate utilizando toda a prevRequest (agora atualizada) como config.
          return axiosPrivate(prevRequest);
        }
        // em caso de erro, rejeitar a promise pelo motivo 'error'
        return Promise.reject(error);
      }
    );

    // depois de tudo feito, retiro os interecptors (igual o EventListener do JS, é bom retirar pra não dar ruim)
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
