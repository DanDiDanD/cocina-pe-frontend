import React from 'react'
import {Form, Typography, Card, Button, Row, Col, Divider, Input} from 'antd'
import {loadStripe} from '@stripe/stripe-js'
import {Elements, CardElement, useStripe ,useElements, CardNumberElement} from '@stripe/react-stripe-js'

import './PagoPremium.scss'
import './FormPremium.scss'

const  stripePromise = loadStripe("pk_test_51JTEFaC7aH81BBFs29xXFaKryRPDxVosO0D68i8bRKINQWSdvcVGTkBbtG3kUr5Uwun3v00gO1pBIMHy840SYiZO00QBQgbYuL")
const {Title, Text} = Typography

const PagoPremium = (props) => {
    const {informacion, onFinishPremium} = props
    return (
        <div 
        className="modal-premium"
        >
            <Row>
                <Col span={13} className="col-premium col-premium_left">
                    <div>
                        <div className="premium-card_precios_content">
                            <Title level={1} className="text-precios-premium_title">{informacion.data.titulo} </Title>
                            <Text className="text-precios-premium_contenido">{informacion.data.descripcion1} <Text className="text-precios-premium_contenido_tiempo">{informacion.data.tiempo} </Text>{informacion.data.descripcion2} </Text>
                            <br/><br/>
                            <Text className="text-precios-premium_contenido_soles">{informacion.data.precioSol} </Text>
                            <Text className="text-precios-premium_contenido_pen">PEN</Text>
                            <Text keyboard className="text-precios-premium_contenido_dolares">{informacion.data.precioDolar} </Text>
                            <br/>
                        </div>
                    </div>
                </Col>
                <Col span={11} className="col-premium col-premium_right">
                    <Elements stripe={stripePromise}>
                        <CheckoutForm  onFinishPremium={onFinishPremium} informacion={informacion}/>
                    </Elements>
                </Col>   
            </Row>
        </div>
    )
}

const CheckoutForm = (props) => {
    const {onFinishPremium, informacion} = props
    const stripe = useStripe();
    const elements = useElements();


    const onFinish = async (value) => {
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        if (!error){
            const {id} = paymentMethod
            const obj = {
                id,
                amount: informacion.price,
                description: informacion.description
            }

            await onFinishPremium(obj);
        }
        // console.log('')
    }

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 24 },
      };

    return (
        <>
            <Form {...layout}  onFinish={onFinish}>
                <Form.Item
                    label='Apellido:'
                    name="apellido"
                    rules={[{required: true,message: 'Por favor ingruese su Apellido',}]}
                >
                    <Input
                    className='premium-css_input'
                    placeholder='Gálvez Gómez'
                    />
                </Form.Item>

                <Form.Item
                    label="Nombre:"
                    name="nombre"
                    rules={[{required: true,message: 'Por favor ingruese su Nombre',}]}
                >
                    <Input
                    className='premium-css_input'
                    placeholder='Fernando'
                    />
                </Form.Item>
                <Form.Item
                    label="E-mail:"
                    name="correo"
                    rules={[{required: true,message: 'Por favor ingruese su E-mail',}]}
                >
                    <Input
                    className='premium-css_input'
                    placeholder='Yung_beef@gmail.com'
                    />
                </Form.Item>

                <Form.Item
                    name="card"
                    rules={[{required: true,message: ''}]}
                >
                    <CardElement/>
                </Form.Item>


                <Form.Item className="site-page-button">
                    <div className="site-page-button-premium">
                    <Button shape="round" size="large" type="primary" htmlType="submit" className="boton-premium">
                        Convierteme en premium
                    </Button>
                    </div>
                </Form.Item>

            </Form>
        </>
    )
}

export default PagoPremium

