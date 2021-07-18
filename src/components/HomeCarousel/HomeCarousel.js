import React from "react";
import { Carousel } from "react-responsive-carousel";

export default () => (
  <Carousel autoPlay
    className="carousel-home" 
    dynamicHeight={true}  
    infiniteLoop={true}
    interval={5000}
    showThumbs={false}
    >
    <div>
      <img alt="" src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB15poFh.img?h=1080&w=1920&m=6&q=60&o=t&l=f" />
    </div>
    <div>
      <img alt="" src="https://www.krisporelmundo.com/wp-content/uploads/2016/03/20140618_210420.jpg" />
    </div>
  </Carousel>
);
