const qiniu = require('qiniu');
const { config } = require('./config');

class Qiniu {
  constructor() {
    qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

    // 要上传的空间
    this.bucket = config.qiniu.bucket;

    // 上传到七牛后保存的文件名前缀
    this.filePrefix = config.qiniu.filePrefix;
  }

  // 上传策略函数
  _uptoken(key) {
    const putPolicy = new qiniu.rs.PutPolicy(`${this.bucket}:${key}`);
    return putPolicy.token();
  }

  // 上传函数
  uploadFile(key, localFile) {
    var extra = new qiniu.io.PutExtra();
    var fileName = `${this.filePrefix}${key}`;

    //生成上传 Token
    const token = this._uptoken(fileName);

    return new Promise((resolve, reject) => {
      qiniu.io.putFile(token, fileName, localFile, extra, (err, ret) => {
        if (!err) {
          // 上传成功， 处理返回值
          resolve(ret);
        } else {
          // 上传失败， 处理返回代码
          reject(err);
        }
      });
    });
  }
}

exports.Qiniu = Qiniu;
