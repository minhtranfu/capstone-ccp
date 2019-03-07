import axios from "axios";
import StatusAction from "../redux/actions/status";

export default function configAPI(config) {
  axios.defaults.baseURL = "http://ccp.hoctot.net/api/";
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
            console.log(error.response);
            config.store.dispatch(StatusAction.error("401", Date.now()));
            break;
          case 400:
            console.log(error.response);
            config.store.dispatch(
              StatusAction.error(error.response.data.message, Date.now())
            );
            break;
          case 404:
            console.log(error.response.data.message);
            config.store.dispatch(StatusAction.error("404 nono", Date.now()));
            break;
          case 500:
            console.log(error.response.data);
            config.store.dispatch(StatusAction.error("500 error", Date.now()));
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
