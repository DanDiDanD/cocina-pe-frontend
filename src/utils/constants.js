const {REACT_APP_BACKEND_URL, REACT_APP_BACKEND_URL_LOCAL,  NODE_ENV} = process.env;
console.log(process.env);


const environment = NODE_ENV;
const BASE_URL = REACT_APP_BACKEND_URL;

export {environment, BASE_URL};