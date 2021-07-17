import React, { useState, useEffect, useMemo, useContext } from "react";
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
  Modal as ModalAntd,
  AutoComplete,
} from "antd";
import { HeartTwoTone } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { obtenerReceta, listarRecetas } from "../../api/receta";
import { isRecetaFavorita, recetaFavorita } from "../../api/usuarios";
import { useParams } from "react-router-dom";
import { authContext } from "../../providers/AuthContext";
import "./Recetas.scss";

// Por mientras
import "../Platillos/Platillos.scss";

const props = {
  rowSelection: {},
};
const { confirm } = ModalAntd;

export default function Recetas() {
  const { id } = useParams();
  const [receta, setReceta] = useState(null);
  const { auth } = useContext(authContext);
  const [baseDataReceta, setBaseDataReceta] = useState([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [baseDataIngredientes, setBaseDataIngredientes] = useState([]);
  const [baseDataPreparacion, setBaseDataPreparacion] = useState([]);
  const [isFavorito, setIsFavorito] = useState(false);
  const [imagen, setImagen] = useState("");
  const [reload, setReload] = useState(true);
  const [reloadFavorito, setReloadFavorito] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  //Coments
  const [baseDataComentarios, setBaseDataComentarios] = useState([])
  const [comentsLoading, setComentsLoading] = useState(null)

  useEffect(() => {
    const listar = async () => {
      const response = await obtenerReceta(id);
      setBaseDataReceta(response.data);
      const [recetaEspecifica] = response.data;
      let newArrIngredientes =
        recetaEspecifica.ingredientes.length != 0
          ? recetaEspecifica.ingredientes.map(function (item) {
              return {
                ingrediente: item.ingrediente,
                ingrediente_nombre: item.ingrediente_nombre,
                cantidad: item.cantidad + " " + item.unidad,
              };
            })
          : [];
      let newArrPreparacion =
        recetaEspecifica.preparacion.length != 0
          ? recetaEspecifica.preparacion.map(function (item) {
              return {
                detalle: item.detalle,
                url_imagen: item.url_imagen,
              };
            })
          : [];
      let comentarios = recetaEspecifica.comentarios || [] 
      setBaseDataIngredientes(newArrIngredientes);
      setBaseDataPreparacion(newArrPreparacion);
      setBaseDataComentarios(comentarios)
      setImagen(recetaEspecifica.ruta_imagen);
      setIsLoading(false);
      setReload(false);
    };
    listar();
  }, [reload]);

  useEffect(() => {
    const recetaFav = async () => {
      const response = await isRecetaFavorita({
        id_usuario: auth.data._id,
        id_receta: id,
      });
      setIsFavorito(response.data);
      setReloadFavorito(false);
    };
    recetaFav();
  }, [reloadFavorito]);

  const modalRecetaFav = async () => {
    let response = await recetaFavorita({
      id_usuario: auth.data._id,
      id_receta: id,
    });
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
    setReloadFavorito(true);
  };

  const columnsIngredientes = [
    {
      title: "Ingredientes",
      dataIndex: "ingrediente_nombre",
      key: "ingrediente",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
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
              renderItem={(item) => (
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
                  extra={
                    isFavorito ? (
                      <>
                        {" "}
                        <br />{" "}
                        <Button
                          shape="round"
                          type="danger"
                          icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                          onClick={() => modalRecetaFav()}
                        />{" "}
                      </>
                    ) : (
                      <>
                        <br />
                        <Button
                          shape="round"
                          type="dashed"
                          icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                          onClick={() => modalRecetaFav()}
                        />
                      </>
                    )
                  }
                >
                  <List.Item.Meta
                    className="list-item-meta-receta"
                    avatar={<Avatar size={64} src={item.usuario.url_avatar} />}
                    title={item.nombre}
                    description={
                      <>
                        Por:{" "}
                        <a href={`/cocina/usuarios/${item._id}`}>
                          {item.usuario.nombres +
                            " " +
                            item.usuario.apellido_paterno +
                            " " +
                            (item.usuario.apellido_materno.length != 0
                              ? item.usuario.apellido_materno
                              : "")}
                        </a>
                      </>
                    }
                  />
                  {item.descripcion}
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Divider />

        <Row>
          <Col span={6} offset={1}>
            <h2> Lista de ingredientes</h2>{" "}
          </Col>
        </Row>

        <Row>
          <Col className="col1" span={14}>
            <Table
              className="tabIngred"
              size="middle"
              columns={columnsIngredientes}
              dataSource={baseDataIngredientes}
              rowSelection={false}
              rowKey={(record) => record._id}
              loading={isLoading}
              pagination={false}
              {...props}
            />
          </Col>
          <Col className="col2" span={9}>
            <Image className="plato" preview={true} src={imagen} />
          </Col>
        </Row>
        <Divider />

        <Row span={6} offset={1}>
          <h2>Preparación</h2>{" "}
        </Row>

        <Col className="fonCol" span={"auto"}>
          <div className="site-card-wrapper">
            <Row gutter={12}>
              {baseDataPreparacion.map((item, i = 0) => (
                <>
                  <Col className="receta-card" span={12}>
                    <Card
                      className="tarjeta"
                      type="inner"
                      hoverable
                      title={`Paso ${i + 1}`}
                      bordered={true}
                      cover={
                        <Row>
                          <br />

                          {item.url_imagen.length != 0 ? (
                            <Avatar
                              size={300}
                              style={{
                                margin: 15,
                                width: "auto",
                                minHeight: "700",
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
                    >
                      <div class="estil-1">{item.detalle}</div>
                    </Card>
                  </Col>
                </>
              ))}
            </Row>
          </div>
        </Col>

        {/* Coments Section */}
        <PageHeader className="site-page-header" title="Comentarios">
          <Divider style={{ marginTop: "10px" }} />
          <List
            className="lista-platillos"
            loading={isLoading}
            itemLayout="vertical"
            dataSource={baseDataComentarios}
            bordered={false}
            pagination={{
              onChange: (page) => {},
              pageSize: 4,
              responsive: true,
              onShowSizeChange: (current, pageSize) =>
                (this.pageSize = pageSize),
            }}
            renderItem={(item) => (
              <List.Item
                className="lista-objeto"
                actions={[
                  <Button
                    className="boton-ver-recetas"
                    shape="round"
                    type="dashed"
                    icon={<EyeOutlined />}
                    /* href={`/cocina/platillos/${item._id}`} */
                  >
                    Ver recetas
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  className="lista-objeto-meta"
                  avatar={
                    item.avatarImage ? (
                      <Avatar
                        size={128}
                        src="error"
                        fallback="data:image/png;base64,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"
                      />
                    ) : (
                      <Avatar size={130} src={item.avatarImage} />
                    )
                  }
                  title={`${item.username ? item.username : ""}`}
                  description={item.content ? item.content : ""}
                />
                {
                  {/* <div className="etiquetas">
                    {item.categoria.map((catego) => {
                      let color = catego.length > 5 ? "volcano" : "volcano";
                      if (catego === "loser") {
                        color = "volcano";
                      }
                      return (
                        <Tag className="etiqueta" color={color} key={catego}>
                          {catego.toUpperCase()}
                        </Tag>
                      );
                    })}
                  </div> */}
                }
              </List.Item>
            )}
          />
        </PageHeader>

        <br />
      </div>
    </>
  );
}
