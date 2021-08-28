import React from 'react';
import { Menu } from 'antd';
import { Link } from "react-router-dom";
import { Image } from 'antd';
import logo from '../../assets/img/png/cocinape.png';
import './MenuTop.scss'
import {
    HomeOutlined,
    UserOutlined,
    ScheduleOutlined,
    PoweroffOutlined,
    TeamOutlined,
  } from "@ant-design/icons";


import { RUTAS } from "../../config/constantes";


export default function MenuTop() {

    return (
        <>
            <Image src={logo} className="menu-top__img-logo"/>

            <Menu className="menu-top__menu-todo" theme="dark" mode="horizontal" style={{color: "red"}, {backgroundColor: "#dd621b"}}>
                <Menu.Item className="menu-top__menu-item" key={RUTAS.home}>
                    <Link to={RUTAS.home}>Inicio</Link>
                </Menu.Item>

                <Menu.Item className="menu-top__menu-item" key={'1'}>
                    <Link to={RUTAS.login}>Recetas</Link>
                </Menu.Item>
            </Menu>
        </>
    );
};
