import React, { useState, useEffect, useContext } from "react";
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
  Avatar,
  List,
  Button,
} from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined,
  LikeTwoTone,
  DislikeTwoTone,
} from "@ant-design/icons";
import { obtenerRecetaPorPlatillo, modificarReceta } from "../../api/receta";
import { authContext } from "../../providers/AuthContext";
import { useParams } from "react-router-dom";
import "./Platillos.scss";

export default function PlatillosId() {
  const { id } = useParams();
  const { auth } = useContext(authContext);
  const [reloadPlatillos, setReloadPlatillos] = useState(false);
  const [baseData, setBaseData] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function listarPlatillosApi() {
      let response = await obtenerRecetaPorPlatillo(id);
      if (response && response.length != 0) {
        let newArr = response.data.map(function (item) {
          return {
            _id: item._id,
            nombre: item.nombre,
            nombre_usuario:
              item.usuario.nombres + " " + item.usuario.apellido_paterno,
            url_avatar: item.usuario.url_avatar,
            descripcion: item.descripcion,
            porciones: item.porciones,
            ruta_imagen: item.ruta_imagen,
            fecha_creacion: item.fecha_creacion,
            likes: item.likes,
            dislikes: item.dislikes,
            valoradores: item.valoradores,
          };
        });
        setBaseData(newArr);
        setIsLoading(false);
      }
    }
    listarPlatillosApi();
    setReloadPlatillos(false);
  }, [reloadPlatillos]);

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

  const editAppreciation = (recetaid, islike) => {
    const setBaseOrFilterState = (prevState) => {
      const userid = auth.data._id;
      const recetas = prevState;
      const index = recetas.findIndex((element) => element._id == recetaid);

      if (index !== -1) {
        const { typeofAppreciation, indexofAppreciation } = typeAppreciation(
          recetas[index].valoradores
        );

        // funciones de actualizacion
        const valoracionUpdates = {
          removeOff(type) {
            recetas[index].valoradores[type].splice(indexofAppreciation, 1);
          },
          addTo(type) {
            recetas[index].valoradores[type] = [
              ...recetas[index].valoradores[type],
              userid,
            ];
          },
        };

        if (typeofAppreciation == "positivos") {
          if (islike) {
            recetas[index].likes--;
            valoracionUpdates.removeOff("positivos");
          } else {
            recetas[index].likes--;
            valoracionUpdates.removeOff("positivos");
            recetas[index].dislikes++;
            valoracionUpdates.addTo("negativos");
          }
        } else if (typeofAppreciation == "negativos") {
          if (islike) {
            recetas[index].likes++;
            valoracionUpdates.addTo("positivos");
            recetas[index].dislikes--;
            valoracionUpdates.removeOff("negativos");
          } else {
            recetas[index].dislikes--;
            valoracionUpdates.removeOff("negativos");
          }
        } else {
          if (islike) {
            recetas[index].likes++;
            valoracionUpdates.addTo("positivos");
          } else {
            recetas[index].dislikes++;
            valoracionUpdates.addTo("negativos");
          }
        }

        modificarReceta(recetas[index]._id, recetas[index])
          .then((response) => {
            console.log("Actualizado");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return [...recetas];
    };
    setBaseData(setBaseOrFilterState);
  };

  const search = (value) => {
    if (value !== "") {
      const filterTable = baseData.filter((o) =>
        Object.keys(o).some((k) =>
          String(o[k]).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilterTable(filterTable);
    } else {
      setFilterTable(null);
    }
  };

  return (
    <>
      <div className="master-container  container-platillos">
        <PageHeader
          className="site-page-header"
          title="Recetas de la comunidad"
        >
          <Divider style={{ marginTop: "0px" }} />
          <Row>
            <Col lg={24}>
              <Input.Search
                style={{ margin: "0 0 10px 0" }}
                placeholder="Buscar..."
                enterButton
                onSearch={search}
              />
            </Col>
            <Col lg={24}>
              <List
                className="lista-platillos"
                loading={isLoading}
                itemLayout="vertical"
                dataSource={filterTable == null ? baseData : filterTable}
                bordered={false}
                pagination={{ onChange: (page) => {}, pageSize: 5 }}
                renderItem={(item) => (
                  <List.Item
                    className="lista-fila ant-col-lg-12 inline-block espacio-derecha alinear-objetos"
                    style={{width:'100%',maxHeight:'198px'}}
                    actions={[
                      <Button
                        className="boton-ver-recetas"
                        shape="round"
                        type="dashed"
                        icon={<EyeOutlined />}
                        href={`/cocina/recetas/${item._id}`}
                      >
                        Ver recetas
                      </Button>,
                    ]}
                    extra={[
                      item.ruta_imagen.length == 0 ? (
                        <Image
                          width={110}
                          height={110}
                          src="error"
                          object-fit="cover"
                          fallback="data:image/png;base64,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"
                        />
                      ) : (
                        <img
                          width={110}
                          height={110}
                          object-fit="cover"
                          src={item.ruta_imagen}
                        />
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      className="lista-objeto-meta"
                      avatar={
                        item.url_avatar.length == 0 ? (
                          <Avatar
                            size={35}
                            src="error"
                            //fallback="data:image/png;base64,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"
                          />
                        ) : (
                          <Avatar size={35} src={item.url_avatar} />
                        )
                      }
                      title={`${item.nombre ? item.nombre : ""}${
                        item.porciones.length != 0
                          ? ` (${item.porciones} porciones)`
                          : ""
                      }`}
                      description={`${item.nombre_usuario}`}
                    />
                    <Col lg={24} className="lista-descripcion-receta">
                      {item.descripcion ? item.descripcion : ""}
                    </Col>
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
                  </List.Item>
                )}
              />
              {/* <Table
              size="middle"
              columns={columns}
              dataSource={
                filterTable == null ? baseData : filterTable
              }
              rowKey={(record) => record._id}
              loading={isLoading}
            /> */}
            </Col>
          </Row>
        </PageHeader>
      </div>
    </>
  );
}
