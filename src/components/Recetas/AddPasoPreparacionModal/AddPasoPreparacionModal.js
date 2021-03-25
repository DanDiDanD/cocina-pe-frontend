import React, {useState, useEffect} from "react";
import { Form, Input, Button, notification, Select, InputNumber, Divider, Upload, message, Space, Checkbox, Row, Col, Switch } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { modificarReceta } from "../../../api/receta";
import "./AddPasoPreparacionModal.scss";


export default function AddIngredienteModal(props) {
  const { TextArea } = Input;
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [reloadSelect, setReloadSelect] = useState([]);
  const { setIsVisibleModal, setReload, id_receta, baseDataPreparacion } = props;

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
    values.url_imagen = localStorage.getItem('url_imagen_base64')
    console.log(values);
    baseDataPreparacion.push(values)
    const obj = {
        preparacion: baseDataPreparacion
    }
    const response = await modificarReceta(id_receta,obj);
    
    if (response.code === 200) {
        notification["success"]({
        message: "Éxito",
        description: response.message,
        });
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

      <Form.Item label="Detalle del paso:"  name="detalle" rules={[{ required: true, message: 'Describa el paso a detalles:' }]}>
        <TextArea rows={5}/>
      </Form.Item>

      <Form.Item
              label="Imagen principal:"
              name="url_imagen"
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
            Guardar
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