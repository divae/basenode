const app = require('./src/app');

const local_port = 5000;


const saluteWhenServerIsRun = (local_port) => {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');
    console.log(`Visita api en http://localhost:${local_port}/`);
}

const server = app.listen(local_port, function () {
    saluteWhenServerIsRun(local_port);
});