import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select, InputNumber, Divider, Upload, message, Space, Checkbox, Row, Col, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { modificarReceta } from "../../../api/receta";
import { listarIngredientes } from "../../../api/ingrediente";
import "./AddIngredienteModal.scss";


export default function AddIngredienteModal(props) {
  const { TextArea } = Input;
  const [ingredientes, setIngredientes] = useState([]);
  const [reloadSelect, setReloadSelect] = useState([]);
  const { setIsVisibleModal, setReload, id_receta, baseDataIngredientes } = props;

  const onFinish = async (values) => {
    const split = values.ingrediente.split('/')
    values.ingrediente = split[0]
    values.ingrediente_nombre = split[1]
    const nuevosIngredientes = baseDataIngredientes;
    let existe = nuevosIngredientes.find(ingrediente => ingrediente.ingrediente_nombre === values.ingrediente_nombre)
    if(existe === undefined){
        baseDataIngredientes.push(values)
        const obj = {
            ingredientes: nuevosIngredientes
        }
        const response = await modificarReceta(id_receta,obj);
        
        if (response.code === 200) {
          notification["success"]({
            message: "Éxito",
            description: response.message,
          });
          setReloadSelect(true);
          setReload(true)
    
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
    }
    else{
        notification["error"]({
            message: "Error",
            description: 'Ese ingrediente ya se encuentra en la lista de ingredientes',
          });
    }
  };

  const onFinish2 = async (values) => {
    let nuevosIngredientes = [];
    baseDataIngredientes.map(item => {nuevosIngredientes.push(item)})

    values.ingredientes.map(item => {
        let existe = nuevosIngredientes.find(ingrediente => ingrediente.ingrediente_nombre === item.ingrediente_nombre)
        if(existe === undefined){
            nuevosIngredientes.push(item);
        }
    })
    const obj = {
        ingredientes: nuevosIngredientes
    }
    const response = await modificarReceta(id_receta,obj);
    
    if (response.code === 200) {
      notification["success"]({
        message: "Éxito",
        description: response.message,
      });
      setReloadSelect(true);
      setReload(true)
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
    // console.log(baseDataIngredientes);
    
  };

  useEffect(() => {
    async function obtenerIngredientes() {
      let response = await listarIngredientes();
      setIngredientes(response.data);
    }
    obtenerIngredientes();
  }, [reloadSelect]);

  
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

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 24,
        offset: 0,
      },
    },
  };

  return (
    <>
    <Form {...formItemLayout} name="basic" onFinish={onFinish}>

      <Form.Item label="Ingrediente:">
        <Row gutter={8}>
          <Col span={9}>
          <Form.Item
                name="ingrediente"
                rules={[{ required: true, message: 'Elegir receta' }]}
            >
                <Select>
                {ingredientes !== null
                    ? ingredientes.map((item) => {
                        let existe = baseDataIngredientes.find( ingrediente => ingrediente.ingrediente_nombre === item.nombre)
                        
                        if(existe === undefined){
                            return <Select.Option key={`${item._id}`} value={`${item._id}/${item.nombre}`}>{item.nombre}</Select.Option>
                        }
                    }
                    )
                    : null}
                </Select>
            </Form.Item>

          </Col>
          
          <Col >
            <Form.Item
                label="Cantidad:"
                name="cantidad"
            >
                <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item className="site-page-button">
        <div className="site-page-button">
          <Button shape="round" type="primary" htmlType="submit">
            Agregar ingredientes listados
          </Button>
        </div>
      </Form.Item>
    </Form>

    <Divider/>
    
    <h4>Más ingredientes</h4>

    <Form {...formItemLayout} name="basic" onFinish={onFinish2}>

      <Form.List  name="ingredientes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
                <Row>
                    <Col offset={4}>
                    <Space key={field.key} align="baseline" size='large'>

                        <Form.Item {...tailFormItemLayout}
                        {...field}
                        name={[field.name, 'ingrediente_nombre']}
                        fieldKey={[field.fieldKey, 'ingrediente_nombre']}
                        rules={[{ required: true, message: 'Escribir ingrediente' }]}
                        >
                        <Input placeholder="Ingrediente" />

                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}
                        {...field}
                        name={[field.name, 'cantidad']}
                        fieldKey={[field.fieldKey, 'cantidad']}
                        >
                        <Input placeholder="Cantidad" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                    </Col>
                </Row>
            ))}
            <Form.Item {...tailFormItemLayout} >
              <Button shape="round" type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Más Ingredientes
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item className="site-page-button">
        <div className="site-page-button">
          <Button shape="round" type="primary" htmlType="submit">
            Agregar extras
          </Button>
        </div>
      </Form.Item>
    </Form>
    </>
  );
}
