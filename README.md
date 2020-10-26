# API REST Practica 2 ADI 

Este API REST está desplegado en un servicio en cloud de Amazon: [API REST Amazon]()

Este API REST esta diseñado para el proyecto final del programa BBVA Tech University.

Todo el codigo esta alojado en GitHub en el siguiente repositorio: [API REST Backend](https://bitbucket.org/luisricardo_castillejo/backend-project) 

## Introducción
Este API esta desarrollado para la aplicación de banca móvil en el que tendremos usuarios, cuentas y movimientos. 

Contemplamos distintos casos de uso que estan descritos mas adelante seguidos de su ruta para utilizarlos.

Para todos los metodos de POST y PUT tendremos que enviar los datos en formato JSON, y en algunos recursos será necesario una autentificacion.

## Casos de Uso 
### GET: 
- **Usuarios**

	- **apitechu/v0/users?email=:email** -> Busca un usuario por su correo electrónico, muestra los siguientes campos: identificador, nombres, apellidos, correo e indicador si se encuentra en sesión.

- **Cuentas**
	
	- **apitechu/v0/accounts** -> Busca todas las cuentas del usuario en sesión, muestra los siguientes campos: id de la cuenta, alias que permite identificar la cuenta del usuario y el saldo.
	- **apitechu/v0/accounts/:id** -> Devuelve la cuenta con el identificador indicado, muestra los mismos campos que de la busqueda de cuentas.  
	- **apitechu/v0/accounts/:id/movements** -> Muestra los movimientos de una cuenta, la informacion de movimientos contempla: el monto del movimiento y el identificador de la cuenta origen o destinataria.

- **Movimientos**
	
	- **apitechu/v0/movements** -> Devuelve una coleccion de moviemientos de todas las cuentas de un usuario en sesión de forma ordenada por fecha.

### POST 
- **Usuarios**

	- **apitechu/v0/usuarios** -> A partir de un JSON que se le pasa añade un nuevo usuario a la base de datos con la siguiente información: nombres, apellidos, correo y clave.

- **Cuentas** 

	- **apitechu/v0/accounts** -> Añade una nueva cuenta, para añadir esta nueva cuenta será necesario autentificarse (login). Los datos para añadir una cuenta son: alias y saldo (opcional).


	- **apitechu/v0/accounts/:id/movements** -> Añade un movimiento a la cuenta, para añadir este movimiento será necesario autentificarse (login). Los datos para añadir una cuenta son: identificador de la cuenta destino y el monto correspondiente.

- **Sesión** 

	- **apitechu/v0/login** -> Permite iniciar una sesion a un usuario con su correo y clave. Esto permite generar un token autentificarse para realizar otras operaciones.

	- **apitechu/v0/logout** -> Permite terminar una sesion a un usuario con su correo.


### DELETE
- **Usuarios**
	
	- **apitechu/v0/users/:id** -> Borramos el usuario indicado. Para ello, solo es necesario el identificador del mismo.
	
- **Cuentas**
	
	- **apitechu/v0/accounts/:id** -> Borramos la cuenta del usuario en sesion. Para ello, solo es necesario el identificador del mismo y que el usuario se encuentre en sesión.


### PUT 
- **Usuarios**

	- **apitechu/v0/users/:id** -> Editamos al usuario que indicamos, la información que se puede editar son los nombres, apellidos y correo. 



## Lista de comandos para puesta en marcha
#### Para poner en marcha la aplicación tendremos que realizar los siguientes comandos: 

 `npm install 		 //con esto instalaremos los modulos necesarios para node.js`

> Verificar la conexión con la BD en Mlab. 

Una vez verificado la conexión con la Base de Datos, comenzaremos con la ejecucion de la aplicacion por medio de uno de estos dos comandos: 

Si solo vamos a probar la aplicacion es recomendable este: 

`node run prod`

Si aparte de probar vamos a realizar cambios y no queremos estar ejecutando el servidor cada vez que hagamos un cambio usaremos este otro comando: 

`node run dev`

##### Para realizar las pruebas usaremos una aplicacion llamada PostMan, esta aplicacion permite realizar las peticiones necesarias para un API REST (GET, POST, DELETE, PUT).

## Requisitos "Adicionales" implementados
A parte de los requisitos minimos exigidos para superar la práctica se han implementado los siguientes requisitos adicionales que se ofrecían:  

- Implementar una Base de Datos persistente, en mi caso con MongoDB, esta base de datos es remota y esta alojada en MLab.

- Desplegar el API en algun servicio en la nube, en nuestro caso he optado por AWS [API REST Amazon](https://thawing-fjord-82104.herokuapp.com)