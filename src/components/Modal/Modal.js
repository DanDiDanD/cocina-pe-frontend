import React from "react";
import { Modal as ModalAntd } from "antd";
import './Modal.scss'

export default function Modal(props) {
  // console.log(props)
  const { children, title, isVisible, setIsVisible, footer, ...other } = props;
  return (
    <ModalAntd
      className='modal-cocina-pe'
      title={title}
      centered
      visible={isVisible}
      onCancel={() => {setIsVisible(false); localStorage.setItem('url_imagen_base64','')}}
      footer={footer}
      // maskClosable={false}
      destroyOnClose={true}
      width={500}
      {...other}
    >
      {children}
    </ModalAntd>
  );
}

