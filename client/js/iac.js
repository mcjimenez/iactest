(function(imports) {
'use strict';
  var WHERE = 'testiac';

  var _eventsEntries = document.getElementById('eventsEntries');
  var _btoPing = document.getElementById('ping');

  var whatEntry = _eventsEntries;

  var _count = 0;
  var _port = null;

  var msg = {
    txt: 'CLIENT MSG'
  };

  function addTxt(txt, where) {
    var li = document.createElement('li');
    li.innerHTML = txt;
    where.appendChild(li);
  }

  function connect() {
    navigator.mozApps.getSelf().onsuccess = function(evt) {
      var app = evt.target.result;
      if (app.connect) {
        app.connect(WHERE).then(function onConnAccepted(ports) {
          var i = 1;
          ports.forEach(port => {
            addTxt('CJC - IAC connection success. Adding listener!', whatEntry);

            port.onmessage = function(evt) {
              addTxt('Received:' +
                  (evt.data ? JSON.stringify(evt.data) : 'No data'), whatEntry);
            };
            msg.num = _count++;
            addTxt('Sending:' + JSON.stringify(msg), whatEntry);
            port.postMessage(msg);

            (i--) && (_port = port);
          });
        }, function onConnRejected(reason) {
          addTxt('Cannot connect:' + reason, whatEntry);
        });
      }
    };

  }

  window.addEventListener('load', function() {
    connect();

    _btoPing.addEventListener('click', function send() {
      msg.num = _count++;
      addTxt('Sending:' + JSON.stringify(msg), whatEntry);
      _port.postMessage(msg);
    });
  });

})(this);
