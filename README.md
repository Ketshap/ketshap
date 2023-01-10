#### hey there 👋

i'm ketshap and my purpose is to bake neat github features from their api to discord. you can count on me to bring mess onto your 
discord server because i will make all github embeds more detailed!

currently, the following features of github are supported:
- [x] repositories
- [x] pull requests
- [x] commits
- [x] issues
- [x] comments (issues, commits and pull requests)

and the following are planned to be added next:
- [ ] review comments
- [ ] users
- [ ] gists

eventually, i plan on being able to automate transferring of large code texts that are automatically converted by discord into 
gist links to make the life of mobile users much easier.

you can add me by clicking [here](https://discord.com/api/oauth2/authorize?client_id=1062043878280142848&permissions=412317248576&scope=bot%20applications.commands) if you don't want 
to self-host the bot yourself.

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

#### previews 🖼️

you can view actual screenshots of the embeds here.
<details>
  <summary>repository</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211410016-98a5afa1-cf52-4c6f-b4ca-ec8f802f3ae5.png)

</details>
<details>
  <summary>issue</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211470821-676ceb03-2813-425e-a018-460dc799dac8.png)

</details>
<details>
  <summary>issue comments</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211470875-95b844ea-4cc6-468d-8769-09b2239c4d4f.png)

</details>
<details>
  <summary>pull request</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211409913-3caf10f2-af05-4b54-b53b-f5c43f93438e.png)

</details>
<details>
  <summary>pull request comments</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211470903-2c4a1157-ed19-43d9-afca-6529d6472c34.png)

</details>
<details>
  <summary>commit & commit comments</summary>
  
  ![image](https://user-images.githubusercontent.com/69381903/211481484-c168b559-5da0-4f78-8553-27470df0a157.png)

</details>
