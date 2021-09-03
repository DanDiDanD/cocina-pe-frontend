export const RUTAS = {
  home: "/",
  registro: "/registro",
  login: "/login",
  recoveryPassword: "/recoveryPassword",
  cocina: "/cocina",
  usuario: "/cocina/usuarios",
  perfil: "/cocina/usuarios/:id",
  platillo: "/cocina/platillos",
  platillo_id: "/cocina/platillos/:id",
  receta: "/cocina/recetas/:id",
  edit_receta: "/cocina/recetas/editar/:id",
  favorito: "/cocina/favoritos",
  premium: "/cocina/premium"


};

export const HEADERS = {
  headers: {
    Authorization: JSON.parse(localStorage.getItem("authData"))
      ? JSON.parse(localStorage.getItem("authData")).token
      : null,
  },
};
