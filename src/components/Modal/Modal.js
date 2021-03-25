import React from "react";
import { Modal as ModalAntd } from "antd";

export default function Modal(props) {
  // console.log(props)
  const { children, title, isVisible, setIsVisible, footer, ...other } = props;
  return (
    <ModalAntd
      title={title}
      centered
      visible={isVisible}
      onCancel={() => {setIsVisible(false); localStorage.setItem('url_imagen_base64','')}}
      footer={footer}
      // maskClosable={false}
      destroyOnClose={true}
      width={600}
      {...other}
    >
      {children}
    </ModalAntd>
  );
}

