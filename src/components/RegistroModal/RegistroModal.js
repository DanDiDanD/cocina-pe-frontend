import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select, InputNumber, DatePicker, Divider, Upload, message, Space, Checkbox, Row, Col, Switch, Radio } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { registrarUsuario } from "../../api/usuarios";
import "./RegistroModal.scss";


export default function AddIngredienteModal(props) {
  const { TextArea } = Input;
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const { setIsVisibleModal, login } = props;

  const onChange =  async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const file = newFileList[0];
    if(file != null){
      if (file.status === 'done' || file.status === 'error' ) {
            const img = await file.originFileObj
            await readFileAsync(img)
            setImageUrl(localStorage.getItem('url_imagen_base64'))
      }
    }
  };

  function readFileAsync(img) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      
      reader.onerror = reject;
      reader.readAsDataURL(img);
  
      reader.onload = () => {
        resolve(reader.result);
        setImageUrl(reader.result);
        reader.addEventListener('load', () => setImageUrl(reader.result));
        localStorage.setItem('url_imagen_base64', reader.result)
      };
    })
  }

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const onFinish = async (values) => {
    values.url_avatar = localStorage.getItem('url_imagen_base64')
    console.log(values);

    const response = await registrarUsuario(values);
    console.log(response);
    
    if (response.code === 200) {
        notification["success"]({
        message: "Éxito",
        description: response.message,
        });
        const obj = {
            correo: values.correo,
            password: values.password,
        }
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
    }
    
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
        label="Nombre:"
        name="nombres"
        rules={[ {required: true, message: "Porfavor ingresa su nombre.",},
        ]}
      >
        <Input />
    </Form.Item>

    <Form.Item
        label="Apellidos:"
        name="apellido_paterno"
        rules={[ {required: true, message: "Por favor ingrese su nombre.",},
        ]}
      >
        <Input />
    </Form.Item>

      <Form.Item
        name="correo"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'El E-mail no es válido',
          },
          {
            required: true,
            message: 'Por favor ingruese su E-mail',
          },
        ]}
      >
    <Input />
    </Form.Item>

    <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

    <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

    <Form.Item name="sexo" label="Sexo">
        <Radio.Group>
          <Radio value="Hombre">Hombre</Radio>
          <Radio value="Mujer">Mujer</Radio>
          <Radio value="Otro">Otro tipo de clasificación</Radio>
        </Radio.Group>
      </Form.Item>


    

    <Form.Item name="fecha_nacimiento "label="Fecha de nacimiento">
          <DatePicker />
    </Form.Item>



      <Form.Item
              label="Foto de perfil:"
              name="url_avatar"
      >
            <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            showUploadList={true}
            onChange={onChange}
            onPreview={onPreview}
            >
            {fileList.length < 1 && '+ Upload'}
            </Upload>

        </Form.Item>

      <Form.Item className="site-page-button">
        <div className="site-page-button">
          <Button type="primary" htmlType="submit">
            ¡Registrame!
          </Button>
        </div>
      </Form.Item>
    </Form>
    </>
  );
}

async function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 3000 / 3000 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }