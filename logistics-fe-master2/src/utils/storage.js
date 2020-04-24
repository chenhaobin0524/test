export const setSession = (key, value = {}) => {
    if (!key) return;
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSession = (key) => {
    if (!key) return;
    return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : null;
};

export const setLocal = (key, value = {}) => {
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const getLocal = (key) => {
    if (!key) return;
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
};
