# Knowledge Hub

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Docker

### Image build

```
docker build -t knowledge-hub-app .
```
or
```
docker-compose up --build
```

### Container start

```
docker run -p 4000:4000 --env-file .env knowledge-hub-app
```

### Composed container start

```
docker-compose up --build
```
or with Adminer
```
docker-compose --profile debug up --build
```

### Docker Hub image
[Image link](https://hub.docker.com/r/kxzws/nodejs-2026q1-knowledge-hub)

To pull the image:
```
docker pull kxzws/nodejs-2026q1-knowledge-hub:latest
```
