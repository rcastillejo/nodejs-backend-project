# Imagen docker base inicial
FROM node:latest

#Crea la carpeta de trabajo del contenedor docker
WORKDIR /docker-dir-apitechu

# Copia archivos del proyecto ne el dorectorio de trabajo de Docker
ADD . /docker-dir-apitechu

# Instalar las dependencias del proyecto necesarias (producción)
# run npm install --only = producción

#Expone a puerto escucha en el puerto 3000 (el mismo que se uso en la API)
EXPOSE 3000

# comando para lanzar ap
CMD ["npm", "run", "prod"]