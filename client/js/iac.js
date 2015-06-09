(function(imports) {
'use strict';
  var WHERE = 'testiac';

  var _eventsEntries = document.getElementById('eventsEntries');
  var _btoPing = document.getElementById('ping');

  var whatEntry = _eventsEntries;

  var _count = 0;
  var _port = null;

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
          var msg = {
            txt: 'CJC test msg',
            num: _count++
          };
          var i = 1;
          ports.forEach(port => {
            addTxt('CJC - IAC connection success. Adding listener!', whatEntry);

            port.onmessage = function(evt) {
              console.log('CJC - received:' + JSON.stringify(evt.data));
              addTxt('Received:' +
                    evt.data ? JSON.stringify(evt.data) : 'No data', whatEntry);
            };
            addTxt('CJC - sending msg:' + JSON.stringify(msg), whatEntry);
            port.postMessage(msg);

            (i--) && (_port = port);
          });
        }, function onConnRejected(reason) {
          console.log('CJC Cannot connect:' + reason);
        });
      }
    };

  }

  window.addEventListener('load', function() {
    connect();

    _btoPing.addEventListener('click', function send() {
      addTxt('CJC - sending msg', whatEntry);
      _port.postMessage({
        txt: 'CJC test msg',
        num: _count++
      });
    });
  });

})(this);
