import clienteAxios from "../config/axios";
import { HEADERS } from "../config/constantes";


export const login = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/usuarios/login', params);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const registrarUsuario = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/usuarios/', params);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}



export const listaUsuarios = async () => {
    try {
        const respuesta = await clienteAxios.get('/usuarios/', HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const usuarioPremium = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/usuarios/premium/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const quitarUsuarioPremium = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/usuarios/premium/quitar/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const usuarioPremiumInfo = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/usuarios/premium/info/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listaUsuariosPremium = async () => {
    try {
        const respuesta = await clienteAxios.get('/usuarios/premium', HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}
export const listarUsuariosPorActividad = async (bool) => {
    try {
        const respuesta = await clienteAxios.get(`/usuarios/activo/${bool}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const listaUsuario = async (id) => {
    try {
        const respuesta = await clienteAxios.get(`/usuarios/${id}`, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const modificarUsuario = async (id,params) => {
    try {
        const respuesta = await clienteAxios.put(`/usuarios/${id}`, params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const isRecetaFavorita = async (params) => {
    try {
        const respuesta = await clienteAxios.post('/usuarios/favoritas', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}

export const recetaFavorita = async (params) => {
    try {
        const respuesta = await clienteAxios.put('/usuarios/favoritas/accion', params, HEADERS);
        return respuesta.data;
    } catch (error) {
        return error.response.data;
    }
}