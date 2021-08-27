import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  notification,
} from "antd";
import { registrarUsuario } from "../../api/usuarios";
import "./RecuperacionModal.scss";

export default function AddIngredienteModal(props) {

  const { setIsVisibleModal, login, setHasVerified } = props;


  const onFinish = async (values) => {
    values.url_avatar = localStorage.getItem("url_imagen_base64");
    console.log(values);

    setHasVerified(true)

    /* const response = await registrarUsuario(values);
    console.log(response);

    if (response.code === 200) {
      notification["success"]({
        message: "Éxito",
        description: response.message,
      });
      const obj = {
        correo: values.correo,
        password: values.password,
      };
      await login(obj);
    } else if (response.code === 400) {
      notification["error"]({
        message: "Error",
        description: response.message,
      });
    } else {
      notification["warning"]({
        message: "Error",
        description: response.message,
      });
    } */

    setIsVisibleModal(false);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  return (
    <>
      <Form {...formItemLayout} name="basic" onFinish={onFinish}>
        <Form.Item
          label="Ingresa el codigo:"
          name="nombres"
          rules={[{ required: true, message: "Porfavor ingresa su nombre." }]}
        >
          <Input />
        </Form.Item>

        <Form.Item className="site-page-button">
          <div className="site-page-button">
            <Button shape="round" type="primary" htmlType="submit">
              Verificar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}

