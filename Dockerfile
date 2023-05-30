FROM node:18.16.0-alpine

WORKDIR /app

COPY package*.json ./

# Install dependences
RUN npm install

COPY . .

# Compile typescript
RUN npm run build

EXPOSE 3000

# Env variables
ENV KEYSSN key
ENV PORT 3000
ENV DBHOST 127.0.0.1
ENV DBPORT 27017
ENV DBUSER root
ENV DBPASSWORD root

ENV AUTHSERVER=http://localhost
ENV AUTHPORT=3001

CMD ["npm", "start"]
