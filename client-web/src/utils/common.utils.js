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