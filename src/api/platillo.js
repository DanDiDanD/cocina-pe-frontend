import clienteAxios from "../config/axios";
import { HEADERS } from "../config/constantes";


export const agregarPlatillo = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/platillos/', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listarPlatillos = async () => {
    try {
        const respuesta = await clienteAxios.get('/platillos');
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerPlatilloPorNombre = async (nombre) => {
    try {
        const respuesta = await clienteAxios.get(`/platillos/nombre/${nombre}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerPlatilloPorNombreCategoria = async (categoria) => {
    try {
        const respuesta = await clienteAxios.get(`/platillos/categoria/${categoria}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerPlatillo = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/platillos/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const modificarPlatillo = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/platillos/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}