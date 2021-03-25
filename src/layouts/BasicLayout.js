import React, {useContext} from 'react'
import {Switch} from 'react-router-dom';
import PublicRoute from '../components/PublicRoute'
import { Layout, Button } from 'antd';
import MenuTop from '../components/MenuTop'
import { authContext } from "../providers/AuthContext";
import { Route,  Redirect, useHistory } from "react-router-dom";
import Home from "../pages/Home";
import {
  HomeOutlined,
  UserOutlined,
  ScheduleOutlined,
  LoginOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import './BasicLayout.scss'

export default function BasicLayout(props) {
    const { routes } = props;
    const { setAuthData, auth } = useContext(authContext);
    const {Header, Content, Footer} = Layout;

    if (auth.data && !auth.loading) { 
      return (
        <>
          <Route path='/cocina' component={Home}/>
          <Redirect to='/cocina' />
        </>
      )
    }

    return (
        <Layout>
          {/*TO DO: Menu sider*/}
          <Layout className="layout-basic">
              <Header className="layout-basic__header">
                  <MenuTop />
                  <div className="header">
                    <Button
                      className="header-button"
                      type="primary"
                      icon={<LoginOutlined />}
                      href={`/login`}
                    >
                      Ingresar
                    </Button>
                  </div>
              </Header>
              <div className="layout-basic__header-brown"></div>
              <Content className="layout-basic__content">
                  <LoadRoutes routes={routes}/>
              </Content>
              <Footer className="layout-basic__footer">
                Politicas de privacidad - Grupo 01<br/>

              </Footer>
          </Layout>
      </Layout>
    )
}

function LoadRoutes({routes}) {
    return (
        <Switch>
          {routes.map((route, index) => (
            <PublicRoute
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </Switch>
      );
}
