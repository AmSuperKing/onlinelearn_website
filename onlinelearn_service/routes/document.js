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

/* Document page api. */

// 获取文档数据列表
router.post('/getDocumentList', (req, res, next) => {
  const sql =`SELECT COUNT(*) FROM document_list;
  SELECT * FROM document_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getDocumentList  err:', err);
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

// 获取所有文档数据列表不分页
router.get('/getAllDoc', (req, res, next) => {
  const sql =`SELECT * FROM document_list`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getAllDoc  err:', err);
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

// 搜索文档
router.get('/searchDocument', (req, res, next) => {
  let sql =`SELECT * FROM document_list
  WHERE  LOWER(name) LIKE LOWER('%${req.query.search}%')`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/searchDocument err:', err);
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

// 获取文档信息
router.get('/getDocInfo', (req, res, next) => {
  let sql =`SELECT * FROM document_list
  WHERE path = '${req.query.search}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getDocInfo err:', err);
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
router.post('/updateCountNum', (req, res, next) => {
  let sql =`UPDATE document_list
  SET count_num = count_num + 1
  WHERE name = '${req.body.name}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/updateCountNum err:', err);
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

// 获取文档目录
router.post('/getDocSectionList', (req, res, next) => {
  let sql =`SELECT * FROM document_section_list
  WHERE LOWER(document_name) = LOWER('${req.body.document_name}')`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getDocSectionList err:', err);
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

// 获取当前章节信息
router.post('/getCurrSectionInfo', (req, res, next) => {
  let sql =`SELECT * FROM document_section_list
  WHERE document_name = '${req.body[0]}'
  AND section_id = '${req.body[1]}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/getCurrSectionInfo err:', err);
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

// 修改文档信息
router.post('/updateDocInfo', (req, res, next) => {
  let sql =`UPDATE document_list
  SET name = '${req.body.name}', describe_text = '${req.body.desc}'
  WHERE path = '${req.body.path}';`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateDocInfo err:', err);
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

// 删除文档
router.post('/delDoc', (req, res, next) => {
  let pathArr = req.body.imgUrl.split('/');
  pathArr.shift();
  pathArr.shift();
  pathArr.shift();
  let path = pathArr.join('/');
  let pathName = './public/' + pathArr.join('/');
  let sql =`DELETE FROM document_section_list WHERE document_name = '${req.body.path}';
  DELETE FROM document_list WHERE path = '${req.body.path}';
  DELETE FROM file_url WHERE pathName = '${path}'`;
  fs.unlink(pathName, (error) => {
    if(error) {
        console.log('删除文件error', error);
        return false;
    } else {
      console.log('删除文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delDoc err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    if(results[1].affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除文档教程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除文档教程失败'
      });
      res.end();
    }
  });
});

// 获取所有文档教程列表
router.post('/getAllDocSecList', (req, res, next) => {
  const sql =`SELECT COUNT(*) FROM document_section_list;
  SELECT * FROM document_section_list
  LIMIT ${req.body.pageSize} OFFSET ${(req.body.currentPage-1)*req.body.pageSize}`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getAllDocSecList  err:', err);
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

// 删除文档章节
router.post('/delDocSec', (req, res, next) => {
  let sql =`DELETE FROM document_section_list WHERE section_key = '${req.body.section_key}';
  DELETE FROM file_url WHERE pathName = '${req.body.section_key}'`;
  let path = './public/' + req.body.section_key
  fs.unlink(path, (error) => {
    if(error) {
        console.log('删除文件error', error);
        return false;
    } else {
      console.log('删除章节文件成功');
    }
  })
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/delDocSec err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    if(results[0].affectedRows > 0) {
      res.status(200).json({
        code: 200,
        data: results,
        message: '删除文档教程成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '删除文档教程失败'
      });
      res.end();
    }
  });
});

// 用户中心创建文档教程
router.post('/newDoc', (req, res, next) => {
  let sql =`INSERT INTO document_list(name,describe_text,path,imgUrl,count_num)
  VALUES('${req.body.name}','${req.body.desc}','${req.body.path}','${req.body.imgUrl}',0);`;
  if (req.body.user_role == 'admin') {
    connection.query(sql, (err, results) => {
      if(err){
        console.log('/api/newDoc err:', err);
        return res.status(500).json({
          code: 500,
          message: '获取数据失败'
        });
      };
      if (results.affectedRows > 0) {
        res.status(200).json({
          code: 200,
          data: results,
          message: '创建教程成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '创建教程失败'
        });
        res.end();
      };
    });
  } else {
    res.status(401).json({
      code: 401,
      message: '无权限操作'
    });
    res.end();
  }
});

// 用户中心上传章节文件
router.post('/uploadDocSection', (req, res, next) => {
  let sql =`INSERT INTO document_section_list(document_name,section_title,section_id,section_key)
  VALUES('${req.body.document}','${req.body.fileName}','${req.body.section_id}','${req.body.fileUrl}');`;
  if (req.body.user_role == 'admin') {
    connection.query(sql, (err, results) => {
      if(err){
        console.log('/api/uploadVideoFile err:', err);
        return res.status(500).json({
          code: 500,
          message: '获取数据失败'
        });
      };
      if (results.affectedRows > 0) {
        res.status(200).json({
          code: 200,
          data: results,
          message: '上传文件成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '上传文件失败'
        });
        res.end();
      };
    });
  } else {
    res.status(401).json({
      code: 401,
      message: '没有操作权限'
    });
    res.end();
  }
});

var pathParentDir = path.resolve(__dirname, '..');
var prePath = path.join(pathParentDir, 'public');

// 获取章节文件
router.post('/getDocumentSection', (req, res, next) => {
  let sql = `SELECT * FROM document_section_list
  WHERE document_name = '${req.body.params.fileKey[1]}'
  AND section_id = '${req.body.params.fileKey[2]}'`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/getDocumentSection err:', err);
      return res.status(500).json({
        code: 500,
        message: '操作数据失败'
      });
    };
    if(results.length > 0) {
      if (results.length == 1) {
        let file = './public/' + results[0].section_key;
        res.writeHead(200, {'Content-Type': 'application/octet-stream'}) // 告诉浏览器这是一个二进制文件
        let readStream = fs.createReadStream(file); // 得到文件输入流
        readStream.on('data', (chunk) => {
          res.write(chunk, 'binary'); // 文档内容以二进制的格式写到response的输出流
        });
        readStream.on('end', () => {
          res.end();
        })
      }
    }
  });
  // const pathStr = req.body.params.fileKey[0] + "\\" + req.body.params.fileKey[1] + "\\" + req.body.params.fileKey[2];
  // res.sendFile(prePath + "\\" + pathStr + ".html");
});

module.exports = router;
