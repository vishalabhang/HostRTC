# HostRTC
Peer To Peer Media Exchange Through WEBRTC


### Install dependencies

```bash
npm install
```

### Run Server

```bash
node app.js
```



### Access webpage 
Go to chrome browser \
ip :8080

##### Test On Same Machine 
Open 2 different browsers ,
& just one of them create new meeting, it will  automatic peer to another device.

##### To check on Remote instead on same machine. 
Use two different devices connected to same network, access Webpage using server ip:8080 on chrome & Any one of them  start New Meeting.





# Access From Different Network  
#### (OPTIONAL :Required to setup Own Turn server)

## TURN sever setup in ubuntu

```sudo apt-get install --assume-yes coturn```


#### configure & run in ububtu
USERNAME="some-username" \
PASSWORD="some-password"\
PORT=3478

#### run turn server in ubuntu
```
sudo turnserver \
    -n \
    --verbose \
    --lt-cred-mech \
    --user $USERNAME:$PASSWORD \
    --realm "someRealm" \
    --no-dtls \
    --no-tls \
    --listening-port $PORT\
```

Accessing over Different Network

configure turn server details in public/js/RTCClient.js

const PORT=3478\
const IP="ip"\
var configuration = { 
    iceServers: [{
        urls: `turn:${IP}:${PORT}`,
        username: 'USERNAME',
        credential: 'PASSWORD'
      }]

More Details:
https://stackoverflow.com/questions/25546098/installing-a-turn-server-on-ubuntu-for-webrtc




## License
[Apache License 2.0](https://github.com/vishalabhang/HostRTC/blob/master/LICENSE)


## Note:

This Project Contains simple demo only 2 peer can exchange data. \
Further Enhancement coming soon.


======================================
This project contains simple demo only 2 peer can exchange data through WEBRTC. \
Further ehancement coming soon.....

