const shell = require('shelljs');
const path = require('path');
const { Qiniu } = require('./upload');
const { config } = require('./config');

const tmpDirName = 'tmp';

function output(err, url) {
  /* eslint-disable no-console */
  if (err) {
    return console.log(JSON.stringify({
      'items': [
        {
          'uid': 'error',
          'title': err,
          'subtitle': err,
          'arg': err
        }
      ]
    }));
  }
  return console.log(JSON.stringify({
    'items': [
      {
        'uid': + new Date(),
        'title': 'Uploaded to Qiniu!',
        'subtitle': url,
        'arg': url
      }
    ]
  }));
  /* eslint-enable no-console */
}

const run = async function () {
  // 创建 tmp 文件夹   mkdir -p will create the directory if it does not exist, otherwise does nothing.
  const tmpDir = path.join(__dirname, tmpDirName);
  shell.mkdir('-p', tmpDir);
  shell.cd(tmpDir);
  const filename = `${+ new Date()}.png`;
  const { stderr } = shell.exec(`pngpaste ${filename}`, { silent: true });
  if (stderr !== '') {
    return output('No image data found on the clipboard, or could not convert!');
  } else {
    // 截图成功保存到本地
    const imageDir = path.join(__dirname, tmpDirName, filename);
    // 上传到七牛云
    const qiniu = new Qiniu();
    try {
      const { key } = await qiniu.uploadFile(filename, imageDir);
      const url = `${config.qiniu.urlPrefix}${key}`;
      // 删除 tmp 文件夹
      shell.rm('-rf', tmpDir);

      return output(null, url);
    } catch (e) {
      return output(`[qiniu]:${e.code}:${e.error}`);
    }
  }
};

run();