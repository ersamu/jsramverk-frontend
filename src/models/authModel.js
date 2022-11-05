const authModel = {
    baseUrl: window.location.href.includes("localhost") ?
    "http://localhost:1337" :
    "https://jsramverk-editor-ersm21.azurewebsites.net/",

    login: async function login(user) {
        const response = await fetch(`${authModel.baseUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
              'content-type': 'application/json'
            },
        });

        const result = await response.json();
        
        return result;
    },

    register: async function register(user) {
        const response = await fetch(`${authModel.baseUrl}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
              'content-type': 'application/json'
            },
        });

        const result = await response.json();
        
        return result;
    },

    getAllUsers: async function getAllUsers() {
        const response = await fetch(`${authModel.baseUrl}/graphql`, {
            body: JSON.stringify({query: "{users {email}}"}),
            headers: {
                'content-type': 'application/json',
                'accept' : 'application/json',
            },
            method: 'POST',
        });

        const result = await response.json();
        return result.data.users;
    },

    getAllUsersOld: async function getAllUsersOld() {
        const response = await fetch(`${authModel.baseUrl}/auth/users`);
        const result = await response.json();
        return result.data;
    }
};

export default authModel;
