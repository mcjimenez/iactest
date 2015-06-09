(function(exports) {

  'use strict';

  var _sendMsgBto = document.getElementById('sendMsgBto');
  var _eventsEntries = document.getElementById('eventsEntries');

  var whatEntry = _eventsEntries;

  function addTxt(txt, where) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    where.appendChild(li);
  }

  function ServerIAC() {
    navigator.mozSetMessageHandler('connection', this.onConnection.bind(this));
  }

  ServerIAC.prototype = {
    count: 0,
    onConnection: function(request) {
 for (var kk in request) {
 console.log("CJC" + kk + ":" + JSON.stringify(request[kk]));
}
      if (request.keywork !== 'testiac') {
        console.log('This is not our connection request. Keywork ' +
                    request.keyword);
        return;
      }
      var port = this.port = request.port;
      port.onmessage = this.onmessage.bind(this);
      port.start();
    },
    onmessage: function(evt) {
      var data = evt.data;
      console.log ('CJC - server. Received:' + JSON.stringify(evt.data));
      addTxt('CJC  - server. Received:' + JSON.stringify(evt.data));
    },
    sendMsg: function() {
      console.log('CJC - server sending a msg(' + this.count);
      addTxt('CJC  - server. Received:' + JSON.stringify(evt.data));
      var msg = {
        txt: 'Server sends msg ' + this.count++
      };

      this.port.postMessage(msg);
    }
  };

  var serverIAC = new ServerIAC();
//  exports.serverIAC = serverIAC;
  window.addEventListener('load', function() {

    _sendMsgBto.addEventListener('click', function send() {
      addTxt('CJC - sending msg', whatEntry) && serverIAC.sendMsg();
    });
  });


})(window);
