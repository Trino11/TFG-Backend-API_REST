# TFG-Backend-API_REST


## Important

This is not the main repository of the project, just a mirror. The updated repo can be found on gitlab 

https://git.trinohost.com/trino/tfg-backend-api_rest

## General projects features (APIs and consumers)

### ES

La estructura del proyecto intenta seguir el estilo de arquitectura de microservicios. Consiste en 2 APIs en el Backend y N consumidores para el Frontend.

#### Backend

En el Backend esta la AuthAPI, que provee soluciones de login seguro para los desarrolladores, aislados de cualquier otro proyecto como el del foro, los desarrolladores podran hacer aplicaciones sin preocuparse del manejo de datos sensibles como emails o contraseñas.

Lista de caracteristicas principales:
- Login
- Crear tokens de login
- Verificar tokens de login

#

En el Beackend tambien esta la API del foro, esta es la APIREST principal, que provee soluciones de foro como almacenar posts o comentarios, tambien un chat integrado usando Websocket.

Lista de caracteristicas principales:
- Verificar usuarios logueados usando la AuthAPI
- Manejo de posts y su informacion
- Manejo de comentarios y su informacion relacionada con su post
- Manejo de directrios recurivos para el almacenamiento de posts y directorios
- Chat integrado para los usuarios del foro usando Websocket para una comunicacion bidireccional con el servidor.

#
#### Frontend

Para el Frontend, de momento esta el Cliente web basado en Angular, consume la mayor parte de la funcionalidad de ambas APIs.

Lista de caracteristicas principales:
 - Regitrar usuarios en la AuthAPI y la API del foro
 - Loguear usuarios y almacenar sesiones
 - Mostrar los posts y su informacion
 - Mostrar los comentarios y su informacion relacionada con su post
 - Mostrar los directorios y directorios
 - Chat integrado para los usuarios del foro usando Websocket


### EN

The structure of the project searchs for the microservices style of architectures. Consists of 2 APIs in the Backend and N consumers for the Frontend.

#### Backend

In the backend is the AuthAPI that provides secure login solutions for the developers, isolated from all other projects like the forum, the developers will be able to make apps without worry about handling sensible data like emails or passwords.

List of main features:
- Login
- Create login tokens
- Verify login tokens

#

In the backend also is the Forum API, this is the main app APIREST, providing the forum solutions like storing posts or comments, also the integrated chat via WebSocket.

List of main features:
- Verify logged in users using the AuthAPI
- Handle posts and his info
- Handle comments and his info related to its post
- Handle recursive folders and paths for store posts and folders
- Integrated chat for the forum users using websocket for bidirectional comunication with the server

#
#### Frontend

For the frontend, at the moment there is a web client based on Angular, it consumes most of the functionality of both APIs.

List of main features:
- Register users on AuthAPI and Forum API
- Login users and storing sessions
- Show posts and his info
- Show comments and his info related to its post
- Show recursive folders and paths
- Integrated chat for the forum users using websocket


## Specific project technologies

### ES

Esta aplicacion esta construida en NodeJS 18.16.0 con el modulo de Express para crear rutas, controladores y middlewares para manejar el enrutado, funcionalidad y seguridad.

Lista de las tecnologias usadas:
 - Typescript reemplazando el JavaScirpt nativo
 - Express para el enrutado HTTP y seguridad
 - Mongodb para el driver de bases de datos
 - socket.io para el plugin de WebSocket para el chat
 - swagger-ui-express para la documentacion de uso de la API
 - uuid para la generacion de ids unicas

### EN

This app is built on NodeJS 18.16.0 with the Express module, creating routes, controllers and middlewares to handle the routing, functionality and security.

List of technologies used:
 - Typescript replacing native JavaScript
 - Express for the HTTP routes and security
 - Mongodb for the database connector
 - socket.io for the WebSocket plugin for the chat
 - swagger-ui-express for the API usage documentation
 - uuid for the generation of unique ids


## Running the API
The main way to run the project is via Docker.

### Docker run

```
docker run -d \
  --name my-awesome-container \
  -p 3000:3000 \
  trino11/tfg-backendrest:latest
```

Since all environment variables has a default value, you may want to change most of them, here are the env-vars and their default values:

- ENV KEYSSN key                  (Sessions secure key, used to encrypt the expressSessions sessions token)
- ENV PORT 3000                   (Express port, you can also change the -p param that its safer)
- ENV DBHOST 127.0.0.1            (DB hostname)
- ENV DBPORT 27017                (DB post)
- ENV DBUSER root                 (DB user)
- ENV DBPASSWORD root             (DB password)
- ENV AUTHSERVER=http://localhost (Auth server host)
- ENV AUTHPORT=3001               (Auth server port)

A docker run using two of them:

```
docker run -d \
  --name my-awesome-container \
  -e DBUSER=myuser \
  -e DBPASSWORD=mysecurepassword \
  -p 3000:3000 \
  trino11/tfg-backendrest:latest
```

**The name of the database must be database at the moment is not configurable.**

### Docker compose

Other way to run docker containers is docker-compose.yml

Here is an example using it with a mongo instance on the same docker compose.

```
version: '3'
services:
  tfg_rest:
    image: trino11/tfg-backendrest:latest
    environment:
      - "KEYSSN=myawesometoken"
      - "DBHOST=mongo_tfg"
      - "DBPORT=27017"
      - "DBUSER=root"
      - "DBPASSWORD=root"
      - "AUTHSERVER=http://mi.auth.server"
      - "AUTHPORT=3001"
    ports:
      - 3000:3000

  mongo_tfg:
    image: mongo:4.4.6
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
      - MONGO_INITDB_DATABASE=database
    volumes:
      - /opt/mongo/auth:/data/db
```

