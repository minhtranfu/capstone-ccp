import axios from "axios";
import StatusAction from "../redux/actions/status";
import { logOut } from "../redux/actions/auth";
import { AsyncStorage } from "react-native";

export default async function configAPI(config) {
  axios.defaults.baseURL = "https://ccp.hoctot.net/api";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.request.use(
    async config => {
      if (
        config.baseURL === "https://ccp.hoctot.net/api" &&
        !config.headers.Authorization
      ) {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          config.headers.Authorization = ``;
        }
      }

      return config;
    },
    error => Promise.reject(error)
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // Do something with response error
      const originalRequest = error.config;
      if (error.response) {
        switch (error.response.status) {
          case 401:
            config.store.dispatch(
              StatusAction.error(401, "Your session has expired", Date.now())
            );
            config.store.dispatch(logOut());
            break;
          case 400:
            console.log(error.response);
            config.store.dispatch(
              StatusAction.error(400, error.response.data.message, Date.now())
            );
            break;
          case 404:
            console.log(error.response.data.message);
            config.store.dispatch(
              StatusAction.error(404, "404 nono", Date.now())
            );
            break;
          case 500:
            console.log(error.response.data);
            config.store.dispatch(
              StatusAction.error(500, "500 error", Date.now())
            );
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
