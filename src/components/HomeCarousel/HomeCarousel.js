import React from "react";
import { Carousel } from "react-responsive-carousel";
import './HomeCarousel.scss'

export default () => (
  <Carousel autoPlay
    className="carousel-home"
    // dynamicHeight={true}
    infiniteLoop={true}
    interval={6000}
    showThumbs={false}
    >
    <div>
      <img className="carousel-img" src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB15poFh.img?h=1080&w=1920&m=6&q=60&o=t&l=f" />
    </div>
    <div>
      <img className="carousel-img" src="http://www.cedna.org/es/wp-content/uploads/2018/07/cocina-peruana-cabecera.jpg" />
    </div>
    <div>
      <img className="carousel-img" src="https://www.revistalabarra.com/wp-content/uploads/2019/11/comida-peruana-1500x800.jpg" />
    </div>
  </Carousel>
);
