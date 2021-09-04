import React, {useState, useContext} from 'react';
import { Menu, Button, Row, Col, Space, Image, Modal as ModalAs } from 'antd';
import { Link } from "react-router-dom";
import './MenuTopMain.scss'
import { authContext } from "../../providers/AuthContext";
import { RUTAS } from "../../config/constantes";
import Modal from "../Modal";
import AddRecetaModal from '../Recetas/AddRecetaModal'
import logo from '../../assets/img/png/cocinape.png';
import logopremium from '../../assets/img/png/cocinapepremium.png';
import {
    HomeOutlined,
    UserOutlined,
    ScheduleOutlined,
    PoweroffOutlined,
    TeamOutlined,
    PlusCircleFilled
  } from "@ant-design/icons";

const { confirm } = ModalAs;

export default function MenuTopMain(props) {
    const [isVisibleModal, setIsVisibleModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState(null);
    const {auth, onLogOut} = props;
    console.log(auth);
    
    const addReceta = () => {
        setIsVisibleModal(true);
        setModalTitle("Nueva receta");
        setModalContent(
          <AddRecetaModal
            setIsVisibleModal={setIsVisibleModal}
          />
        );
      };


    const modalPremium = () => {
    let titulo = '¡Pase a pertenecer a la comunidad de Cocina Pe!'
    let contenido = 'Al volverse miembro premium de la comunidad de Cocina Pe tendrá acceso a todos los platillos y recetas disponibles'
    let text = '¡Hazme miembro!'
    confirm({
        title: titulo,
        content: contenido,
        okText: text,
        okType: "danger",
        onOk() {
            window.location.href = '/cocina/premium'
        },
        cancelText: "Ahora no",
    });
    };
    return (
        <>
            {auth.data.is_premium ? (
                <Image src={logopremium} className="menu-top__img-logo"/>
            ):
                <Image src={logo} className="menu-top__img-logo"/>
            
            }
            {auth.data.tipo_usuario === "admin" ? (
                <Menu theme="dark" mode="horizontal" style={{color: "red"}, {backgroundColor: "#dd621b"}}>
                    <Menu.Item className="menu-top__menu-item" key={RUTAS.cocina}>
                        <Link to={RUTAS.cocina}>Inicio</Link>
                    </Menu.Item>
                    <Menu.Item className="menu-top__menu-item" key={RUTAS.platillo}>
                        <Link to={RUTAS.platillo}>Platillos</Link>
                    </Menu.Item>
                    <Menu.Item className="menu-top__menu-item" key={`/cocina/usuarios/${auth.data._id}`}>
                        <Link to={`/cocina/usuarios/${auth.data._id}`}>Mi perfil</Link>
                    </Menu.Item>
                    <Menu.Item className="menu-top__menu-item" key={RUTAS.usuario}>
                        <Link to={RUTAS.usuario}>Usuarios</Link>
                    </Menu.Item>
                    
                </Menu>
            ) : (
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item className="menu-top__menu-item" key={RUTAS.cocina}>
                        <Link to={RUTAS.cocina}>Inicio</Link>
                    </Menu.Item>
                    <Menu.Item className="menu-top__menu-item" key={RUTAS.platillo}>
                        {auth.data.is_premium ? <Link to={RUTAS.platillo}>Platillos</Link> : <Link onClick={() => modalPremium()}>Platillos</Link> }
                    </Menu.Item>
                    <Menu.Item className="menu-top__menu-item" key={`/cocina/usuarios/${auth.data._id}`}>
                        <Link to={`/cocina/usuarios/${auth.data._id}`}>Mi perfil</Link>
                    </Menu.Item>
                    
                </Menu>
            )} 

            <div className="menu-top__btn-header">
            <Space>
                <Button shape="round"
                type="primary"
                icon={<PlusCircleFilled twoToneColor="#fa541c" />}
                onClick={addReceta}
                >
                Nueva Receta
                </Button>
                
                <Button shape="round"
                type="primary"
                icon={<PoweroffOutlined />}
                href={`/`}
                onClick={onLogOut}
                >
                Salir
                </Button>
            </Space>
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
};

