import React from "react";
import { Image, Modal as ModalAs } from 'antd';
import { Carousel } from "react-responsive-carousel";
import './HomeCarousel.scss'
import plato1 from '../../assets/img/png/plato1.jpg';
import plato2 from '../../assets/img/png/plato2.jpg';
import plato3 from '../../assets/img/png/plato3.jpg';

export default () => (
  <Carousel autoPlay
    className="carousel-home"
    //dynamicHeight={false}
    infiniteLoop={true}
    interval={6000}
    showThumbs={false}
    
    >
      <Image src={plato1} className="carousel-img"/>
      <Image src={plato2} className="carousel-img"/>
      <Image src={plato3} className="carousel-img"/>
    
  </Carousel>
);
