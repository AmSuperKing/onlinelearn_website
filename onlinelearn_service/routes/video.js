var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors'); // CORS模块，处理web端跨域问题
var path = require('path');
var fs = require("fs");

router.use(cors());

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* Video page api. */

// 获取视频数据列表
router.post('/getVideoList', (req, res, next) => {
  const sql =`SELECT COUNT(*) FROM video_list;
  SELECT * FROM video_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results[0][0]['COUNT(*)'] > 0) {
      var listData = {
        total: '',
        data: []
      }
      listData.total = results[0][0]['COUNT(*)']
      listData.data = results[1]
      res.status(200).json({
        code: 200,
        data: listData,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取视频信息
router.get('/getVideoInfo', (req, res, next) => {
  let sql =`SELECT * FROM video_list
  WHERE path = '${req.query.search}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoInfo err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 搜索视频
router.get('/searchVideo', (req, res, next) => {
  let sql =`SELECT * FROM video_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchVideo err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 修改点击量
router.post('/updateVideoCountNum', (req, res, next) => {
  let sql =`UPDATE video_list
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/updateVideoCountNum err:', err);
      return res.status(500).json({
        code: 500,
        message: '更新数据失败'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '更新数据成功'
      });
      res.end();
    }
  });
});

// 获取视频目录
router.post('/getVideoSectionList', (req, res, next) => {
  let sql =`SELECT * FROM video_section_list
  WHERE LOWER(video_name) = LOWER('${req.body.video_name}')
  ORDER BY section_key`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getVideoSectionList err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取当前播放视频信息
router.post('/getCurrVideoInfo', (req, res, next) => {
  let sql =`SELECT * FROM video_section_list
  WHERE video_name = '${req.body[0]}'
  AND section_id = '${req.body[1]}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCurrVideoInfo err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取创建的视频教程列表
router.post('/getMyVideoList', (req, res, next) => {
  const sql =`SELECT COUNT(*) FROM video_list
  WHERE creator = '${req.body.user}';
  SELECT * FROM video_list
  WHERE creator = '${req.body.user}'
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getMyVideoList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    }
    if (results[0][0]['COUNT(*)'] > 0) {
      listData.total = results[0][0]['COUNT(*)']
      listData.data = results[1]
      res.status(200).json({
        code: 200,
        data: listData,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: listData,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 管理员全部列表
router.post('/getAllVideoList', (req, res, next) => {
  const sql =`SELECT COUNT(*) FROM video_list;
  SELECT * FROM video_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getAllVideoList  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    let listData = {
      total: 0,
      data: []
    }
    if (results[0][0]['COUNT(*)'] > 0) {
      listData.total = results[0][0]['COUNT(*)']
      listData.data = results[1]
      res.status(200).json({
        code: 200,
        data: listData,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: listData,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 获取用户创建的全部视频教程数据列表，不分页
router.post('/getMyAllVideo', (req, res, next) => {
  const sql =`SELECT * FROM video_list
  WHERE creator = '${req.body.user}'`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getMyAllVideo  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 管理员获取用户创建的全部视频教程数据列表，不分页
router.post('/getUserAllVideo', (req, res, next) => {
  const sql =`SELECT * FROM video_list`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getUserAllVideo  err:', err);
      return res.status(500).json({
        code: 500,
        message: '获取数据失败'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '获取数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 200,
        data: results,
        message: '暂无数据'
      });
      res.end();
    };
  });
});

// 修改视频信息
router.post('/updateVideoInfo', (req, res, next) => {
  let sql =`UPDATE video_list
  SET name = '${req.body.name}', describe_text = '${req.body.desc}'
  WHERE path = '${req.body.path}';`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateVideoInfo err:', err);
      return res.status(500).json({
        code: 500,
        message: '更新数据失败'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '更新数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '更新数据失败'
      });
      res.end();
    }
  });
});

// 管理员修改视频信息
router.post('/updateAllVideoInfo', (req, res, next) => {
  let sql =`UPDATE video_list
  SET name = '${req.body.name}', describe_text = '${req.body.desc}'
  WHERE path = '${req.body.path}';`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateAllVideoInfo err:', err);
      return res.status(500).json({
        code: 500,
        message: '更新数据失败'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '更新数据成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '更新数据失败'
      });
      res.end();
    }
  });
});

// 删除视频
router.post('/delVideo', (req, res, next) => {
  // img
  let imgArr = req.body.imgUrl.split('/');
  let imgLen = imgArr.length;
  let imgPath = imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let imgParam = './public/' + imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let sql =`DELETE FROM video_section_list WHERE video_name = '${req.body.path}';
  DELETE FROM video_list WHERE path = '${req.body.path}';
  DELETE FROM file_url WHERE pathName = '${imgPath}';`;
  fs.unlink(imgParam, (error) => {
    if(error) {
        console.log('删除文件', error);
        return false;
    } else {
      console.log('删除封面文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delVideo err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除数据失败'
      });
    };
    if(results[1].affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除视频教程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除视频教程失败'
      });
      res.end();
    }
  });
});

// 管理员删除视频
router.post('/delAllVideo', (req, res, next) => {
  // img
  let imgArr = req.body.imgUrl.split('/');
  let imgLen = imgArr.length;
  let imgPath = imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let imgParam = './public/' + imgArr[imgLen -2] + '/' + imgArr[imgLen -1];
  let sql =`SELECT * FROM video_section_list WHERE video_name = '${req.body.path}';
  DELETE FROM file_url WHERE pathName = '${imgPath}';
  DELETE FROM video_section_list WHERE video_name = '${req.body.path}';
  DELETE FROM video_list WHERE path = '${req.body.path}';`;
  fs.unlink(imgParam, (error) => {
    if(error) {
        console.log('删除封面文件error', error);
        return false;
    } else {
      console.log('删除封面文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delAllVideo err:', err);
      return res.status(500).json({
        code: 500,
        message: '删除数据失败'
      });
    };
    if(results[0].length) {
      for (let i = 0; i < results[0].length; i++) {
        let tempArr = results[0][i].section_key.split('/');
        let tempLen = tempArr.length;
        let tempParam = './public/' + tempArr[tempLen - 2] + '/' + tempArr[tempLen - 1];
        fs.unlink(tempParam, (error) => {
          if(error) {
              console.log('删除文件error', error);
              return false;
          } else {
            console.log('删除视频文件成功');
          }
        })
      }
    }
    if(results[3].affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除视频教程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除视频教程失败'
      });
      res.end();
    }
  });
});

var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

// 获取章节文件
router.post('/downloadVideo', (req, res, next) => {
  let paramArr = req.body.path.split('/');
  let arrLen = paramArr.length;
  let fileName = paramArr[arrLen - 1];
  paramArr.shift();
  paramArr.shift();
  paramArr.shift();
  let path = prePath + '/' + paramArr.join('/');
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream', // 告诉浏览器这是一个二进制文件
    'Content-Disposition': 'attachment; filename='+ fileName
  })
  let readStream = fs.createReadStream(path); // 得到文件输入流
  readStream.on('data', (chunk) => {
    res.write(chunk, 'binary'); // 文档内容以二进制的格式写到response的输出流
  });
  readStream.on('end', () => {
    res.end();
  })
  // res.download(path, fileName, (err) => {
  //   if(err) {
  //     console.log('download video err:', err)
  //   }
  // })
});

module.exports = router;
