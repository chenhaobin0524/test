const storage = {
    set(key, data) {
        getDataProperty(data) === '[object Array]' || getDataProperty(data) === '[object Object]'
            ? sessionStorage.setItem(key, JSON.stringify(data))
            : sessionStorage.setItem(key, data);
    },

    get(key, params) {
        let data = null;
        try {
            data = JSON.parse(sessionStorage.getItem(key));
        } catch (error) {
            return sessionStorage.getItem(key);
        }
        return data;
    },

    del(item, key) {
        const getItem = storage.get(item);
        if (key) {
            delete getItem[key];
            storage.set(item, getItem);
        } else {
            sessionStorage.removeItem(item);
        }
    },

    clear() {
        sessionStorage.clear();
    }
};

function getDataProperty(data) {
    return Object.prototype.toString.call(data);
}

export default storage;