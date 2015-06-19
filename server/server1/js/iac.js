(function(exports) {

  'use strict';

  var _sendMsgBto = document.getElementById('sendMsgBto');
  var _eventsEntries = document.getElementById('eventsEntries');

  var whatEntry = _eventsEntries;
  var IAC_CON = 'iacsvr1';

  var _count = 0;
  var msg = {
    txt: 'SERVER 1 MSG'
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
        addTxt('SVR1. This is not our connection request. keywork ' +
                    request.keyword, whatEntry);
        return;
      }
      addTxt('SVR1. Connection from ' + request.pageURL, whatEntry);
      var port = this.port = request.port;
      port.onmessage = this.onmessage.bind(this);
      port.start();
    },
    onmessage: function(evt) {
      var data = evt.data;
      addTxt('SVR1. Received:' + JSON.stringify(evt.data), whatEntry);
      this.sendMsg(evt.data);
    },
    sendMsg: function(aMsg) {
      var msg = aMsg || {
        txt: 'SVR 1 test msg'
      };

      addTxt('SVR1. Sending msg:' + JSON.stringify(msg), whatEntry);

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
