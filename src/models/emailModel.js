const emailModel = {
    baseUrl: window.location.href.includes("localhost") ?
    "http://localhost:1337" :
    "https://jsramverk-editor-ersm21.azurewebsites.net/",

    sendEmail: async function sendEmail(email) {
        const response = await fetch(`${emailModel.baseUrl}/email`, {
            body: JSON.stringify(email),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
        });

        await response.json();
    }
}

export default emailModel;
