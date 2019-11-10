# Plataforma SocioBio

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

It will generates an admin user with the the following credentials:

User: admin@sociobio.com

Pass: zyY5TeRl8k (this should be changed after the first access in production)
Receita WS: 3e1d56e474c2d592286bbba78eac5700f87eea5641ba6206150df0e3572fe50e
