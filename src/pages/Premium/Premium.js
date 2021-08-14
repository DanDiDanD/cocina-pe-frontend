import React, { useState, useEffect, useContext } from "react";
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
  Modal as ModalAs,
} from "antd";
import Cards from 'react-credit-cards';

import Modal from "../../components/Modal";


import "./Premium.scss";
import "../Container.scss";

const { confirm } = ModalAs;

const {Text, Title} = Typography

export default function Premium() {
    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [focus, setFocus] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    const handleInputFocus = (e) => {
        setFocus(e.target.name)
    }
      
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch(name){
            case 'expiry':
                setExpiry(value); break
            case 'name':
                setName(value); break
            case 'cvc':
                setCvc(value); break
            case 'number':
                setNumber(value); break
        }
    }

    const onFinish = (value) => {
        console.log(value)
    }

    return (
    <div className="premium-css">
        <div className="main-container">
        <div className="premium-css_container">

            <br/>
            <br/>
            <Title level={2} className="container-title">Elige tu tipo de suscripción</Title>
            <div className="premium-card_precios_content">
                <br/>
            <Text className="text-precios_contenido_footer">Pasa a convertirte en miembro de la comunidad de Cocina Pe y ten acceso a los más de 10 mil platos que tenemos para ti.</Text>
            </div>
            <br/>
            <Divider/>
            <Row>
                <Col span={8}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">Estándar</Title>
                            <Text className="text-precios_contenido">Adquiere tu suscripción a la comunidad de Cocina Pe durante <Text className="text-precios_contenido_tiempo">un(1) mes</Text>   </Text>
                            <br/><br/>
                            <br/>
                            <Text className="text-precios_contenido_soles">S/11.96*</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">$2.99</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">Yapa</Title>
                            <Text className="text-precios_contenido">Adquiere tu suscripción premium por  <Text className="text-precios_contenido_tiempo">tres(3) meses </Text>y ahorra un 11% del costo total </Text>
                            <br/><br/>
                            <br/>
                            <Text className="text-precios_contenido_soles">S/23.97*</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">$7.99</Text>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="premium-card_precios">
                        <div className="premium-card_precios_content">
                            <Title level={3} className="text-precios_title">Super Yapa</Title>
                            <Text className="text-precios_contenido">Adquiere tu suscripción premium por  <Text className="text-precios_contenido_tiempo">seis(6) meses </Text>y ahorra un 20% del costo total </Text>
                            <br/><br/>
                            <br/>
                            <Text className="text-precios_contenido_soles">S/59.96*</Text>
                            <Text>PEN</Text>
                            <Text keyboard className="text-precios_contenido_dolares">$14.99</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={8} >
                    <Cards
                        cvc={cvc}
                        expiry={expiry}
                        focused={focus}
                        name={name}
                        number={number}
                    />
                </Col>
                <Col span={16}>
                    <div className="premium-card">
                    <Form name="basic" onFinish={onFinish}>
                        <Form.Item
                            name="number"
                            rules={[{ required: true, message: 'Rellenar el campo!' },{ pattern: "[0-9]", message: 'Solo puede incluir números' }]}
                        >
                            <Input
                            size="large"
                            className='premium-css_input'
                            // type="number"
                            name="number"
                            // pattern="[0-9]"
                            pattern="\d*"
                            maxlength="16"
                            onkeypress="return isNumberKey(event)" 
                            placeholder="E.g.: 49..., 51..., 36..., 37..."
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            />
                        </Form.Item>

                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Rellenar el campo!' }]}
                        >
                            <Input
                            size="large"
                            className='premium-css_input'
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            />
                        </Form.Item>

                        <Form.Item
                            name="expiry"
                            rules={[{ required: true, message: 'Rellenar el campo!' }]}
                        >
                            <Input
                            size="large"
                            className='premium-css_input'
                            type="number"
                            name="expiry"
                            placeholder="Expiración"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            />
                        </Form.Item>

                        <Form.Item
                            name="cvc"
                            rules={[{ required: true, message: 'Rellenar el campo!' }]}
                        >
                            <Input
                            size="large"
                            className='premium-css_input'
                            type="nomber"
                            name="cvc"
                            placeholder="CVC"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            />
                        </Form.Item>
                        <Form.Item
                            name="radio"
                            rules={[{ required: true, message: 'Rellenar el campo!' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>Estandar</Radio>
                                <Radio value={2}>Yapa</Radio>
                                <Radio value={3}>Super Yapa</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className="site-page-button">
                            <div className="site-page-button-premium">
                            <Button shape="round" size="large" type="primary" htmlType="submit" className="boton-premium">
                                Convierteme en premium
                            </Button>
                            </div>
                        </Form.Item>
                    </Form>
                    </div>
                </Col>
            </Row>
            <Divider />
            <div className="container-footer">
                <Text className="text-precios_contenido_footer">* El precio en tu moneda local es solo una estimación. Se te cobrará el precio mostrado en dólares para todas las transacciones.</Text>
            </div>

        </div>
        <br/>
        </div>
    </div>
    );
}

