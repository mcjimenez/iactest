(function(window) {
  'use strict';

  var origin = document.location.origin;
  var _btoInstallClt = document.getElementById('installClt');
  var _btoInstallSvr1 = document.getElementById('installSvr1');
  var _btoInstallSvr2 = document.getElementById('installSvr2');
  var I = 'iactest';

  function install(what) {
    var origin = document.location.origin;
    // Could get this from the href but not really worth the hassle
    var realPath = origin + '/' + I + '/' + what + '/manifest.webapp';
    navigator.mozApps.install(realPath);
  }

  window.addEventListener('load', function() {
    _btoInstallClt.addEventListener('click', install.bind(null, 'client'));
    _btoInstallSvr1.addEventListener('click',
                                     install.bind(null, 'server/server1'));
    _btoInstallSvr2.addEventListener('click',
                                     install.bind(null, 'server/server2'));
  });

})(window);
