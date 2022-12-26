const docsModel = {
    baseUrl: window.location.href.includes("localhost") ?
    "http://localhost:1337" :
    "https://jsramverk-editor-ersm21.azurewebsites.net/",

    getDocs: async function getDocs(token, currentUserEmail) {
        const response = await fetch(`${docsModel.baseUrl}/documents/${currentUserEmail}`, {
            headers: {
                "x-access-token": token,
            }
        });

        const result = await response.json();
        return result.data;
    },

    saveDoc: async function saveDoc(doc) {
        const response = await fetch(`${docsModel.baseUrl}/documents`, {
            body: JSON.stringify(doc),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });

        await response.json();
    },

    updateDoc: async function updateDoc(doc) {
        const response = await fetch(`${docsModel.baseUrl}/documents`, {
            body: JSON.stringify(doc),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        await response.json();
    }
}

export default docsModel;
