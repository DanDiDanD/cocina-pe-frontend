import React, { useState, useEffect, useMemo, useContext} from "react";
import {
  Row,
  Col,
  Table,
  Space,
  Modal,
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
  Modal as ModalAntd
} from "antd";
import { HeartTwoTone } from '@ant-design/icons'
import { Link } from "react-router-dom";
import { obtenerReceta, listarRecetas } from "../../api/receta";
import { isRecetaFavorita, recetaFavorita } from "../../api/usuarios";
import {useParams} from 'react-router-dom'
import { authContext } from '../../providers/AuthContext';
import "./Recetas.scss";

const props = {
  rowSelection: {},
};
const { confirm } = ModalAntd;

export default function Recetas() {
  
  const {id} = useParams();
  const [receta, setReceta] = useState(null);
  const { auth } = useContext(authContext);
  const [baseDataReceta, setBaseDataReceta] = useState([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [baseDataIngredientes, setBaseDataIngredientes] = useState([]);
  const [baseDataPreparacion, setBaseDataPreparacion] = useState([]);
  const [isFavorito,setIsFavorito] = useState(false);
  const [imagen, setImagen] = useState('');
  const [reload, setReload] = useState(true);
  const [reloadFavorito, setReloadFavorito] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const listar = async () => {
        const response = await obtenerReceta(id);
        setBaseDataReceta(response.data)
        const [recetaEspecifica] =response.data
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

  useEffect(() => {
    const recetaFav = async () => {
      const response = await isRecetaFavorita({id_usuario: auth.data._id, id_receta: id})
      setIsFavorito(response.data);
      setReloadFavorito(false)
    }
    recetaFav()
  }, [reloadFavorito])
  
  const modalRecetaFav = async () => {
    let response = await recetaFavorita({id_usuario: auth.data._id, id_receta: id});
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
    setReloadFavorito(true)

  };

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
  ];


  return (
    <> 
      <div className="master-container">
      <Row>
        <Col span={23}>
          <List
            loading={isLoading}
            itemLayout="vertical"
            dataSource={baseDataReceta}
            renderItem={item => (
              <List.Item 
              // actions={[ isFavorito ? <Button shape="round"
              //   type="danger"
              //   icon={<HeartTwoTone twoToneColor="#eb2f96" />}
              //   onClick={() => modalRecetaFav()}
              // /> :
              //   <Button shape="round"
              //     type="dashed"
              //     icon={<HeartTwoTone twoToneColor="#eb2f96" />}
              //     onClick={() => modalRecetaFav()}
              //   />]}
                extra = {
                  isFavorito ? <> <br/> <Button shape="round"
                type="danger"
                icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                onClick={() => modalRecetaFav()}
              /> </>:
                  <>
                  <br/>
                <Button shape="round"
                  type="dashed"
                  icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                  onClick={() => modalRecetaFav()}
                />
                </>
                }
              >
                <List.Item.Meta className='list-item-meta-receta'
                  avatar={<Avatar size={64} src={item.usuario.url_avatar} />}
                  title={item.nombre}
                  description={<>Por: <a href={`/cocina/usuarios/${item._id}`}>{item.usuario.nombres + ' ' + item.usuario.apellido_paterno + ' ' +  (item.usuario.apellido_materno.length != 0 ? item.usuario.apellido_materno : '')}</a></>}
                />
                {item.descripcion}
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Divider/>

      <Row>
        <Col span={6} offset={1}><h2> Lista de ingredientes</h2> </Col>
      </Row>

      <Row>
        <Col span={1}></Col>
        <Col span={11}>
          <Table
              size="middle"
              columns={columnsIngredientes}
              dataSource={baseDataIngredientes}
              rowSelection = { false }
              rowKey={(record) => record._id}
              loading={isLoading}
              pagination={false}
              {...props}
            />
        </Col>
        <Col span={2}></Col>
        <Col span={9}>
          <Image preview={true} src={imagen}/>
        </Col>
        <Col span={1}></Col>
      </Row>
      <Divider />
      <Row>
        
      </Row>
        <Col span={6} offset={1}><h2> Preparación</h2> </Col>
      <Row>
        <Col span={24}>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              {
                baseDataPreparacion.map((item, i=0) => (
                  <>
                    <Col span={1}></Col>
                    <Col span={6}>
                      <div className='receta-card'>
                      <Card type="inner" style={{ width: 390 }}hoverable title={`Paso ${i + 1}`} bordered={true} cover={
                          <Row>
                            <Col span={22} offset={1}>
                              <br/>
                              {item.url_imagen.length != 0 ? ( <Avatar size={360}
                                src={item.url_imagen}
                                shape="square"
                              />) : (<></>)}
                            </Col>
                          </Row>
                      }>
                        {item.detalle}
                      </Card>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                  </>
                ))
              }
            </Row>
          </div>
          
        </Col>
      </Row>
      <br/>
      </div>
    </>
  );
}

