import axios from 'axios';
import {BASE_URL} from '../utils/constants'

console.log(BASE_URL);


const clienteAxios = axios.create({
    baseURL: BASE_URL
});

export default clienteAxios;