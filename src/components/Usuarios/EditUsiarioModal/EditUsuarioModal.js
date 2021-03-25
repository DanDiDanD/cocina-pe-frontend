import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select } from "antd";
import { listaUsuario, modificarUsuario } from "../../../api/usuarios";
import { listarSedes } from "../../../api/sedes";
import "./EditUsuarioModal.scss";

export default function EditUsuarioModal(props) {
  const { setIsVisibleModal, setReloadUsuario } = props;
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState(null);

  const onFinish = async (values) => {
      const objeto = {
        usuario: values.usuario,
        nombres: values.nombres,
        apellidos: values.apellidos,
        sede: values.sede,
        password: null
      }
      
      if(values.password != null){
          if(values.password.length !== 0){
              objeto.password = values.password
          }
      }
      
      const response = await modificarUsuario(props.idUsuario,values);
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

  useEffect(() => {
    async function fetchData() {
      const response = await listaUsuario(props.idUsuario);
      console.log(response.data[0]);
      
      form.setFieldsValue({
        usuario: response.data[0].usuario,
        nombres: response.data[0].nombres,
        apellidos: response.data[0].apellidos,
        sede: response.data[0].sede._id
      });
    }
    fetchData();
  }, [props.idUsuario]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  
  return (
    <Form {...layout} name="basic" onFinish={onFinish} form={form}>
      <Form.Item
        label="Usuario:"
        name="usuario"
        rules={[ {required: true, message: "Porfavor ingresa el usuario.",},
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
          label="Nueva contraseña"
          name="password"
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
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
