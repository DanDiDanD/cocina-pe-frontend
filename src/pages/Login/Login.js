import React, { useState, useContext } from "react";
import { Layout, Form, Input, Button, Typography, notification, Space } from "antd";
import { Route, Redirect } from "react-router-dom";
import { login } from "../../api/usuarios";
import { authContext } from "../../providers/AuthContext";
import Modal from "../../components/Modal";
import RegistroModal from '../../components/RegistroModal'

import jwtDecode from "jwt-decode";
import "./Login.scss";
const { Content } = Layout;
const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8 },
};

export default function Login({ history }) {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const { auth, setAuthData } = useContext(authContext);

  const onFinish = async (values) => {
    const response = await login(values);

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
    }
  };

  const registrarse = () => {
    setIsVisibleModal(true);
    setModalTitle("¡Regístrate!");
    setModalContent(
      <RegistroModal
        setIsVisibleModal={setIsVisibleModal}
        login={onFinish}
      />
    );
  };

  return (
    <Layout className="login">
      <Content className="login-content">
        <div className="login-form">
          <Title style={{ textAlign: "center" }} level={3}>
            Inicia Sesi&oacute;n
          </Title>
          <br />
          <Form {...layout} name="basic" onFinish={onFinish}>
            <Form.Item
              label="Correo"
              name="correo"
              rules={[{ required: true, message: "Usuario requerido." }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: "Contraseña requerida." }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="site-page-button">
              <div className="site-page-button">
                <Button type="primary" htmlType="submit">
                  Ingresar
                </Button>
              </div>
            </Form.Item>
            <br />
            <div className="site-page-button">
                  <Space size="small">
                 <text>¿No tienes cuenta aún?</text><a onClick={() => registrarse()}>¡Registrate ahora!</a>
                  </Space>
            </div>
          </Form>
        </div>
      </Content>
      <Modal
          title={modalTitle}
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          footer={false}
      >
          {modalContent}
      </Modal>
    </Layout>
  );
}
