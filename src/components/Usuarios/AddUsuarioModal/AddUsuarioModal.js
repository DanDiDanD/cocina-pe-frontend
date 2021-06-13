import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select } from "antd";
import { registrarUsuario } from "../../../api/usuarios";
import { listarSedes } from "../../../api/sedes";
import "./AddUsuarioModal.scss";

export default function AddUsuarioModal(props) {
  const { setIsVisibleModal, setReloadUsuario } = props;
  const [sedes, setSedes] = useState(null);
  const onFinish = async (values) => {
      const response = await registrarUsuario(values);
      setReloadUsuario(true);

      if (response.code === 200) {
        notification["success"]({
          message: "Éxito",
          description: response.message,
        });
        setIsVisibleModal(false);
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
        setIsVisibleModal(false);
      }
  };
  useEffect(() => {
    async function obtenerSedes() {
      let response = await listarSedes();
      setSedes(response.data);
    }
    obtenerSedes();
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  
  return (
    <Form {...layout} name="basic" onFinish={onFinish} initialValues={{}}>
      <Form.Item
        label="Usuario:"
        name="usuario"
        rules={[ {required: true, message: "Porfavor ingresa el usuario.",},
        ]}
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

      <Form.Item
        label="Nombre"
        name="nombres"
        rules={[{ required: true, message: "Porfavor ingresa el nombre." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Apellidos"
        name="apellidos"
        rules={[{ required: true, message: "Porfavor ingresa los apellidos." }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Sede"
        name="sede"
        rules={[{ required: true, message: "Este campo es obligatorio." }]}
      >
        <Select>
          {sedes !== null
            ? sedes.map((sede) => (
                <Select.Option key={sede._id} value={sede._id}>{sede.nombre}</Select.Option>
              ))
            : null}
        </Select>
      </Form.Item>


      <Form.Item className="site-page-button">
        <div className="site-page-button">
          <Button shape="round" type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
