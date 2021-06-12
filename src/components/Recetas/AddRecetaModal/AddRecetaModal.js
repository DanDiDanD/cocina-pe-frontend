import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select, InputNumber, Divider, Upload, message, Space, Checkbox, Row, Col } from "antd";
import { listarPlatillos } from "../../../api/platillo";
import { agregarReceta } from "../../../api/receta";
import "./AddRecetaModal.scss";

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

export default function AddRecetaModal(props) {
  const { TextArea } = Input;

  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [platillos, setPlatillos] = useState([]);
  const { setIsVisibleModal } = props;

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
    values.ruta_imagen = localStorage.getItem('url_imagen_base64')
    const usuario = JSON.parse(localStorage.getItem("authData"))._id
    values.usuario = usuario
    const response = await agregarReceta(values);
    
    if (response.code === 200) {
      notification["success"]({
        message: "Éxito",
        description: response.message,
      });
      setIsVisibleModal(false);
      let id = response.data[0]._id;
      window.location.href = `/cocina/recetas/editar/${id}`;

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
    async function obtenerPlatillos() {
      let response = await listarPlatillos();
      setPlatillos(response.data);
    }
    obtenerPlatillos();
  }, []);

  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };


  return (
    <Form {...formItemLayout} name="basic" onFinish={onFinish} initialValues={{}}>
      <Form.Item
        label="Nombre:"
        name="nombre"
        rules={[ {required: true, message: "Porfavor ingresa el nombre de la receta.",},
        ]}
      >
        <Input />
      </Form.Item>

      
      <Form.Item
        label="Platillo"
        name="platillo"
        rules={[{ required: true, message: "Este campo es obligatorio." }]}
      >
        <Select>
          {platillos !== null
            ? platillos.map((item) => (
                <Select.Option key={item._id} value={item._id}>{item.nombre}</Select.Option>
              ))
            : null}
        </Select>
      </Form.Item>



      <Form.Item
        label="Descripcion:"
        name="descripcion"
        rules={[ {required: true, message: "Porfavor ingresa la descripción de la receta.",},
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item label="Porciones:">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="porciones"
              rules={[ {required: true, message: "Porfavor ingresa la cantidad de porciones de la receta.",},
            ]}
            >
              <InputNumber  min={1} />
            </Form.Item>
          </Col>
          <Col >
            <Form.Item
              label="Imagen principal:"
              name="ruta_imagen"
              rules={[ {required: true, message: "Porfavor ingresa una imagen para la receta.",},
            ]}
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
          </Col>
        </Row>
      </Form.Item>

      <Divider />

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
