FROM node:20

# Passer en mode root
USER root
ARG USER_ID="1000"
ARG GROUP_ID="1000"

RUN if [ "$GROUP_ID" != "1000" ]; then groupadd node${USER_ID} -g ${GROUP_ID}; fi
RUN if [ "$USER_ID" != "1000" ]; then useradd node${USER_ID} -u ${USER_ID} -g ${GROUP_ID}; fi
RUN if [ "$USER_ID" != "1000" ]; then mkdir /home/node${USER_ID} && chown ${USER_ID}:${GROUP_ID} /home/node${USER_ID}; fi

# Crée un répertoire de travail
WORKDIR /var/app

# Copie d'abord uniquement les fichiers de dépendances (package.json + lock)
COPY package*.json ./

# Installe les dépendances
RUN npm ci

# Copie les fichiers de l’app dans l’image
COPY . .

# Build l’app
RUN npm run build

ENV NODE_ENV=production

# Définit la commande de démarrage
CMD ["node", "dist/app/index.js"]