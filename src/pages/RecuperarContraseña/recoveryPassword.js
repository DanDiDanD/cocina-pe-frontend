import React, { useState, useContext } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  notification,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Route, Redirect } from "react-router-dom";
import { login } from "../../api/usuarios";
import { authContext } from "../../providers/AuthContext";
import Modal from "../../components/Modal";
import RecuperacionModal from "../../components/RecuperacionModal";

import jwtDecode from "jwt-decode";
import "./recoveryPassword.scss";
import "./../../index.scss";
const { Content } = Layout;
const { Text, Title, Link } = Typography;

const layout = {
  // labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 8 },
};

export default function Login({ history }) {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);
  const { auth, setAuthData } = useContext(authContext);

  const onFinish = async (values) => {
    // Agregar servicio

    setIsVisibleModal(true);
    setModalTitle("Codigo de Verificación");
    setModalContent(
      <RecuperacionModal
        setIsVisibleModal={setIsVisibleModal}
        login={onFinish}
        setHasVerified={setHasVerified}
      />
    );
    /* const response = await login(values);

    if (response.code === 200) {
      let datosLogin = jwtDecode(response.data);
      datosLogin.token = response.data;
      setAuthData(datosLogin);
      const ruta_siguiente = localStorage.getItem('ruta_siguiente')
      window.location.href = "/cocina";
    } else {
      notification["error"]({
        message: "Error",
        description: response.message,
      });
    } */
  };

  const onFinishChangePassword = async () => {
    // Agregar servicio
    console.log("se cambio de contraseña")
  }


  return (
    <Layout>
      <div className="login">
        <Content className="login-content">
          {!hasVerified ? (
            <div className="login-form">
              <Title style={{ textAlign: "center" }} level={1}>
                Cambiar Contraseña
              </Title>
              <br />
              <Form
                {...layout}
                name="basic"
                onFinish={onFinish}
                // style={{width: '135%'}}
                style={{ width: 360 }}
              >
                <Form.Item
                  // label="Correo"
                  name="correo"
                  rules={[{ required: true, message: "Ingresa tu correo." }]}
                >
                  <Input
                    className="login-input"
                    size="large"
                    placeholder="Ingresa tu correo electronico"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>

                <Form.Item className="site-page-button">
                  <div className="site-page-button">
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      htmlType="submit"
                      shape="round"
                    >
                      Enviar
                    </Button>
                  </div>
                </Form.Item>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Form>
            </div>
          ) : (
            <div className="login-form">
              <Title style={{ textAlign: "center" }} level={1}>
                Cambiar Contraseña
              </Title>
              <br />
              <Form
                {...layout}
                name="basic"
                onFinish={onFinishChangePassword}
                // style={{width: '135%'}}
                style={{ width: 360 }}
              >
                <Form.Item
                  // label="Correo"
                  name="password"
                  rules={[{ required: true, message: "Ingresa una contraseña" }]}
                >
                  <Input
                    className="login-input"
                    size="large"
                    placeholder="Ingresa tu nueva contraseña"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>

                <Form.Item
                  // label="Correo"
                  name="confirPassword"
                  rules={[{ required: true, message: "Vuelve a ingresar tu contraseña" }]}
                >
                  <Input
                    className="login-input"
                    size="large"
                    placeholder="Comprueba tu contraseña"
                    prefix={<LockOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>

                <Form.Item className="site-page-button">
                  <div className="site-page-button">
                    <Button
                      shape="round"
                      size="large"
                      type="primary"
                      htmlType="submit"
                      shape="round"
                    >
                      Cambiar
                    </Button>
                  </div>
                </Form.Item>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Form>
            </div>
          
          )
          
          }
        </Content>
        <Modal
          title={modalTitle}
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          footer={false}
        >
          {modalContent}
        </Modal>
      </div>
    </Layout>
  );
}
