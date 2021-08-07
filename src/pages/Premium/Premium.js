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
  Modal as ModalAs,
} from "antd";
import Cards from 'react-credit-cards';

import Modal from "../../components/Modal";


import "./Premium.scss";
import "../Container.scss";

const { confirm } = ModalAs;

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
        <div>
            <div className="premium-css_container">
            <PageHeader title="Método de pago" className="container-title"></PageHeader>
            <Row>
                <Col span={9} >
                    <Cards
                        cvc={cvc}
                        expiry={expiry}
                        focused={focus}
                        name={name}
                        number={number}
                    />
                </Col>
                <Col span={12} offset={1}>
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
                        <Form.Item className="site-page-button">
                            <div className="site-page-button-premium">
                            <Button shape="round" size="large" type="primary" htmlType="submit" className="boton-premium">
                                Convierteme en premium
                            </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
 
            </div>
            <br/>
        </div>
        </div>
    </div>
    );
}

