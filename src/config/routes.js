import MainLayout from "../layouts/MainLayout";
import BasicLayout from "../layouts/BasicLayout";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Platillos from "../pages/Platillos";
import PlatillosId from "../pages/Platillos/PlatillosId";
import Usuarios from "../pages/Usuarios";
import Perfil from "../pages/Perfil";
import Recetas from "../pages/Recetas";
import EditReceta from "../pages/Recetas/EditReceta";
import Favoritos from "../pages/Favoritos";
import { Error404 } from "../pages/Error404";
import { RUTAS } from "../config/constantes";

const routes = [
  {
    path: RUTAS.cocina,
    component: MainLayout,
    exact: false,
    routes: [
      {
        path: RUTAS.cocina,
        component: Home,
        exact: true,
      },
      {
        path: RUTAS.usuario,
        component: Usuarios,
        exact: true,
      },
      {
        path: RUTAS.perfil,
        component: Perfil,
        exact: true,
      },
      {
        path: RUTAS.platillo,
        component: Platillos,
        exact: true,
      },
      {
        path: RUTAS.platillo_id,
        component: PlatillosId,
        exact: true,
      },
      {
        path: RUTAS.receta,
        component: Recetas,
        exact: true,
      },
      {
        path: RUTAS.edit_receta,
        component: EditReceta,
        exact: true,
      },
      {
        path: RUTAS.favorito,
        component: Favoritos,
        exact: true,
      },
      {
        component: Error404,
      },
    ],
  },
  {
    path: RUTAS.home,
    component: BasicLayout,
    exact: false,
    routes: [
      {
        path: RUTAS.home,
        component: Home,
        exact: true,
      },
      {
        path: RUTAS.login,
        component: Login,
        exact: true,
      },
      {
        path: RUTAS.registro,
        component: Login,
        exact: true,
      },
      {
        component: Error404,
      },
    ],
  },
];

export default routes;
