##

### quick start services 🌃

to start required services such as mongodb and redis quickly, you can use the docker-compose here. we highly recommend changing the ports since the 
default port is never a good-to-go. please also configure the relative environment files. 

you can run the following command to start them:
```shell
cd services # OPTIONAL but needed when you are not in this folder already in the terminal.
docker stack deploy --compose-file docker-compose.yml ketshap
```

to take down the services, you can simply run the following:
```shell
docker stack rm ketshap
```

if you want to take down only one service, for example mongo, then you can run:
```shell
docker service rm ketshap_mongo
```