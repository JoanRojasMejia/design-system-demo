FROM node:23.6.1-alpine3.21

# Set the working directory
WORKDIR /app

# Copy the package.json file
COPY package.json .yarnrc.yml ./

# Activar Corepack
RUN corepack enable && \
    corepack prepare yarn@latest --activate

# Instalar las dependencias del proyecto usando Yarn
RUN corepack use yarn@latest

# Eliminar el archivo .yarnrc.yml después de la instalación
RUN rm -f .yarnrc.yml

# Copiar el resto del código fuente del proyecto
COPY . .

# Exponer el puerto si es necesario (ajusta según tu aplicación)
EXPOSE 6006

# Comando para iniciar la aplicación
# CMD ["sleep", "infinity"]
CMD ["yarn", "storybook"]