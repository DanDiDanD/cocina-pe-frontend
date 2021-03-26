const {REACT_APP_BACKEND_URL, NODE_ENV} = process.env;

const environment = NODE_ENV;
const BASE_URL = REACT_APP_BACKEND_URL;

export {environment, BASE_URL};