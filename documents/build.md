# Pasos para construir el servidor

### Instalación
Es necesario tener instalado NPM, Node , Express , Mocha , Supertest y Docker para arrancar el proyecto.

#### Iniciar npm
Puede visitar : [NPM install](https://www.npmjs.com/package/install)

Le indica al sistema que vamos a usar las librerías de NPM

```sh
$ npm init
```

#### Requerir Express
Puede visitar : [Express](https://www.npmjs.com/package/express)

Nos ayuda a poder generar un servidor javascript de una forma ágil

```sh
$ npm install --save express
```

podemos confirmar que se ha instalado viendo que el archivo `package.json` que se ha añadido la dependencia de express en el apartado `dependencies`, este es el archivo que se revisa para añadir las dependencias al proyecto mediante `npm init`

##### `pacage.json`
```javascript
 "dependencies": {
    "express": "^4.16.4"
  }
```

#### Generar index.js

Contendrá el código del servidor.

```sh
$ touch index.js
```
Es una buena práctica apuntar al fichero de inicio en el package.json, se apunta en el apartado de `scripts`.

##### `package.json`
```javascript
 "scripts": {
   "start": "node index.js"
 },
```

#### Añadir código para arrancar el servidor
>Reemplazar el contenido del fichero por el siguiente código.

##### `index.js`
```javascript
const express = require('express');
const app = express();
const hiJson = {hi:'there'};
const local_port = 5000;

const saluteServerInJson = (response) => response.send(hiJson);

const saluteWhenServerIsRun = (local_port) => {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');
    console.log(`Visita api en http://localhost:${local_port}/`);
}

app.get('/', (request,response ) => {
    saluteServerInJson(response);
});

const server = app.listen(local_port, function () {
    saluteWhenServerIsRun(local_port);
});

```
> El puerto se ha elegido el 5000 proque es el que elige la documentación de Node.js pero podríamos elegir el que quisieramos siempre que no este ocupado.

#### Iniciar el servidor
```sh
$ node index.js
```

#### Parar el servidor
```sh
CTRL + c
```

#### Puede ver la respuesta en la siguiente ruta

`Ver servidor` : <http://localhost:5000>


se espera la siguiente salida por el navegador
```sh
{"hi":"there"}
```

#### Enrutar manejadores (Route Handlers)

Es interesante delegar responsabilidades para generar códigos mas mantenibles, en este caso vamos a eliminar los enrutamientos de `index.js` y se van a desplazar a su carpeta correspondiente, se generará un archivo por cada ambito, en este caso le vamos a llamar `baseRoutes.js` porque nos servirá de base para generar otros mas específicos.

así que en el raíz generar una carpeta que se llame routes

```sh
$ mkdir routes
```

generar dentro un archivo , yo le he llamado baseRoutes.js con el siguiente contenido, 
```sh
$ touch routes/baseRoutes.js
```
>Reemplazar el contenido del fichero por el siguiente código.
##### `baseRoutes.js`
```javascript
module.exports = app => {
    
    const hiJson = {hi:'there'};

    const saluteServer = (response) => response.send(hiJson);

    app.get('/', (request,response ) => {
        saluteServer(response);
    });
 };
```


Se modifica el index para añadir esta dependencia, quedando de la siguiente manera.

>Reemplazar el contenido del fichero por el siguiente código.

##### `index.js`

```javascript
const express = require('express');
const app = express();

const local_port = 5000;

const saluteWhenServerIsRun = (local_port) => {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');
    console.log(`Visita api en http://localhost:${local_port}/`);
}

require('./routes/baseRoutes')(app);

const server = app.listen(local_port, function () {
    saluteWhenServerIsRun(local_port);
});
```
> Es interesante comprobar que todo sigue correndo correctamente, así que volveremos a arrancar el servidor.
```sh
$ node index.js
```


## NPM MOCHA y SUPERTEST

#### Iniciar NPM Mocha para tests
Puede visitar : [NPM mocha](https://www.npmjs.com/package/mocha)

>Recordar --save-dev para que sea una dependencia de desarrollo


```sh
$ npm install mocha --save-dev
$ npm install supertest --save-dev
```
aqui si valos a `package.json` veremos que se han añadido las dos dependencias en el apartado `devDependencies` que es el pensado para el desarrollo.

##### `pacage.json`
```javascript
  "devDependencies": {
    "mocha": "^5.2.0",
    "supertest": "^3.3.0"

  }
```
En este punto mocha necesita que le pase la app a los test, así que separo la lógica y realizo un export para poder usar esa funcionalidad.

```sh
$ mkdir src
$ touch src/app.js
```
>Reemplazar el contenido del fichero por el siguiente código.

##### `app.js`
```javascript

const express = require('express');
const app = express();

require('../routes/baseRoutes')(app);

module.exports = app;
```
>Reemplazar el contenido del fichero por el siguiente código.

##### `index.js`
```javascript
const app = require('./src/app');

const local_port = 5000;

const saluteWhenServerIsRun = (local_port) => {
    console.log('¡Bienvenido! Esperamos que la visita merezca la pena');
    console.log(`Visita api en http://localhost:${local_port}/`);
}

const server = app.listen(local_port, function () {
    saluteWhenServerIsRun(local_port);
});

exports.closeServer = function(){
    server.close();
};

module.exports = server;
```
Generar una carpeta para los test y el fichero que los contendrá, va a validar que cuando se llama a raiz devuelva el json que toca

```
$ mkdir test
$ touch test/api.test.js
```
> todos los achivos de test acabaran con `.test.js` para que mocha los reconozca

El siguiente test comprobará que `/` responde y que tiene una salida de `{ "hi": "world" }`

>Reemplazar el contenido del fichero por el siguiente código.

##### `api.test.js`
```javascript
const request = require('supertest');
const app = require('../src/app');

const req = request(app);

describe('Integration test example', function() {
    it('get /', function(done) {
        req
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(JSON.stringify({ "hi": "world" }))
            .expect(200, done);
    });
});
```
#### probar los test
```
$ npx mocha
```

Decirle a la aplicación que vas a usar Mocha para testear

##### `package.json`

```javascript
 "scripts": {
   "start": "node index.js",
   "test": "mocha"
 },
```

## Docker
Puede visitar : [Docker](https://www.docker.com/)
>Éste paso se puede dar al inicio antes de montar la aplicación y es mas recomendable, pero como el objetivo es ver como se monta un servidor, ponerlo en este paso ayuda a restar complejidad ya que hay que recordar recompilar antes de probar.

#### Instalar docker 
>Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt install docker.io
```
#### Instalar docker componse
>Éste paso se puede saltar si ya está instalado, el sudo dependerá de los permisos del sistema.

```sh
$ sudo apt-get  install docker-compose
```

> puedes ver los docker arrancados con 
```
    sudo docker ps
```
> si se han quedado procesos de docker activos puedes matarlos haciendole un `kill` y el ID
```
    sudo docker kill "id"
```

#### Configurar el package.json
Se configura en start el comando que llamará la aplicación cuando se ejecute el comando `"npm start"`, en éste caso sería igual que llamar a `"node index.js"`.

#### Generar el archivo de configuración para Docker

Por convención se llama `Dockerfile` sin extensión

```sh
$ touch Dockerfile
```
Es importate verificar que el puerto expuesto en el servidor y el que se apunta en el `Dockerfile` es el mismo.

>Reemplazar el contenido del fichero por el siguiente código,.

##### `Dockerfile`

```sh
FROM node:8.12.0

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

EXPOSE 5000

CMD ["npm","start"]
```

Generar un docker que se llame `exampleserver` y compilar todo dentro `.`, éste paso hay que repetirlo cuando se realizen cambios para que se actualize a app generada dentro de docker.

> este paso se repetirá siempre que el código sufra cambios para que la imagen contenida dentro de docker se actualize.

```sh
$ sudo docker build -t exampleserver .
```

Levantar proyecto mediante docker.

```sh
$ sudo docker run -it -p 5000:5000  exampleserver
```

> Si no funciona el servidor, revisar que se hayan dado todos los pasos y que el código es igual.

## Git
> Lo mejor es iniciar git con el arranque del proyecto, pero lo he dejado para el final para restar complegidad ya que éste no es un tutorial de git.

Iniciar el control de versiones mediante git
```
$ git init
```
Generar documento para ignorar la carpeta de las dependencias de npm
```
touch .gitignore 
```

Añadir dentro del fichero a `node_modules` para que no lo tenga en cuenta en los commits.

##### `.gitignore`
```
node_modules
```

Añadir todo para el primer commit, verificar que esta todo guardado antes.

```
$ git add .
```

Podemos ver todo lo que está preparado para el commit meidante:

```
$ git status
```

Si te has equivocado al añadir puedes quitar de la lista de preparados mediante, luego habra que volver a añadirlos mediante `git add index.js` o el nombre que sea, el punto es para que lo añada todo.

```
$ git rm --cached index.js
```
Si lo que quieres es quitarlos todos del estado de preparados para el commit

```
$ git reset
```

Realizar el primer commit
```
$ git commit -m "primer commit"
```

Subir al repositorio, aquí habrá que reemplazar por el repositorio de cada uno

```
$ git remote add origin https://github.com/divae/basenode.git

$ git push -u origin master

```

Y hasta aquí tendremos un servidor de Node.js con Express y tests dockerizado para poder construir cualquier proyecto.

Puedes enviar feedback a stlmedrano@gmail.com.