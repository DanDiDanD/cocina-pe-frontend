import React from "react";
import { Route, Redirect } from "react-router-dom";
import { expiroToken } from "../utils/auth";
import { RUTAS } from "../config/constantes";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        expiroToken() ? <Component {...props} /> : <Redirect to={RUTAS.home} />// Si está logueado te redirecciona a asistencia
      }
    />
  );
};

export default PublicRoute;
