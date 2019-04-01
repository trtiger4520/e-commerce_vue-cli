const ErrorMsg = {
    augument: function(augs = [], types = []) {
        augs = Array.isArray(augs)? augs : [augs.toString()];
        types = Array.isArray(types)? types : [types.toString()];
        let msg = '';

        if (augs.length > 0) {
            msg += `augument ${augs.map(i => `[${i}]`).join(', ')} is requires`;
        }
        
        if (types.length > 0) {
            msg += ` an must be ${types.join(', ')}`;
        }
        return new Error(msg);
    }
};

const HostPath = process.env.HOSTPATH;
const ApiPath = process.env.APIPATH;

const Methods = {
    // AJAX
    _getJson: async function(url = '', cookie = false){
        if (url === '' && typeof(url) !== 'string'){
            throw ErrorMsg.augument('url', 'string and has some text');
        }
        const init = {
            credentials: cookie ? 'include' : 'omit'
        };
        const response = await fetch(url, init);
        return await response.json();
    },
    _postJson: async function(url = '', data = '', cookie = false){
        if (!url && typeof(url) !== 'string' && url.trim() === ''){
            throw ErrorMsg.augument('url', 'string and has some text');
        }
        const init = {
            method: 'POST',
            body: typeof(data) !== 'string' ? JSON.stringify(data) : data,
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            credentials: cookie ? 'include' : 'omit' 
        };

        const response = await fetch(url, init);
        return await response.json();
    },
    _putJson: async function(url = '', data = '', cookie = false){
        if (!url && typeof(url) !== 'string' && url.trim() === ''){
            throw ErrorMsg.augument('url', 'string and has some text');
        }
        if (!data) { return{ success: false, message: 'post 時候發生錯誤', data } };
        const init = {
            method: 'PUT',
            body: typeof(data) !== 'string' ? JSON.stringify(data) : data,
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            credentials: cookie ? 'include' : 'omit' 
        };

        const response = await fetch(url, init);
        return await response.json();
    },
    _delJson: async function(url = '', cookie = false){
        const arg = arguments;
        cookie = arg.length > 2 ? arg[arg.length - 1] : cookie;
        if (url === '' && typeof(url) !== 'string'){
            throw ErrorMsg.augument('url', 'string and has some text');
        }
        const init = {
            method: 'DELETE',
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            credentials: cookie ? 'include' : 'omit'
        };
        const response = await fetch(url, init);
        return await response.json();
    },
    _postFile: async function(url = '', data, cookie = false){
        if (!url && typeof(url) !== 'string' && url.trim() === ''){
            throw ErrorMsg.augument('url', 'string and has some text');
        }
        const init = {
            method: 'POST',
            mode: 'cors',
            body: data,
            credentials: cookie ? 'include' : 'omit',
        };

        const response = await fetch(url, init);
        return await response.json();
    },

    // 切換滿版
    toggleFullScreen: function(turn) {
        const html = document.querySelector('html');
        this.toggleClass(html, 'fullheight', turn);
    },

    // 切換樣式類別
    toggleClass: function(element, className, bool) {
        bool = (bool !== undefined) ? bool : !element.classList.contains(className);
        bool ? this.addClass(element, className) : this.removeClass(element, className);
    },
    addClass: function(element, className) {
        const has_class = element.classList.contains(className);
        if (!has_class) { element.classList.add(className); }
    },
    removeClass: function(element, className) {
        const has_class = element.classList.contains(className);
        if (has_class) { element.classList.remove(className); }
    },


    // 系統登入
    adminLogin: function({username, password}) {
        return this._postJson(`${HostPath}/admin/signin`, { username, password }, true);
    },
    // 系統登出
    adminLogout: function() {
        return this._postJson(`${HostPath}/logout`);
    },
    // 系統確認是否登入
    adminCheck: function() {
        return this._postJson(`${HostPath}/api/user/check`);
    },


    // 取得產品列表 
    getProductList(page = 1, admin = false) {
        return this._getJson(`${HostPath}/api/${ApiPath}/${admin ? 'admin/' : ''}products?page=${page}`, admin);
    },
    getAllProductList(admin = false) {
        return this._getJson(`${HostPath}/api/${ApiPath}/${admin ? 'admin/' : ''}products/all`, admin);
    },
};


// vue extends
export default {
    methods: {...Methods},
}

export const MethodsCore = {...Methods};