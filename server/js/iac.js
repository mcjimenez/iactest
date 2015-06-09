(function(exports) {

  'use strict';

  var _sendMsgBto = document.getElementById('sendMsgBto');
  var _eventsEntries = document.getElementById('eventsEntries');

  var whatEntry = _eventsEntries;
  var IAC_CON = 'testiac';

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
      if (request.keyword !== IAC_CON) {
        console.log('This is not our connection request. keywork ' +
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
      addTxt('Received:' + JSON.stringify(evt.data), whatEntry);
      this.sendMsg(evt.data);
    },
    sendMsg: function(aMsg) {
      var msg = aMsg || {
        txt: 'Server sends msg ' + this.count++
      };

      console.log('CJC Sending msg:' + JSON.stringify(msg));
      addTxt('Sending msg:' + JSON.stringify(msg), whatEntry);

      this.port.postMessage(msg);
    }
  };

  var serverIAC = new ServerIAC();

  window.addEventListener('load', function() {

    _sendMsgBto.addEventListener('click', function send() {
      serverIAC.sendMsg();
    });
  });


})(window);
