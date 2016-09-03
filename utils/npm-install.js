'use strict';

const spawn = require('child_process').spawn;
const which = require('which');

const npmInstall = function (cwd, cb) {
  which('npm', (err, resolved) => {
    if (err) {
      return cb(err);
    }

    let installError = false;

    const inst = spawn(resolved, ['install'], {stdio: 'inherit', cwd});

    inst.on('error', err => {
      installError = true;
      cb(err);
    });

    inst.on('close', code => {
      if (!installError) {
        cb(code);
      }
    });
  });
};

module.exports = npmInstall;
