import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="App">
      <Outlet />
    </main>
  );
};

export default Layout;

// Outlet é como se fosse o {children}, tudo que tiver dentro do dele vai estar sujeito as regras dele.
