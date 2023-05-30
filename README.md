# TFG-Backend_Auth-API_REST

## Running the API
The main way to run the project is via Docker.

### Docker run

```
docker run -d \
  --name my-awesome-container \
  -p 3001:3001 \
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
  -p 3001:3001 \
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

