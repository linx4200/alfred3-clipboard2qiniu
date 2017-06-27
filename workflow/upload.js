const qiniu = require('qiniu');
const { conf } = require('./config');

class Qiniu {
  constructor() {
    const config = new qiniu.conf.Config();

    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0;

    const mac = new qiniu.auth.digest.Mac(conf.qiniu.ACCESS_KEY, conf.qiniu.SECRET_KEY);
    const options = {
      scope: conf.qiniu.bucket,  // 要上传的空间
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);

    this.config = config;
    this.uploadToken = uploadToken;

    // 上传到七牛后保存的文件名前缀
    this.filePrefix = conf.qiniu.filePrefix;
  }

  // 上传函数
  uploadFile(key, localFile) {
    const fileName = `${this.filePrefix}${key}`;
    const formUploader = new qiniu.form_up.FormUploader(this.config);
    const putExtra = new qiniu.form_up.PutExtra();
    // 文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(this.uploadToken, fileName, localFile, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(respErr);
        }
        if (respInfo.statusCode == 200) {
          resolve(respBody);
        } else {
          reject(respBody);
        }
      });
    });
  }
}

exports.Qiniu = Qiniu;
