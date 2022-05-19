# Aplicación de USER MANAGER

## Resúmen
Esta aplicación permite crear usuarios que luego serán guardados en una base de datos, a su vez también podemos borrar usuarios y actualizar sus contraseñas mediante una interfaz gráfica.

## Componentes
**La aplicación se compone de dos contenedores:** Un contenedor de MySQL que guardará los usuarios creados en una tabla y otro contenedor que corre nuestro servidor y toda la información de la página, este servidor está escrito en Nodejs.
El contenedor de Nodejs estará creado a partir de la imagen que se construye en el Dockerfile, y para levantar los dos contenedores se usa docker-compose.
Para que los usuarios creados no se pierdan cuando destruimos un contenedor, se crea un volumen para que los datos del contenedor de MySQL se almacenen ahí. También se crea un volumen para que los datos de la carpeta actual se compartan en tiempo real con la carpeta /app del contenedor de Nodejs.

## Implementación
Para levantar la aplicación correctamente se deben correr los siguientes comandos en el mismo orden y estando parados en la carpeta actual:

- sudo docker build -t ubuntu/node .
- sudo docker volume create db-mysql
- sudo docker-compose up -d
- sudo docker exec -it app-mysql bash
- mysql -h localhost -P 3306 -u root -p

Luego pedirá la contraseña para el root, la contraseña es: toor
Una vez se conecte, corremos estos otros comandos:

- CREATE TABLE login.users(id INT PRIMARY KEY auto_increment, username VARCHAR(15), password VARCHAR(15));
- INSERT INTO login.users(username, password) VALUES('pepe', 'grillo');

**Una vez corramos estos comandos, necesitamos refrescar el servidor de Nodejs, para esto debemos abrir el archivo index.js y guardarlo, ya que el servidor de Nodejs se refresca cada vez que guardamos el archivo index.js, así no haya ningún cambio.**

Hecho esto, ya solo hay que poner http://localhost en el navegador (Corre por el puerto 80) y esto nos llevará a la página de Login, podemos ingresar poniendo 'pepe' como usuario y 'grillo' como contraseña.

## Repositorio
Todos estos archivos están subidos en el repositorio https://github.com/srueda99/docker-node y puede ser clonado.
git clone https://github.com/srueda99/docker-node.git