import React, { useContext } from 'react';
import { Route, Redirect, withRouter  } from 'react-router-dom';
import { authContext } from '../providers/AuthContext';
import { expiroToken } from "../utils/auth";
import { RUTAS } from "../config/constantes";
import Home from "../pages/Home";
import { notification } from "antd";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(authContext);
  const { loading } = auth;

  if (loading) {
    return (
      <Route
        {...rest}
        render={() => {
          return <p>Loading...</p>;
        }}
      />
    );
  }
  // if loading is set to true (when our function useEffect(() => {}, []) is not executed), we are rendering a loading component;

  /* 
  if (expiroToken()) {
    notification["info"]({
      message: "La sesión ha expirado, vuelva a ingresar."
    });
  }*/

  // if (auth.data.tipo_usuario === 'user' && !expiroToken()) {
  if (auth.data === null ) {
    window.location.href = '/'
  }
      
    // }
    // return (
    //   <>
    //     <Route path={RUTAS.cocina} component={Home}/>
    //     <Redirect to={RUTAS.cocina} />
    //   </>
    // )
  
  
  return (
    <Route
      {...rest}
      render={(routeProps) => (
        // expiroToken() ? 
        // <Component {...routeProps} />
        // : 
        <Component {...routeProps} />
      )}
    />

  );
/*  we are spreading routeProps to be able to access this routeProps in the component. */
};

export default PrivateRoute;