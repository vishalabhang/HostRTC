
function checkTURNServer(turnConfig, timeout){ 

  return new Promise(function(resolve, reject){

    setTimeout(function(){
        if(promiseResolved) return;
        resolve(false);
        promiseResolved = true;
    }, timeout || 5000);

    var promiseResolved = false
      , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
      , pc = new myPeerConnection({iceServers:[turnConfig]})
      , noop = function(){};
    pc.createDataChannel("");    //create a bogus data channel
    pc.createOffer(function(sdp){
      if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
        promiseResolved = true;
        resolve(true);
      }
      pc.setLocalDescription(sdp, noop, noop);
    }, noop);    // create offer and set local description
    pc.onicecandidate = function(ice){  //listen for candidate events
      if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
      promiseResolved = true;
      resolve(true);
    };
  });   
}

const USERNAME="vishalabhang"
const PASSWORD="Host@127"
const PORT=3478
const IP="172.17.0.1" // you will have to change this

console.log('TURN server reachable on TCP?', await checkTURNServer( {
    url: `turn:${IP}:${PORT}?transport=tcp`,
    username: USERNAME,
    credential: PASSWORD,
}))

console.log('TURN server reachable on UDP?', await checkTURNServer( {
    url: `turn:${IP}:${PORT}?transport=udp`,
    username: USERNAME,
    credential: PASSWORD,
}))