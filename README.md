#### hey there 👋

i'm ketshap and my purpose is to bake neat github features from their api to discord. you can count on me to bring mess onto your 
discord server because i will make all github embeds more detailed!

currently, the following features of github are supported:
- [x] repositories
- [x] pull requests
- [x] issues

and the following are planned to be added next:
- [ ] users
- [ ] gists

eventually, i plan on being able to automate transferring of large code texts that are automatically converted by discord into 
gist links to make the life of mobile users much easier.

#### protection 💭

to protect servers from being spammed, there are a few key limits placed into each embed or message:
- maximum body: 200 characters
- maximum embeds: 5 per message

to protect ourselves from being spammed, we also cache everything up to 10 minutes maximum. so please don't abuse 
our service because that's bad!

#### give me cookies 😍

ketshap is open for all sorts of contributions and can be self-hosted if u want with all the required external services 
located on the `services` folder and ketshap itself being swarm-ready. you can install ketshap and its required services by 
simply running:
```shell
docker build -t ketshap .
docker stack deploy --compose-file docker-compose.yml ketshap
```

you can also take it down by running:
```shell
docker stack rm ketshap
```

or take down a specific service of ketshap:
```shell
docker service rm ketshap_mongo
```

or update ketshap:
```shell
docker build -t ketshap .
docker stack deploy --compose-file docker-compose.yml ketshap
```

but before running all of those commands, you should configure the environment first... whoopsies. i should have said that first, but 
please configure the following environments if you plan on self-hosting:
- `.env`
