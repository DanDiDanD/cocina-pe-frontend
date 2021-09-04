import React, { useState, useEffect, useContext, useRef } from "react";
import ReactDOM from 'react-dom'
import {
  Row,
  Col,
  Button,
  Form,
  Input,
  InputNumber,
  Typography,
  PageHeader,
  Card,
  Space,
  Divider,
  Radio,
  notification,
  Modal as ModalAs,
} from "antd";

import {loadStripe} from '@stripe/stripe-js'
import {Elements, CardElement, useStripe ,useElements, CardNumberElement} from '@stripe/react-stripe-js'

import Cards from 'react-credit-cards';
import Modal from "../../components/Modal/ModalPremium";
import PagoPremium from '../../components/Premium'
import { authContext } from "../../providers/AuthContext";
import {usuarioPremium} from '../../api/usuarios'

import "./Premium.scss";
import "../Container.scss";

const { confirm } = ModalAs;
const {Text, Title} = Typography
const  stripePromise = loadStripe("pk_test_51JTEFaC7aH81BBFs29xXFaKryRPDxVosO0D68i8bRKINQWSdvcVGTkBbtG3kUr5Uwun3v00gO1pBIMHy840SYiZO00QBQgbYuL")

export default function Premium(){
    const { setAuthData, auth } = useContext(authContext);
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState(null);

    const changeData = () => {
        const authData = JSON.parse(localStorage.getItem('authData'))
        authData.is_premium = true;
        setAuthData(authData);
        
    };

    const estandar = {
        titulo: 'Estándar',
        descripcion1: 'Adquiere tu suscripción a la comunidad de Cocina Pe durante',
        tiempo: 'un(1) mes',
        descripcion2: '.',
        precioSol: 'S/11.96*',
        precioDolar: '$2.99'
    }

    const yapa = {
        titulo: 'Yapa',
        descripcion1: 'Adquiere tu suscripción Yapa por',
        tiempo: 'tres(3) meses',
        descripcion2: 'y ahorra un 11% del costo total.',
        precioSol: 'S/23.97*',
        precioDolar: '$7.99'
    }

    const superYapa = {
        titulo: 'Super Yapa',
        descripcion1: 'Adquiere tu suscripción Super Yapa por',
        tiempo: 'seis(6) meses',
        descripcion2: 'y ahorra un 20% del costo total.',
        precioSol: 'S/59.96*',
        precioDolar: '$14.99'
    }

    const premium = {
        titulo: 'Premium',
        descripcion1: 'Adquiere tu suscripción Premium por',
        tiempo: 'doce(12) meses',
        descripcion2: 'y ahorra un 30% del costo total',
        precioSol: 'S/99.95*',
        precioDolar: '$24.99'
    }

    const onButton1 = async () => await modalPago({option:'1',price: 299, description: 'Suscripción Estándar', data:estandar })
    const onButton2 = async () => await modalPago({option:'2',price: 799, description: 'Suscripción Yapa', data:yapa })
    const onButton3 = async () => await modalPago({option:'3',price: 1499, description: 'Suscripción Super Yapa', data:superYapa })
    const onButton4 = async () => await modalPago({option:'4',price: 2499, description: 'Suscripción Premium', data:premium})

    const modalPago = async (informacion) => {
        setIsVisibleModal(true);
        // setModalTitle(opcion);
        setModalContent(
          <PagoPremium
            setIsVisibleModal={setIsVisibleModal}
            id={JSON.parse(localStorage.getItem('authData'))._id}
            informacion={informacion}
            onFinishPremium={onFinishPremium}
          />
        );
    }


    const onFinishPremium = async (value) => {
        const id = JSON.parse(localStorage.getItem('authData'))._id
        console.log(id)

        const response = await usuarioPremium(id, value);

        if (response.code === 200) {
            await notification["success"]({
              message: "Éxito",
              description: response.message,
            });
            changeData();
            setTimeout(function(){ window.location.href ='/cocina' }, 1000);
            // window.location.href ='/cocina' 
      
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
        console.log(response)
    }

    return (
    <div className="premium-css">
        <div 
            className="container-premium"
        >
        <div className="premium-css_container">

            <br/>
            <br/>
            <Title level={2} className="container-title">Elige tu tipo de suscripción</Title>
            <div className="premium-card_precios_content">
                <br/>
            <Text className="text-precios_contenido_footer">Pasa a convertirte en miembro de la comunidad de Cocina Pe y ten acceso a los más de 10 mil platos que tenemos para ti.</Text>
            <Text className="text-precios_contenido_footer">Consigue 2 meses gratis si compras 1 año de Premium</Text>
            </div>
            <br/>
            <Divider className="premium_divider"/>

            <Row className="premium_precios_row">
                <Col span={6}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">{estandar.titulo}</Title>
                            <Text className="text-precios_contenido">{estandar.descripcion1} <Text className="text-precios_contenido_tiempo">{estandar.tiempo}</Text>{estandar.descripcion2}</Text>
                            <br/><br/>
                            <br/>
                            <br/>
                            <div className="premium-bottom-space"></div>
                            <Text className="text-precios_contenido_soles">{estandar.precioSol}</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">{estandar.precioDolar}</Text>
                            <br/>
                            <Button onClick={onButton1} size="large">Comprar Estándar</Button>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">{yapa.titulo}</Title>
                            <Text className="text-precios_contenido">{yapa.descripcion1} <Text className="text-precios_contenido_tiempo">{yapa.tiempo} </Text>{yapa.descripcion2}</Text>
                            <br/><br/>
                            <br/>
                            <br/>
                            <div className="premium-bottom-space"></div>
                            <Text className="text-precios_contenido_soles">{yapa.precioSol}</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">{yapa.precioDolar}</Text>
                            <br/>
                            <Button onClick={onButton2} size="large">Comprar Yapa</Button>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">{superYapa.titulo}</Title>
                            <Text className="text-precios_contenido">{superYapa.descripcion1} <Text className="text-precios_contenido_tiempo">{superYapa.tiempo} </Text>{superYapa.descripcion2}</Text>
                            <br/><br/>
                            <br/>
                            <Text className="text-precios_contenido_soles">{superYapa.precioSol}</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">{superYapa.precioDolar}</Text>
                            <br/>
                            <Button onClick={onButton3} size="large">Comprar Super Yapa </Button>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">{premium.titulo} </Title>
                            <Text className="text-precios_contenido">{premium.descripcion1} <Text className="text-precios_contenido_tiempo">{premium.tiempo} </Text>{premium.descripcion2} </Text>
                            <br/><br/>
                            <br/>
                            <Text className="text-precios_contenido_soles">{premium.precioSol} </Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">{premium.precioDolar} </Text>
                            <br/>
                            <Button onClick={onButton4} size="large">Comprar Premium</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <br/>

            <Divider className="premium_divider"/>
            <div className="container-footer">
                <Text className="text-precios_contenido_footer">* El precio en tu moneda local es solo una estimación. Se te cobrará el precio mostrado en dólares para todas las transacciones.</Text>
            </div>
        </div>
        <br/>
        </div>
        <Modal
          title={modalTitle}
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          footer={false}
          witdh={400}
        >
            {modalContent}
        </Modal>
    </div>
    );
}
