'use strict';

const axios = require('axios');
const chalk = require('chalk');
const trim = require('lodash/trim');
const unzipExtract = require('unzip').Extract;
const unzipParse = require('unzip').Parse;
const fs = require('fs');
const mkdirp = require('mkdirp');
const mv = require('mv');

const TIMEOUT = 900000; // 15min

function getZipDirName(zipFileName) {
  let zipDir = '';
  return new Promise(resolve => {
    fs.createReadStream(zipFileName)
      .pipe(unzipParse())
      .on('entry', entry => {
        if (!zipDir && entry.type === 'Directory') {
          zipDir = trim(entry.path, '/');
        }
        return entry.autodrain();
      })
      .on('close', () => resolve(zipDir));
  });
}

const cloneRepo = function (options) {
  const answers = options.answers;
  const downloadUrl = options.downloadUrl;
  const destDir = options.destDir;
  const downloadedDir = options.downloadedDir;

  const zipFileName = `${destDir}/downloaded.zip`;

  mkdirp.sync(destDir);

  return function (cb) {
    console.log(chalk.blue('--Downloading repo theme files--'));
    console.log(`Downloading ${chalk.magenta(answers.theme)}`);

    const request = axios.create({
      timeout: TIMEOUT,
      responseType: 'stream'
    });

    return request.get(downloadUrl)
      .then(response => {
        let closed = false;
        let zipDir = '';
        try {
          // Trying to catch pointless zlib errs
          response.data
            .pipe(fs.createWriteStream(zipFileName))
            .on('close', () => {
              getZipDirName(zipFileName)
                .then(result => {
                  zipDir = result;
                })
                .then(() => {
                  fs.createReadStream(zipFileName)
                    .pipe(unzipExtract({path: destDir}))
                    .on('close', () => {
                      if (!closed) {
                        closed = true;
                        mv(`${destDir}/${zipDir}`, `${destDir}/${downloadedDir}`, {mkdirp: true}, cb);
                      }
                    })
                    .on('error', () => {
                      if (!closed) {
                        closed = true;
                        cb();
                      }
                    });
                });
            });
        } catch (e) {
          console.log('caught?');
          if (!closed) {
            closed = true;
            cb();
          }
        }
      })
      .catch(cb);
  };
};

module.exports = cloneRepo;
