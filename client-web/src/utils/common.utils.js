import { modules } from "Src/components/modules/Routes";

export const getRoutePath = (name, data) => {
    const route = modules.find(route => route.name === name);

    if (!route) {
        return '';
    }

    let routePath = route.path;
    if (data && Object.isObject(data)) {
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`:${key}`, 'g');
            routePath = routePath.replace(regex, data[key]);
        });
    }

    return routePath;
};

export const getErrorMessage = error => {
  if (!error) {
    return '';
  }

  if (error.response && error.response.data) {
    if (error.response.data.message) {
      return error.response.data.message;
    }

    if (Array.isArray(error.response.data) && error.response.data.length > 0 && error.response.data[0].message) {
      return error.response.data[0].message;
    }
  }

  if (error.message) {
    return error.message;
  }

  return 'Unknown error occurr!';
};
