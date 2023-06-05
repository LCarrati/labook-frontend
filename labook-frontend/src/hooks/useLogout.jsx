import axiosPrivate from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
  //   console.log("afffeeeee faz logout kct");
  //   try {
  //     const response = await axiosPrivate.get("/api/logout", {
  //       withCredentials: true
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  };

  return logout;
};

export default useLogout;
