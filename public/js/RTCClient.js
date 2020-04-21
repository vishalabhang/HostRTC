
var configuration = {
    iceServers: [{
        urls: "stun:stun.services.mozilla.com",
        username: "louis@mozilla.com",
        credential: "webrtcdemo"
    }, {
        urls: [
            "stun:stun.l.google.com",
            "stun:stun2.l.google.com",
            "stun:stun3.l.google.com",
            "stun:stun4.l.google.com",

        ]
    }]
};
var RTCPeer = new RTCPeerConnection(configuration, {
    optional: [{ RtpDataChannels: true }]
})
var navigator =Navigator;
var RTCPeerDataChannel=[]
log("RTCPeer Object Created");

RTCPeer.onicecandidate = function (event) {
    if (event.candidate) {
        send({
            type: "candidate",
            candidate: event.candidate
        });
    }
    log(event)
};
openDataChannel();


function send() {
    console.log("Send TO Server")
    socket.emit('CreateMeeting', 'Meeting');
}




//-------------------------------------------------------------------------------
navigator.getUserMedia({ "audio": true, "video": true }, gotStream, logError);

function gotStream(stream) {
    var local_video = document.getElementById('local_video');
    local_video.srcObject = stream;
    RTCPeer.addStream(stream)
    console.log(stream);
}

function logError(evt) {
    console.log("Error")
}

RTCPeer.onaddstream = event => {
    document.getElementById('remote_video').srcObject = event.stream
  }


RTCPeer.onicecandidate = function (event) {
    if (event.candidate) {
        //log("Send the candidate to the remote peer")
        // Send the candidate to the remote peer
        sendToServer({ 
            type: "candidate", 
            candidate: event.candidate 
        });
    } else {
        console.log(event)
        log(" All ICE candidates have been sent")
        // All ICE candidates have been sent
    }
}


///WebRTC
function send2() {
    console.log("Send TO Server")

    RTCPeer.createOffer().then(offer => {
        sendToServer({ type: "offer", offer: offer });
        //sendConfig({ type: "offer", offer: offer });
        RTCPeer.setLocalDescription(offer);
    })
        .catch(function (reason) {
            console.log("Facing Proble tO create Offer");
            console.log(reason);
        });
}

function send3(sdp) {
    SDPRemote = new RTCSessionDescription({ type: "offer", sdp: sdp.sdp })
    console.log(SDPRemote);

    console.log("Send TO Server")
    //socket.emit('NewMsgToServer', 'world');
    console.log(RTCPeer);

    RTCPeer.createOffer().then(() => { RTCPeer.setRemoteDescription(SDPRemote); })
        .then(() => { RTCPeer.createAnswer() })
        .then(answer => { RTCPeer.setLocalDescription(answer) })
        .then(() => { RTCPeer.setRemoteDescription(RTCPeer.localDescription) })
        .catch(function (reason) {
            // An error occurred, so handle the failure to connect
            console.log("Facing Proble tO create Offer");
            console.log(reason);
            console.log(RTCPeer);
        });

}

function sendToServer(data) {
    console.log(data);
    socket.emit('SDPS', data);

}
function setRemote(sdp) {
    console.log(sdp);
    console.log(RTCPeer);
    RTCPeer.setRemoteDescription(new RTCSessionDescription(sdp.sdp))
        .then(function () {
            return createMyStream();
        })
}


function sendConfig(data) {
    switch (data.type) {
        case 'offer':
            log("Remote Offer Received");
            onOffer(data.offer);
            break;
        case 'answer':
            log("Remote Answer Received");
            onanswer(data.answer);
            break;
        case "candidate":
            onCandidate(data.candidate);
            break;
    }
}


function onOffer(p_offer) {
    log("Remote SDP SET")
    SDPOffer = new RTCSessionDescription(p_offer)
    RTCPeer.setRemoteDescription(SDPOffer);
    RTCPeer.createAnswer().then(answer => {
        log("Answer Created")
        RTCPeer.setLocalDescription(answer)
        log("Answer Set To setLocalDescription")
        sendToServer({ type: "answer", answer: answer })
        log("Answer sendToServer Through Socket")
        $('#newmeet').hide();
        $('#RTCConnect').show();
    })
        .catch(function (reason) { console.error(reason) });
}
function onanswer(p_answer) {
    SDPAnswer = new RTCSessionDescription(p_answer)
    RTCPeer.setRemoteDescription(new RTCSessionDescription(SDPAnswer));
    log("Remote SDP SET")
    $('#newmeet').hide();
    $('#RTCConnect').show();

}

//when we got ice candidate from another user 
function onCandidate(candidate) {
    RTCPeer.addIceCandidate(new RTCIceCandidate(candidate));
}

function openDataChannel() {
    var dataChannelOptions = {
        reliable: true
    };
    RTCPeerDataChannel = RTCPeer.createDataChannel("myDataChannel");
    log("Data Channel Created");
    RTCPeerDataChannel.onerror = function (error) {
        console.log("Error:", error);
    };
    RTCPeerDataChannel.onmessage = function (event) {
        console.log("Got message:", event.data);
        logViaRTC(event.data,false);
    };

}


function ViaRTC (){
    sengMessage=$("#msgid").val()
    //var dataChannel = peerConnection.createDataChannel("myDataChannel");
var sendQueue = [];

  switch(RTCPeerDataChannel.readyState) {
    case "connecting":
      console.log("Connection not open; queueing: " + msg);
      sendQueue.push(msg);
      break;
    case "open":
      sendQueue.forEach((msg) => RTCPeerDataChannel.send(msg));
      break;
    case "closing":
      console.log("Attempted to send message while closing: " + msg);
      break;
    case "closed":
      console.log("Error! Attempt to send while connection closed.");
      break;
  }


    //RTCPeerDataChannel.send(sengMessage);
    logViaRTC(sengMessage,true)
}

//-----------------------------------------------------------------------------------------------------
function NewMeeting() {
    log("NewMeeting")

    RTCPeer.createOffer().then(offer => {
            log("Offer Created");
            sendToServer({ type: "offer", offer: offer });
            log("Offer sendToServer Through Socket ");
            RTCPeer.setLocalDescription(offer);
            log("Offer set to Local setLocalDescription ");
        })
        .catch(function (reason) {
            log("Facing Proble to create Offer");
            console.log(reason);
        });
}
function JoinMeeting() {
    log("JoinMeeting")

}

function log(msg){
    $('.contentstatus').append(" <div class='alert alert-primary'>"+msg+"</div>");
    console.log(msg)
}

function logViaRTC(msg,sentflag){
    if(sentflag){
        $('.contentrtcstatus').append(" <div class='alert alert-success' align='right' style='margin-left:20%;'>"+msg+"</div>");
        $('.contentrtcstatus').scrollTop($('.contentrtcstatus')[0].scrollHeight);
    }else{
        $('.contentrtcstatus').append(" <div class='alert alert-warning' align='left' style='margin-right:20%;'>"+msg+"</div>");
        $('.contentrtcstatus').scrollTop($('.contentrtcstatus')[0].scrollHeight);
    }
    console.log(msg)
}


