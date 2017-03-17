var domIds = {
  inputMyId: "myUri",
  inputPeerId: "peerUri",
  inputSetMessage: "message",
  buttonSendMessageId: "buttonSendMessage",
  textAreaMessages: "messages",
  buttonUserUriId: "buttonUserUri",
  chatContainerId : "chatContainer"
}

var userAgent;
var uriSuffix = "@theapprentices.onsip.com";
var chatMessageTemplate;
var chatMessageOptions = {
  imgSrc: "http://placehold.it/50/55C1E7/fff&text=",
  userImgId : "userImg",
  userNameId: "userName",
  messageTimeId: "messageTime",
  messageTextId: "messageText",
  userClassId: "userClass",
  liClassId: "liClass"
}
var userClass = {
  myClass: {
    li: "left clearfix",
    img: "pull-left",
    time: "pull-right",
    name: "pull-left"
  },
  peerClass: {
    li: "right clearfix",
    img: "pull-right",
    time: "pull-left",
    name: "pull-right"
  }
}

setChatMessageTemplate();

function setUserUri(){
  var user = $("#"+domIds.inputMyId).val();
  userAgent = setUserAgent(user);
  initUserAgent();
  $("#"+domIds.buttonUserUriId).prop('disabled', 'disabled');
  $("#"+domIds.inputMyId).prop('disabled', 'disabled');
  $("#"+domIds.inputSetMessage).removeAttr('disabled');
  $("#"+domIds.buttonSendMessageId).removeAttr('disabled');
}

function setUserAgent(name){
  uri = name+uriSuffix;
  return new SIP.UA({
    uri: uri,
    displayName: name
  });
}

function initUserAgent(){
  userAgent.on('message', function (message) {
    addMessageToTextArea(message.remoteIdentity.displayName, message.body, userClass.peerClass);
  });
}

function sendMessage(){
  var name = $("#"+domIds.inputPeerId).val();
  if (!name || name =="") {
    alert("Error: set the name of your peer firend");
    return;
  }
  var message = $("#"+domIds.inputSetMessage).val();
  var peerUri = name+uriSuffix;
  userAgent.message(peerUri, message);
  addMessageToTextArea(userAgent.configuration.displayName, message, userClass.myClass);
}

function addMessageToTextArea(displayName, message, userClass){
  var textarea = $("#"+domIds.textAreaMessages);
  var displayName = displayName || 'anonymous';
  textarea.val( textarea.val() + "\n" + displayName + ": "+ message);
  addMessageToChatArea(displayName, message, userClass);
}

function addMessageToChatArea(name, message, userClass){
  console.log(userClass);
  if (!chatMessageTemplate) {
    setChatMessageTemplate();
    alert("try again");
    return;
  }
  var htmlMessage = $(chatMessageTemplate).addClass(userClass.li);
  $(htmlMessage).find("#"+chatMessageOptions.userImgId).one("load", function() {
    $(htmlMessage).find("#"+chatMessageOptions.userClassId).addClass(userClass.img);
    $(htmlMessage).find("#"+chatMessageOptions.userNameId).addClass(userClass.name).html(name);
    $(htmlMessage).find("#"+chatMessageOptions.messageTextId).html(message);
    $(htmlMessage).find("#"+chatMessageOptions.messageTimeId).addClass(userClass.time).append(getNowDateTime());
    $(htmlMessage).appendTo("#ul-chat");
  }).attr("src", chatMessageOptions.imgSrc+name);
}

function getNowDateTime(){
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  var curr_year = d.getFullYear();
  return curr_date + "-" + curr_month + "-" + curr_year;
}

function setChatMessageTemplate(){
  $.ajax({
      context: this,
      dataType : "html",
      url : "chatMessage.html",
      success : function(results) {
        chatMessageTemplate = results;
      }
  });
}
