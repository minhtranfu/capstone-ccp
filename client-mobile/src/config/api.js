import axios from "axios";
import StatusAction from "../redux/actions/status";

export default function configAPI(config) {
  axios.defaults.baseURL = "http://ccp.hoctot.net:8080/api/";
  axios.defaults.headers.common["Authorization"] = "AUTH_TOKEN";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // Do something with response error
      if (error.response) {
        switch (error.response.status) {
          case 401:
            config.store.dispatch(StatusAction.error("401", Date.now()));
            break;
          case 400:
            config.store.dispatch(
              StatusAction.error("400 nonononononono", Date.now())
            );
            break;
          case 404:
            config.store.dispatch(StatusAction.error("404 nono", Date.now()));
            break;
          case 500:
            config.store.dispatch(StatusAction.error("500 fuck", Date.now()));
            break;
          default:
            return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Network timeout");
      } else {
        console.log("Error", error.message);
      }
      return Promise.reject(error);
    }
  );
}
