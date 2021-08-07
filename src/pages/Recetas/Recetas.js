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
import { HeartTwoTone, UserOutlined } from "@ant-design/icons";
import {
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined,
  LikeTwoTone,
  DislikeTwoTone,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  obtenerReceta,
  listarRecetas,
  modificarReceta,
} from "../../api/receta";
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
  const [baseDataComentarios, setBaseDataComentarios] = useState([]);
  const [comentario, setComentario] = useState("");
  const [reloadComentarios, setReloadComentarios] = useState(false);

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
      let comentarios = recetaEspecifica.comentarios || [];
      setBaseDataIngredientes(newArrIngredientes);
      setBaseDataPreparacion(newArrPreparacion);
      setBaseDataComentarios(comentarios);
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

  useEffect(() => {
    if (baseDataReceta.length !== 0) {
      const [recetaEspecifica] = baseDataReceta;
      let comentarios = recetaEspecifica.comentarios || [];
      setBaseDataComentarios(comentarios);
      setReloadComentarios(false);
    }
  }, [reloadComentarios]);

  const addComent = async () => {
    setBaseDataReceta((prevState) => {
      const user = auth.data;
      const [recetaEspecifica] = prevState;
      recetaEspecifica.comentarios = [
        {
          username: `${user.nombres} ${user.apellido_paterno} ${user.apellido_materno} `,
          usuario: user._id,
          avatarImage: "",
          content: comentario,
          likes: 0,
          dislikes: 0,
        },
        ...recetaEspecifica.comentarios,
      ];
      return [recetaEspecifica];
    });

    const [recetaespeficia] = baseDataReceta;
    modificarReceta(recetaespeficia._id, recetaespeficia)
      .then((response) => {
        setComentario("");
        setReloadComentarios(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleComentario = ({ target: { value } }) => setComentario(value);

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

  const commentsheader = (
    <div className="addComentSection">
      <Row>
        <Col className="avatardiv" span={4}>
          <Avatar size={80} icon={<UserOutlined />} />
          <h5 className="username">{auth.data.nombres}</h5>
        </Col>
        <Col className="content" span={20}>
          <Input.TextArea
            className="textArea"
            value={comentario}
            onChange={handleComentario}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Col>
      </Row>
      <Row className="buttonsSection">
        <Button shape="round" type="danger" onClick={() => addComent()}>
          Comentar
        </Button>
        <Button shape="round" type="danger" onClick={() => setComentario("")}>
          Cancelar
        </Button>
      </Row>
    </div>
  );

  // funcion para comprobar el tipo de valoracion y el indice en el cual esta el usuario si lo valoro (positivamente o no)
  const typeAppreciation = (valoradores) => {

    const { positivos, negativos } = valoradores;
    const userid = auth.data._id;
    const searchUserid = (valorador) => valorador == userid;
    const iposti = positivos.findIndex(searchUserid);
    const inega = negativos.findIndex(searchUserid);
    if (iposti !== -1)
      return {
        typeofAppreciation: "positivos",
        indexofAppreciation: iposti,
      };
    if (inega !== -1)
      return {
        typeofAppreciation: "negativos",
        indexofAppreciation: inega,
      };
    return { typeofAppreciation: "no valorados", indexofAppreciation: -1 };
  };

  const editAppreciation = (commentid, islike) => {
    setBaseDataReceta((prevState) => {
      const userid = auth.data._id;
      const [recetaEspecifica] = prevState;

      const index = recetaEspecifica.comentarios.findIndex(
        (element) => element._id == commentid
      );

      if (index !== -1) {
        // Comprobacion de si el comentario ya fue valorado
        const {typeofAppreciation, indexofAppreciation} = typeAppreciation(
          recetaEspecifica.comentarios[index].valoradores
        );

        console.log("🚀 ~ file: Recetas.js ~ line 255 ~ setBaseDataReceta ~ indexofAppreciation", indexofAppreciation)

        
        // funciones de actualizacion
        const valoracionUpdates = {
          removeOff(type) {
            recetaEspecifica.comentarios[index].valoradores[type].splice(
              indexofAppreciation,
              1
            );
              
              console.log("🚀 ~ file: Recetas.js ~ line 261 ~ removeOff ~ recetaEspecifica.comentarios[index].valoradores[type]", recetaEspecifica.comentarios[index].valoradores[type])
          },
          addTo(type) {
            recetaEspecifica.comentarios[index].valoradores[type] = [
              ...recetaEspecifica.comentarios[index].valoradores[type],
              userid,
            ];
          },
        };

        if (typeofAppreciation == "positivos") {
          if (islike) {
            recetaEspecifica.comentarios[index].likes--;
            valoracionUpdates.removeOff("positivos");
          } else {
            recetaEspecifica.comentarios[index].likes--;
            valoracionUpdates.removeOff("positivos");
            recetaEspecifica.comentarios[index].dislikes++;
            valoracionUpdates.addTo("negativos");
          }
        } else if (typeofAppreciation == "negativos") {
          if (islike) {
            recetaEspecifica.comentarios[index].likes++;
            valoracionUpdates.addTo("positivos");
            recetaEspecifica.comentarios[index].dislikes--;
            valoracionUpdates.removeOff("negativos");
          } else {
            recetaEspecifica.comentarios[index].dislikes--;
            valoracionUpdates.removeOff("negativos");
          }
        } else {
          if (islike) {
            recetaEspecifica.comentarios[index].likes++;
            valoracionUpdates.addTo("positivos");
          } else {
            recetaEspecifica.comentarios[index].dislikes++;
            valoracionUpdates.addTo("negativos");
          }
        }
      }
      return [recetaEspecifica];
    });

    // Actualizacion del servicio
     const [recetaespeficia] = baseDataReceta;
     
    modificarReceta(recetaespeficia._id, recetaespeficia)
      .then((response) => {
        console.log("Actualizado")
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="main-container">
        <Row>
          <Col span={24}>
            <List
              loading={isLoading}
              itemLayout="vertical"
              dataSource={baseDataReceta}
              renderItem={(item) => (
                <List.Item
                  /* actions={[ isFavorito ? <Button shape="round"
                    type="danger"
                    icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                    onClick={() => modalRecetaFav()}
                   /> :
                    <Button shape="round"
                      type="dashed"
                     icon={<HeartTwoTone twoToneColor="#eb2f96" />}
                      onClick={() => modalRecetaFav()}
                     />]} */
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
                  <div class="estil-2">{item.descripcion}</div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Divider />

        <Row>
          <Col span={12} offset={1}>
            <h2> Lista de ingredientes</h2>{" "}
          </Col>
        </Row>

        <Row>
          <Col className="col1" span={12}>
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
          <Col className="col2" span={12}>
            <Image className="plato" preview={true} src={imagen} />
          </Col>
        </Row>
        <Divider />

        <Row span={6} offset={1}>
          <h2>Preparación</h2>
        </Row>

        <Col className="fonCol" span={"auto"}  >
          <div className="site-card-wrapper">
            <Row gutter={12}>
              {baseDataPreparacion.map((item, i = 0) => (
                <>
                  <Col className="receta-card" 
                    span={12}>
                    
                    <Card
                      className="tarjeta"
                      hoverable
                      title={`Paso ${i + 1}`}
                      cover={
                        <Row >
                          <br />
                          {item.url_imagen.length != 0 ? (
                            <Avatar
                              size={600}
                              style={{
                                margin: 15,
                                width: "auto",
                                minHeight: "600",
                                borderRadius: 20,
                                aling: "center",
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
        <br></br>
        <dir></dir>

        {/* Coments Section */}
        <PageHeader className="site-page-header" title="Comentarios">
          <Divider style={{ marginTop: "10px" }} />
          <List
            className="lista-platillos"
            loading={isLoading}
            itemLayout="vertical"
            header={commentsheader}
            dataSource={baseDataComentarios}
            bordered={false}
            pagination={{
              onChange: (page) => {},
              pageSize: 3,
              responsive: true,
              onShowSizeChange: (current, pageSize) =>
                (this.pageSize = pageSize),
            }}
            renderItem={(item) => (
              <List.Item>
                <div className="comentBox">
                  <Row>
                    <Col className="avatardiv" span={4}>
                      <Avatar size={80} icon={<UserOutlined />} />
                    </Col>
                    <Col className="content" span={20}>
                      <h5 className="username">{item.username}</h5>
                      <Input.TextArea
                        className="content"
                        disabled={true}
                        value={item.content}
                        placeholder=""
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                      {/*  <useAppreciation
                        likes={item.likes}
                        dislikes={item.likes}
                        typeAppreciation="negative"
                      /> */}
                      <Row>
                        <Button
                          icon={
                            typeAppreciation(item.valoradores)
                              .typeofAppreciation == "positivos" ? (
                              <LikeTwoTone />
                            ) : (
                              <LikeOutlined />
                            )
                          }
                          className="buttonlike"
                          onClick={() => editAppreciation(item._id, true)}
                        >
                          <h5 className="contador">{item.likes}</h5>
                        </Button>
                        <Button
                          icon={<DislikeOutlined />}
                          icon={
                            typeAppreciation(item.valoradores)
                              .typeofAppreciation == "negativos" ? (
                              <DislikeTwoTone />
                            ) : (
                              <DislikeOutlined />
                            )
                          }
                          className="buttonlike"
                          /* ghost={ typeAppreciation(item.valoradores).typeofAppreciation == "negativos" } */
                          onClick={() => editAppreciation(item._id, false)}
                        >
                          <h5 className="contador">{item.dislikes}</h5>
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </List.Item>
            )}
          />
        </PageHeader>
        <br />
      </div>
    </>
  );
}
