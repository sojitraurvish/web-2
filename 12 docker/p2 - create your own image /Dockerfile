# FROM node:20-alpine

# WORKDIR /app

# COPY . .

# RUN npm install
# RUN npm run build
# #RUN npx prisma generate

# EXPOSE 3000

# CMD ["node", "dist/servers.js"]

# now let oprimized the above Dockerfile

FROM node:20-alpine 

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .
# COPY ./Prisma .

RUN npm install
# RUN npx prisma generate

COPY ./src ./src

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/servers.js"]