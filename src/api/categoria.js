import clienteAxios from "../config/axios";
import { HEADERS } from "../config/constantes";


export const agregarCategoria = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/categorias/', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listarCategorias = async () => {
    try {
        const respuesta = await clienteAxios.get('/categorias/', HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}


export const obtenerCategoria = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/categorias/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const modificarCategoria = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/categorias/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}