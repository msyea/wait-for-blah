# wait-for-blah
An elegant utility that waits for docker containers to be ready by monitoring their stdout

# An example
This utility was inspired but this real life situation:
> You're waiting for a stub service (kafka) to be ready (create topics).
Unfortunately existing libraries such as the excellent `dadarek/wait-for-dependencies` report ready when the service starts listening via TCP on a port not when the topic is created. For some people this is premature.

# How it works

```yaml
version: "3"
services:
  zookeeper:
    image: wurstmeister/zookeeper
    expose:
      - "2181"
    depends_on:
      - kafka
  kafka:
    image: wurstmeister/kafka:2.11-1.1.1
    exposr:
      - "9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: kafka
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CREATE_TOPICS: custom-topic-1:1:1,custom-topic-2:1:1
  mongo:
    image: mongo
  tests:
    build: ./tests
    links:
      - kafka
      - stub
```

```ts
import wfb from 'wait-for-blar'

(async () => {
  await wfb('kafka', /Created log for partition/)
  await wfb('mongo', [/waiting for connections/])
  await wfb('tests')
})()
```