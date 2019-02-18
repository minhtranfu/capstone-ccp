import axios from "axios";

axios.defaults.baseURL = "http://0855a508.ngrok.io/";
axios.defaults.headers.common["Authorization"] = "AUTH_TOKEN";
axios.defaults.headers.post["Content-Type"] = "application/json";
