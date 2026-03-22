const { app } = require('@azure/functions');

app.http('httpTriggerFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous', // Or 'function', 'admin'
    handler: async (request, context) => {
        context.log('HTTP trigger function processed a request.');

        try {
            // Make an external HTTP GET request
            const externalApiUrl = 'https://ripcblobtest.blob.core.windows.net/?comp=list';
            const response = await fetch(externalApiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            context.log('Data from external API:', data);

            // Return a response to the original caller
            return {
                status: 200,
                jsonBody: {
                    message: "Request successful",
                    apiData: data
                }
            };
        } catch (error) {
            context.log(`Error making external request: ${error.message}`);

            // Return an error response
            return {
                status: 500,
                body: "Internal server error"
            };
        }
    }
});