import clienteAxios from "../config/axios";
import { HEADERS } from "../config/constantes";


export const agregarIngrediente = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/ingredientes/', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listarIngredientes = async () => {
    try {
        const respuesta = await clienteAxios.get('/ingredientes/', HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}


export const obtenerCategoria = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/ingredientes/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerIngredientePorNombre = async (nombre) => {
    try {
        const respuesta = await clienteAxios.get(`/ingredientes/nombre/${nombre}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerIngredientePorTipo = async (tipo) => {
    try {
        const respuesta = await clienteAxios.get(`/ingredientes/tipo/${tipo}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const modificarIngrediente = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/ingredientes/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}