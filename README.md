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
Go to chrome browser\
ip :8080



## License
[Apache License 2.0](https://github.com/vishalabhang/HostRTC/blob/master/LICENSE)


## Note:
This Project Contains simple demo only 2 peer can exchange data. \
Further Enhancement coming soon.


## https://stackoverflow.com/questions/25546098/installing-a-turn-server-on-ubuntu-for-webrtc


# configure & run
USERNAME="some-username"
PASSWORD="some-password"
PORT=3478

# -n: use only commandline parameters, no config file
sudo turnserver \
    -n \
    --verbose \
    --lt-cred-mech \
    --user $USERNAME:$PASSWORD \
    --realm "someRealm" \
    --no-dtls \
    --no-tls \
    --listening-port $PORT