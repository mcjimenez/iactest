(function(exports) {

  'use strict';

  var _sendMsgBto = document.getElementById('sendMsgBto');
  var _eventsEntries = document.getElementById('eventsEntries');

  var whatEntry = _eventsEntries;
  var IAC_CON = 'testiac';

  var _count = 0;
  var msg = {
    txt: 'SERVER MSG'
  };

  function addTxt(txt, where) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    where.appendChild(li);
  }

  function ServerIAC() {
    navigator.mozSetMessageHandler('connection', this.onConnection.bind(this));
  }

  ServerIAC.prototype = {
    onConnection: function(request) {
      if (request.keyword !== IAC_CON) {
        addTxt('This is not our connection request. keywork ' +
                    request.keyword, whatEntry);
        return;
      }
      var port = this.port = request.port;
      port.onmessage = this.onmessage.bind(this);
      port.start();
    },
    onmessage: function(evt) {
for (var kk in evt) {
console.log("CJC " + kk + ":" + JSON.stringify(evt[kk]));
}
      var data = evt.data;
      addTxt('Received:' + JSON.stringify(evt.data), whatEntry);
      this.sendMsg(evt.data);
    },
    sendMsg: function(aMsg) {
      var msg = aMsg || {
        txt: 'Server test msg'
      };

      addTxt('Sending msg:' + JSON.stringify(msg), whatEntry);

      this.port.postMessage(msg);
    }
  };

  var serverIAC = new ServerIAC();

  window.addEventListener('load', function() {

    _sendMsgBto.addEventListener('click', function send() {
      msg.num = _count++;
      serverIAC.sendMsg(msg);
    });
  });


})(window);
