(function(window) {
  'use strict';

  var origin = document.location.origin;
  var _btoInstallClt = document.getElementById('installClt');
  var _btoInstallSvr = document.getElementById('installSvr');
  var I = 'iactest';

  function install(what) {
    var origin = document.location.origin;
    // Could get this from the href but not really worth the hassle
    var realPath = origin + '/' + I + '/' + what + '/manifest.webapp';
    navigator.mozApps.install(realPath);
  }

  function installSVR() {
    install('server/server1');
    install('server/server2');
  }

  window.addEventListener('load', function() {
    _btoInstallClt.addEventListener('click', install.bind(null, 'client'));
    _btoInstallSvr.addEventListener('click', installSVR);
  });

})(window);
