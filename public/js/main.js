var domIds = {
  inputMyId: "myUri",
  inputPeerId: "peerUri",
  inputSetMessage: "message",
  textAreaMessages: "messages"
}

var userAgent;
var uriSuffix = "@theapprentices.onsip.com";

function setUserUri(){
  var user = $("#"+domIds.inputMyId).val();
  userAgent = setUserAgent(user);
  initUserAgent();
}

function setUserAgent(name){
	uri = name+uriSuffix;
	console.log("Uri", uri);
  return new SIP.UA({
    uri: uri
  });
}

function initUserAgent(){
  userAgent.on('message', function (message) {
    var textarea = $("#"+domIds.textAreaMessages);
    textarea.val( textarea.val() + "\n" + message.body);
    console.log(message.body);
  });
}

function sendMessage(){
  var name = $("#"+domIds.inputPeerId).val();
  var message = $("#"+domIds.inputSetMessage).val();
	var peerUri = name+uriSuffix;
  console.log(peerUri, message);
  console.log(userAgent.message(peerUri, message));
}
