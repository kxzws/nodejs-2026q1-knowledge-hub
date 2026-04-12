# Knowledge Hub

## Prerequisites

- Git
- NPM
- Node.js
- Docker

### Downloading

```
git clone {repository URL}
```

### Installing NPM modules

```
npm install
```

## Running application

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

### Container start

```
docker-compose up --build
```

or with Adminer

```
docker-compose --profile debug up --build
```

#### Image build with no cache and container start

```
docker-compose build --no-cache
docker-compose up
```

### Development

Note: make sure then .env contains `localhost` for db connection string

```
npm run docker-compose:start-db
npm start:dev
```

### Docker Hub image

[Image link](https://hub.docker.com/r/kxzws/nodejs-2026q1-knowledge-hub)

To pull the image:

```
docker pull kxzws/nodejs-2026q1-knowledge-hub:latest
```

## Auto-fix and format

```
npm run lint
```

```
npm run format
```

## Testing

<details>

<summary>instructions</summary>

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

</details>
