import axios from "axios";
import {isDev} from "./constants";

const baseUrl: string =
    (isDev) ?
        import.meta.env.VITE_APP_SERVER_URL || ''
        : '/api';

export const apiPost = async (path: string, data: {
    [key: string]: any
} = {}) => {

    let bodyData: { [key: string]: any } = {};
    for (let property in data) {
        bodyData = {
            ...bodyData,
            [property.toString()]: data[property]
        }
    }

    const config: any = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return await axios.post(baseUrl + path, JSON.stringify(bodyData), config);
};

export const apiGet = async (path: string) => {
    const config: any = {
        headers: {}
    };

    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return await axios.get(baseUrl + path, config);
};
