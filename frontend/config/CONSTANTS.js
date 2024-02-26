import axios from "axios";

export const CONSTANTS = {
    EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/,
    PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
    APIBASEURL: "https://www.digitaldime.win/",
    // APIBASEURL: "http://192.168.1.77:3000/",
    AUTH: {
        POST_SIGNUP: "/auth/signup",
        POST_SIGNIN: "/auth/signin",
        GET_REFRESH: "/auth/refresh",
        GET_LOGOUT: "/auth/signout",
    },
    USER: {
        GET_ALL: "/api/v1/users",
        GET_BY_ID: (id) => {
            return `/api/v1/users/id/${id}`;
        },
        GET_BY_FILTER: (filter) => {
            return `/api/v1/users/filter?mask=${filter}`;
        },
        PUT_USER: () => {
            return `/api/v1/users`;
        },
    },
    ACCOUNT: {
        GET_MY_BALANCE: "/api/v1/accounts/balance",
        GET_ALL_BALANCE: "/api/v1/accounts/all",
        POST_BALANCE_OF_IDS: "/api/v1/accounts/balance/ids",
        POST_TRANSFER: "/api/v1/accounts/transfer",
    },
};

export const customAxios = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
});

export const customAxiosPrivate = axios.create({
    baseURL: CONSTANTS.APIBASEURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});
