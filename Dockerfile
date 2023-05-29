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
ENV PORT_ENV 3001
ENV DBHOST 127.0.0.1
ENV DBPORT 27017
ENV DBUSER root
ENV DBPASSWORD root

CMD ["npm", "start"]
