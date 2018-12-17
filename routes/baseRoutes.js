module.exports = app => {
    
    const hiJson = {hi:'there'};

    const saluteServer = (response) => response.send(hiJson);

    app.get('/', (request,response ) => {
        saluteServer(response);
    });
 };