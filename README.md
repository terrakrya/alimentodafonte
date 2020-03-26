# Alimento da fonte

## Plataforma de distribuição de alimentos e incentivo a iniciativas de ciclo curto

## Development

### Requirements

MongoDB >= 3.2.x

### Project setup
```
npm install
```
### Run API server on port 3000
```
npm run api
```
### Compiles and hot-reloads frontend for development on port 8080
```
npm run frontend
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Production

### Run the docker compose in the production server root app folder

```
cd /home/xingu/rede-de-sementes/
sudo git pull
make prod-run
```

### Stop the production containers

```
make prod-stop
```

### Clean the production containers

```
make clean
```

## Database initialization

In the first time you run the app you will need to generate the first admin user to access the panel. To do this access:

```
/api/init
```

It will generates the admin user credentials and return something like this:

```
{
  status: 'success',
  user: 'adminuser@adminuser.com',
  password: 'adminpass'
}
```

#### IMPORTANT: Save this key in a secure place. The system will not show you this credentials again.

Use this credentials to access the panel in the following url:

```
http://localhost:8080/#/painel
```
