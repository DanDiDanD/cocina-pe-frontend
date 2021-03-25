import clienteAxios from "../config/axios";
import { HEADERS } from "../config/constantes";


export const agregarReceta = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/recetas/', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listarRecetas = async () => {
    try {
        const respuesta = await clienteAxios.get('/recetas/', HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}


export const obtenerReceta = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/recetas/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerRecetaPorNombre = async (nombre) => {
    try {
        const respuesta = await clienteAxios.get(`/recetas/nombre/${nombre}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerRecetaPorNombreCategoria = async (categoria) => {
    try {
        const respuesta = await clienteAxios.get(`/recetas/categoria/${categoria}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const modificarReceta = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/recetas/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerRecetaPorIngredientesId = async (id,params) => {
    try {
        const respuesta = await clienteAxios.post(`/recetas/ingredientes/`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerRecetaPorPlatillo = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/recetas/platillos/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerMisRecetas = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/recetas/usuario/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const obtenerMisFavoritos = async (params) => {
    try {
        const respuesta = await clienteAxios.post(`/recetas/favoritos/`,params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}