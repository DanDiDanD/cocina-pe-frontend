import React, { useState, useContext } from "react";
import { Layout, Menu, Button, Typography, Image, Avatar, Row, Col } from "antd";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  ScheduleOutlined,
  PoweroffOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Home from "../pages/Home";
import { authContext } from "../providers/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import "./MainLayout.scss";
import { RUTAS } from "../config/constantes";
import MenuTopMain from '../components/MenuTopMain'


const { Content, Sider, Header, Footer } = Layout;
const { Title } = Typography;

export default function MainLayout(props) {
  const { routes } = props;
  const { setAuthData, auth } = useContext(authContext);
  let [collapsed, setCollapsed] = useState(false);

  let onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const onLogOut = () => {
    setAuthData(null);
    
  };

  if (!auth.data && !auth.loading) { 
    return (
      <>
        <Route path='/' component={Home}/>
        <Redirect to='/' />
      </>
    )
  }

  if (auth.data && !auth.loading) {
    return (
      <Layout>
      {/*TO DO: Menu sider*/}
          <Layout className="layout-main">
              <Header className="layout-main__header">
                  <MenuTopMain auth={auth} onLogOut={onLogOut}/>
              </Header>

              <div className="layout-main__header-brown"></div>
              <Content className="layout-main__content">
                  <LoadRoutes routes={routes}/>
              </Content>

              <Footer className="layout-basic__footer">
                Politicas de privacidad - Grupo AAAAAAA<br/>
              </Footer>
          </Layout>
      </Layout>
    );
  }

  return null;
}

function LoadRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, index) => (
        <PrivateRoute
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.component}
        />
      ))}
    </Switch>
  );
}
