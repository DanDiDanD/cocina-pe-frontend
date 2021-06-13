import React from 'react'
import { Result, Button } from "antd";
import { useHistory  } from 'react-router-dom';
import {RUTAS} from '../config/constantes';

export function Error404() {
    const history = useHistory();

    const handleClick = () => {
        history.push(RUTAS.home);
    }

    return (
      <Result
        status="404"
        title="404"
        subTitle="La página visitada no existe."
        extra={<Button shape="round" type="primary" onClick={handleClick} >Regresar</Button>}
      />
    );
  }