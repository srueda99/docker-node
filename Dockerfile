FROM ubuntu
EXPOSE 80
RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN mkdir /app
COPY package.json /app
COPY package-lock.json /app
WORKDIR /app
RUN npm install