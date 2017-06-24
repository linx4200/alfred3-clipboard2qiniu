const shell = require('shelljs');
const path = require('path');
const tmpDirName = 'tmp';

function output(err, url) {
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
  // return '';
  // return JSON.stringify(resJson);
}

function run() {
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
    console.log('截图！！！！');
  }
}

run();