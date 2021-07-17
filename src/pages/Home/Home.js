import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  Image,
  Card,
  Meta,
  Avatar,
  Modal as ModalAs,
} from "antd";
import {
  HomeOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Modal from "../../components/Modal";
import { listarPlatillos } from "../../api/platillo";
import HomeCarousel from "../../components/HomeCarousel";
import "./Home.scss";
import "../Container.scss";
import image from "../../assets/img/png/tus_mejores_recetas.png";
import { authContext } from "../../providers/AuthContext";

const { confirm } = ModalAs;

export default function Home() {
  const [reloadPlatillos, setReloadPlatillas] = useState(false);
  const [platillos, setPlatillos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contador, setContador] = useState(-2);
  const [cardHTML, setCardHTML] = useState(<></>);
  const { setAuthData, auth } = useContext(authContext);
  const { Meta } = Card;

  useEffect(() => {
    async function fetchData() {
      const response = await listarPlatillos();
      await setPlatillos(randomSort(response.data));
      setReloadPlatillas(false);
      setIsLoading(false);
      setContador(0);
      localStorage.setItem("ruta_siguiente", "");
    }
    fetchData();
  }, [reloadPlatillos]);

  const recetaCard = (indice) => {
    if (auth.data) {
      window.location.href = `/cocina/platillos/${platillos[indice]._id}`;
    } else {
      localStorage.setItem(
        "ruta_siguiente",
        `/cocina/platillos/${platillos[indice]._id}`
      );
      window.location.href = `/login`;
    }
  };

  const modalPremium = () => {
    let titulo = "¡Pase a pertenecer a la comunidad de Cocina Pe!";
    let contenido =
      "Al volverse miembro premium de la comunidad de Cocina Pe tendrá acceso a sugerencias ilimitadas todos los días";
    let text = "¡Hazme miembro!";
    confirm({
      title: titulo,
      content: contenido,
      okText: text,
      okType: "danger",
      cancelText: "Ahora no",
    });
  };

  useEffect(() => {
    function escribir() {
      const data = JSON.parse(window.localStorage.getItem("authData"));
      // const is_premium = data.is_premium;
      let bandera = true;
      if (data === null) {
        bandera = false;
      } else if (!data.is_premium) {
        bandera = false;
      }
      if (platillos.length != 0) {
        if (!bandera && contador >= 4) {
          if (data == null) {
            window.location.href = `/login`;
          } else {
            modalPremium();
            setContador(0);
          }
        } else {
          const indices = [
            contador % platillos.length,
            (contador + 1) % platillos.length,
            (contador + 2) % platillos.length,
          ];
          /* const indice_card1 = contador % platillos.length;
          const indice_card2 = (contador + 1) % platillos.length; */

          return (

            <Row justify="space-around" align="middle" /* className="row" */>
              {indices.map((indice) => (
                <Col
                  xs={{ span: 18 }}
                  md={{ span: 12 }}
                  xl={{ span: 6 }}
                  className="card-bonito"
                >
                  <Row justify="center">
                    <Card
                      className="card-container"
                      type="inner"
                      hoverable
                      cover={
                        platillos[indice].ruta_imagen.length != 0 ? (
                          <img className="imagen-bonita" width={250} height={320} object-fit="cover" src={platillos[indice].ruta_imagen} />
                        ) : (
                          <Image
                            height={320}
                            src="error"
                            fallback="data:image/png;base64,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"
                          />
                        )
                      }
                      actions={[<span>Ver recetas</span>]}
                      onClick={() => recetaCard(indice)}
                    >
                      <Meta
                        title={platillos[indice].nombre}
                        description={`${platillos[indice].descripcion.substring(
                          0,
                          128
                        )}...`}
                      />
                    </Card>
                  </Row>
                </Col>
              ))}
            </Row>
          );
        }
      } else {
        return <></>;
      }
    }
    setCardHTML(escribir());
  }, [contador]);

  const recargarPlatillos = () => {
    setContador(contador + 2);
  };

  return (
    <>
      {/* <div className="div-image">
        <Image src={image} className="site-page-image" preview={false} />
      </div> */}
      <HomeCarousel />
      <div className="main-container inicio-autenticado">
        <PageHeader title="¿Qué deseas comer hoy?" className="container-title">
          <div className="container">{cardHTML}</div>
          <br/>
          <Row justify="space-around">
            <Col span={10}>
              <Button shape="round"
                className="button-reload"
                key="1"
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={recargarPlatillos}
              >
                Recargar
              </Button>
            </Col>
          </Row>
        </PageHeader>
      </div>
    </>
  );
}

const seed = () => {
  let date = new Date();
  let day = date.getDay();
  let month = date.getMonth();
  let year = date.getFullYear();
  const semilla = Date.UTC(year, month, day);
  let resultado = Math.sin(semilla) * 10000;
  return resultado - Math.floor(resultado);
};

function randomSort(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    if (
      localStorage.getItem("authData").toString() === "null" ||
      JSON.parse(localStorage.getItem("authData")).is_premium === false
    ) {
      randomIndex = Math.floor(seed() * currentIndex);
    } else {
      randomIndex = Math.floor(Math.random() * currentIndex);
    }
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
