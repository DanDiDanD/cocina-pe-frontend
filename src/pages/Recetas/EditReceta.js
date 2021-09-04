import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Table,
  Space,
  PageHeader,
  Input,
  Tag,
  Image,
  Divider,
  List,
  Avatar,
  Card,
  Button,
  notification,
  Modal as ModalAntd,
} from "antd";
import { DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { Link } from "react-router-dom";
import { obtenerReceta } from "../../api/receta";
import {useParams} from 'react-router-dom'
import "./Recetas.scss";
import { modificarReceta } from "../../api/receta";

import Modal from "../../components/Modal";
import EditRecetaModal from '../../components/Recetas/EditRecetaModal'
import AddIngredienteModal from '../../components/Recetas/AddIngredienteModal'
import EditIngredienteModal from '../../components/Recetas/EditIngredienteModal'
import AddPasoPreparacionModal from '../../components/Recetas/AddPasoPreparacionModal'
import EditPasoPreparacionModal from '../../components/Recetas/EditPasoPreparacionModal'

const { confirm } = ModalAntd;

export default function EditRecetas() {
  const {id} = useParams();
  const [receta, setReceta] = useState(null);
  const [baseDataReceta, setBaseDataReceta] = useState([]);
  const [baseDataIngredientes, setBaseDataIngredientes] = useState([]);
  const [baseDataPreparacion, setBaseDataPreparacion] = useState([]);
  const [imagen, setImagen] = useState('');

  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const [reload, setReload] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const listar = async () => {
        const response = await obtenerReceta(id);
        setBaseDataReceta(response.data)
        const [recetaEspecifica] =response.data
        console.log(recetaEspecifica);
        
        
        let newArrIngredientes = recetaEspecifica.ingredientes.length != 0 ? recetaEspecifica.ingredientes.map(function (item) {
          return {
            ingrediente: item.ingrediente,
            ingrediente_nombre: item.ingrediente_nombre,
            cantidad: item.cantidad + ' '+ item.unidad,
          };
        }) : [];
        let newArrPreparacion = recetaEspecifica.preparacion.length != 0 ? recetaEspecifica.preparacion.map(function (item) {
          return {
            detalle: item.detalle,
            url_imagen: item.url_imagen,
          };
        }): [];
        setBaseDataIngredientes(newArrIngredientes)
        setBaseDataPreparacion(newArrPreparacion)
        setImagen(recetaEspecifica.ruta_imagen)
        setIsLoading(false);
        setReload(false);
      }
      listar();
  },[reload])
  
  const deleteIngrediente = async (nombre) => {
    console.log(nombre);
    const nuevosIngredientes = []
    baseDataIngredientes.map(item =>{
      if(nombre != item.ingrediente_nombre){
        nuevosIngredientes.push(item)
      }
    })
    const obj = {
      ingredientes: nuevosIngredientes
    }

    let response = await modificarReceta(id, obj);
    if (response.code === 200) {
      notification["success"]({
        message: "Éxito",
        description: response.message,
      });
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
    setReload(true);
  }

  const modalRecetaPublica = (id, boleano) => {
    let titulo = 'Convertir a receta pública'
    let contenido = 'Al hacer la receta pública todos las las personas pertenecientes a la comunidad de Cocina Pe podrán verla'
    let text = 'Hacer pública'
    if(boleano){
      titulo = 'Convertir a receta privada'
      contenido = 'Al hacer la receta privada solo tú podrás verla en la lista de recetas de Cocina Pe'
      text = 'Hacer Privada'
    }
    confirm({
      title: titulo,
      content: contenido,
      okText: text,
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        let response = await modificarReceta(id, {is_publico: !boleano});

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
          setIsVisibleModal(true);
        } else {
          notification["warning"]({
            message: "Error",
            description: response.message,
          });
          setIsVisibleModal(true);
        }
        setReload(true)
      },
    });
  };

  const deletePreparacion= async (detalle) => {
    const nuevaPreparacion = []
    console.log(detalle);
    
    console.log(baseDataPreparacion);
    
    baseDataPreparacion.map(item =>{
      if(detalle != item.detalle){
        nuevaPreparacion.push(item)
      }
    })
    console.log(nuevaPreparacion);
    
    const obj = {
      preparacion: nuevaPreparacion
    }

    let response = await modificarReceta(id, obj);
    if (response.code === 200) {
      notification["success"]({
        message: "Éxito",
        description: response.message,
      });
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
    setReload(true);
  }

  const columnsIngredientes = [
    {
      title: 'Ingredientes',
      dataIndex: 'ingrediente_nombre',
      key: "ingrediente",
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: "cantidad",
    },
    {
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
            {" "}
            <Button shape="round"
                type="danger"
                icon={<DeleteOutlined />}
                onClick={async() => await deleteIngrediente(record.ingrediente_nombre)}
              />
        </Space>
      ),
    },
  ];

  const editReceta = (key) => {
    setIsVisibleModal(true);
    setModalTitle("Editar receta");
    setModalContent(
      <EditRecetaModal
        setIsVisibleModal={setIsVisibleModal}
        id_receta={key}
        setReload={setReload}
      />
    );
  };

  const addIngrediente = (key) => {
    setIsVisibleModal(true);
    setModalTitle("Agregar ingrediente");
    setModalContent(
      <AddIngredienteModal
        setIsVisibleModal={setIsVisibleModal}
        baseDataIngredientes={baseDataIngredientes}
        id_receta={key}
        setReload={setReload}
      />
    );
  };

  const editIngrediente = (key) => {
    setIsVisibleModal(true);
    setModalTitle("Editar ingrediente");
    setModalContent(
      <EditIngredienteModal
        setIsVisibleModal={setIsVisibleModal}
        baseDataIngredientes={baseDataIngredientes}
        id_receta={key}
        setReload={setReload}
      />
    );
  };

  const addPreparacion = (key) => {
    setIsVisibleModal(true);
    setModalTitle("Agregar paso a la preparación");
    setModalContent(
      <AddPasoPreparacionModal
        setIsVisibleModal={setIsVisibleModal}
        baseDataPreparacion={baseDataPreparacion}
        id_receta={key}
        setReload={setReload}
      />
    );
  };

  const editPreparacion = (key, detalle, url_imagen) => {
    setIsVisibleModal(true);
    setModalTitle("Editar ingrediente");
    setModalContent(
      <EditPasoPreparacionModal
        setIsVisibleModal={setIsVisibleModal}
        baseDataPreparacion={baseDataPreparacion}
        detalle={detalle}
        url_imagen={url_imagen}
        id_receta={key}
        setReload={setReload}
      />
    );
  };

  return (
    <> 
      <div className="master-container">
      <Row>
        <Col span={23}>
          <List
            loading={isLoading}
            itemLayout="horizontal"
            dataSource={baseDataReceta}
            renderItem={item => (
              <List.Item actions={[            
                <Button shape="round"
                  type="primary"
                  onClick={() => editReceta(id)}
                >Editar</Button>,
                item.is_publico == true ?
                  <Button shape="round"
                    type="primary"
                    onClick={() => modalRecetaPublica(id, item.is_publico)}
                  >Hacer privada</Button> : 
                  <Button shape="round"
                    type="primary"
                    onClick={() => modalRecetaPublica(id, item.is_publico)}
                  >Hacer publica</Button> ,
              
              ]}
              >
                <List.Item.Meta className='list-item-meta-receta'
                  title={`Editar receta: ${item.nombre}`}
                  description={item.detalle}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Divider/>

      <Row>
        <Col span={6} ><h2>Lista de ingredientes</h2> </Col>
        <Col  offset={2}><Button shape="round" type='primary' onClick={()=>addIngrediente(id)} >Agregar ingrediente</Button></Col>
      </Row>
      
      

      <Row>
        <Col className="col1" span={12}>

          <Table
              className="tabIngred"
              size="middle"
              columns={columnsIngredientes}
              dataSource={baseDataIngredientes}
              rowSelection = { false }
              rowKey={(record) => record._id}
              loading={isLoading}
              pagination={false}
            />
        </Col>
        <Col className="col2"  span={12}>
          <Image className="plato" preview={true} src={imagen}/>
        </Col>
      </Row>
      <Divider />

      <Row>
        <Col span={12}><h2> Preparación</h2> </Col>
        <Col span={12}><Button shape="round" type='primary' onClick={()=>addPreparacion(id)} >Agregar paso</Button></Col>
      </Row>
      
      
        <Col className="fonCol" span={"auto"}>
          <div className="site-card-wrapper">
            <Row gutter={12}>
              {baseDataPreparacion.map((item, i=0) => (
                  <>
                    <Col className="receta-card" span={8}>
                      
                      <Card 
                        className="tarjeta" 
                        hoverable 
                        title={`Paso ${i + 1}`} 
                        cover={
                          <Row>
                            <br />
                            {item.url_imagen.length != 0 ? (
                              <Avatar
                                size={400}
                                style={{
                                  margin: 15,
                                  width: "auto",
                                  minHeight: "600",
                                  borderRadius: 10,
                                }}
                                src={item.url_imagen}
                                shape="square"
                              />
                            ) : (
                              <br></br>
                            )}
                            
                          </Row>
                      }
                      
                      
                        actions={[
                          <EditOutlined   key="edit" onClick={()=>editPreparacion(id,item.detalle, item.url_imagen)}/>,
                          <DeleteOutlined key="delete" onClick={()=>deletePreparacion(item.detalle)}/>
                        ]}
                      >
                        <div class="estil-1">{item.detalle}</div>
                      </Card>
                      
                    </Col>
                    
                  </>
                ))
              }
            </Row>
          </div>
          
        </Col>
      
      <br/>
      </div>
      <Modal
          title={modalTitle}
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          footer={false}
      >
          {modalContent}
      </Modal>
    </>
  );
}

