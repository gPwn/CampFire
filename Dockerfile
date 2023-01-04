FROM --platform=linux/amd64 node:16-alpine

WORKDIR /app
COPY package.json /app
RUN rm package-lock.json || true
RUN npm install
COPY . /app
# COPY .env ./
# RUN export $(cat .env | xargs)

ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm","run","dev"]