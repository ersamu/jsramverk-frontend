const docsModel = {
    baseUrl: window.location.href.includes("localhost") ?
    "http://localhost:1337" :
    "https://jsramverk-editor-ersm21.azurewebsites.net/",

    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${docsModel.baseUrl}/documents`);
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

        const result = await response.json();
        console.log(result);
    },

    updateDoc: async function updateDoc(doc) {
        const response = await fetch(`${docsModel.baseUrl}/documents`, {
            body: JSON.stringify(doc),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });

        const result = await response.json();
        console.log(result);
    }
}

export default docsModel;
