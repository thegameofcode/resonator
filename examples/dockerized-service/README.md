# Resonator dockerized

This is an example of how to use resonator as dockerized microservice.


## Usage

First you need `docker` installed and the service already running. Then: 

```sh

    git clone https://github.com/thegameofcode/resonator
    cd resonator
    cd examples/dockerized-service
    
    // start mongo and resonator services
    docker-compose up -d
    
    // or start only resonator (if you have another mongo running)
    docker-compose up -d resonator
    
```

Then you can make calls to `resonator` on `http://localhost:3000/`.
