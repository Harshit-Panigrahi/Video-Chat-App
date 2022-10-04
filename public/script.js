const socket = io("/")

let peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
})

const user = prompt("Enter your name: ");
const myVideo = document.createElement("video");
myVideo.muted = true;

let myStream;
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
}).then((stream)=>{
  myStream = stream;
  addStream(myVideo, stream);
  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  });
  peer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addStream(video, userVideoStream);
    });
  });
});

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream);
  });
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    $("#video-grid").append(video);
  })
}

/* 
let myStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false,
  })
  .then((stream) => {
    myStream = stream;
    addStream(myVideo, stream);
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    peer.on("call", (call)=>{
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addStream(video, userVideoStream);
      })
    })
  });

function connectToNewUser(userId, stream) {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addStream(video, userVideoStream);
  });
}
*/

$(function(){
  $("#show_chat").click(function() {
    $(".left-window").css("display", "none");
    $(".right-window").css("display", "block");
    $("#header_back").css("display", "block");
  })
  $("#header_back").click(function() {
    $(".left-window").css("display", "block");
    $(".right-window").css("display", "none");
    $("#header_back").css("display", "none");
  })

  $("#send").click(function() {
    if($("#chat_message").val().length !== 0){
      socket.emit("message", $("#chat_message").val());
      $("#chat_message").val("");
    }
  })
  $("#chat_message").keydown(function(e){
    if(e.key == "Enter" && $("#chat_message").val().length !== 0) {
      socket.emit("message", $("#chat_message").val());
      $("#chat_message").val("");
    }
  });

  peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
  });

  socket.on("createMessage", (msg, username) => {
    $(".messages").append(
      `<div class="message">
        <b>
          <i class = "far fa-user-circle"></i>
          <span>${username === user ? "Me" : username}</span>
        </b>
        <span>${msg}</span>
      </div>`
    )
  })
})
