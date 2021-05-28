var express = require('express');
var router = express.Router();
var cors = require('cors'); // CORS模块，处理web端跨域问题
// 引入token 
var vertoken=require('../token/token');

router.use(cors()); 

// 使用mysql中间件连接MySQL数据库
var mysql_connection = require('../sql/sql');
var connection = mysql_connection.mysql_connection

/* User page api. */

// 登录
router.post('/userLogin', function(req, res, next) {
  // usertable为表名
  const sql =`SELECT * FROM usertable WHERE user_name = '${req.body.account}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/userLogin  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    };
    if (results.length > 0) {
      if(results[0].password == req.body.password) {
        // 调用生成token的方法
        vertoken.setToken(results[0].user_name, results[0].user_id).then(token => {
          res.status(200).json({
            code: 200,
            data: results,
            token: token,
            message: '登录成功'
          });
          res.end();
        })
      } else {
        res.status(200).json({
          code: 100,
          data: [{}],
          message: '密码错误'
        });
        res.end();
      }
    } else {
      res.status(200).json({
        code: 100,
        data: [{}],
        message: '账号不存在'
      });
      res.end();
    };
  });
});

// 获取用户名称不需要token
router.post('/searchName', (req, res, next) => {
  const sql =`SELECT user_name FROM usertable WHERE user_id = '${req.body.curr_id}'`;
  if (req.body.curr_id) {
    connection.query(sql,(err, results) => {
      if(err){
        console.log('/api/searchName  err:', err);
        return res.status(500).json({
          code: 500,
          message: '服务器获取数据出错'
        });
      };
      if (results.length > 0) {
        res.status(200).json({
          code: 200,
          data: results[0],
          message: '获取用户数据成功'
        });
        res.end();
      } else {
        res.status(400).json({
          code: 400,
          data: [],
          message: '未能正确获取用户数据'
        });
        res.end();
      };
    });
  } else {
    res.status(500).json({
      code: 500,
      data: [],
      message: '未能正确获取用户数据'
    });
    res.end();
  }
});

// 获取用户名称
router.post('/getUserName', (req, res, next) => {
  const sql =`SELECT user_name FROM usertable WHERE user_id = '${req.body.user_id}'`;
  vertoken.getToken(req.headers.authorization).then(token => {
    if (token.user_id == req.body.user_id) {
      console.log('token 验证成功')
      connection.query(sql,(err, results) => {
        if(err){
          console.log('/api/getUserName  err:', err);
          return res.status(500).json({
            code: 500,
            message: '服务器获取数据出错'
          });
        };
        if (results.length > 0) {
          res.status(200).json({
            code: 200,
            data: results,
            message: '获取用户数据成功'
          });
          res.end();
        } else {
          res.status(500).json({
            code: 500,
            data: [{}],
            message: '未能正确获取用户数据'
          });
          res.end();
        };
      });
    } else {
      res.status(500).json({
        code: 500,
        data: [{}],
        message: '未能正确获取用户数据'
      });
      res.end();
    }
  });
});

// 查询用户角色
router.post('/searchRole', (req, res, next) => {
  const sql =`SELECT user_role FROM usertable WHERE user_id = '${req.body.user_id}'`;
  connection.query(sql,(err, results) => {
    if(err){
      console.log('/api/searchRole  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器获取数据出错'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        data: results[0],
        message: '获取用户角色成功'
      });
      res.end();
    } else {
      res.status(500).json({
        code: 500,
        data: [],
        message: '未能正确获取用户数据'
      });
      res.end();
    };
  });
});

// 注册
router.post('/userRegister', (req, res, next) => {
  let userName = req.body.account;
  let userNameCode = '';
  var dispatch_id = '';
  for(let i = userName.length - 1; i >= 0; i--) {
    let nameChar = userName.charAt(i);
    let charCode = nameChar.charCodeAt();
    userNameCode += charCode;
  }
  // 7811710998101114是'Number'的转换
  if(userNameCode.length < 14) {
    userNameCode += '7811710998101114'
  }
  dispatch_id = '1' + userNameCode.slice(0, 14);
  // usertable为表名
  const inset_sql =`INSERT IGNORE INTO usertable(user_id,password,user_name,user_role)
  VALUES ('${dispatch_id}','${req.body.password}','${req.body.account}','usual')`;
  connection.query(inset_sql,(err, result) => {
    if(err){
      console.log('/api/userRegister err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '注册成功'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 0,
          message: '用户已存在'
        });
        res.end();
      }
    };
  });
});

// 添加申诉
router.post('/addAppeal', (req, res, next) => {
  let inset_sql =
  `INSERT IGNORE INTO appeal_list(user_name,appeal_title,appeal_date,appeal_desc,appeal_prove,appeal_contact)
  VALUES ('${req.body.account}','${req.body.title}','${req.body.date}','${req.body.desc}','${req.body.prove}','${req.body.contact}')`;
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/addAppeal err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if (result.affectedRows) {
        res.status(200).json({
          code: 200,
          message: '此账号申诉已提交'
        });
        res.end();
      } else {
        res.status(200).json({
          code: 100,
          message: '该账号申诉已存在'
        });
        res.end();
      }
    };
  });
});

// 获取密保
router.get('/getQuestion', (req, res, next) => {
  let select_sql =
  `SELECT * from usertable
  WHERE user_name = '${req.query.user_name}'`;
  connection.query(select_sql, (err, result) => {
    if(err){
      console.log('/api/addAppeal err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if (result.length) {
        if (result[0].question1 != null || result[0].question2 != null) {
          let queryRes = [{
            question: result[0].question1
          }, {
            question: result[0].question2
          }]
          res.status(200).json({
            code: 200,
            data: queryRes,
            message: '获取密保问题成功'
          });
          res.end();
        } else {
          res.status(200).json({
            code: 100,
            data: [],
            message: '该账户未设置密保问题'
          });
          res.end();
        }
      } else {
        res.status(200).json({
          code: 100,
          message: '该账户不存在'
        });
        res.end();
      }
    };
  });
});

// 密保回答验证
router.post('/confirmAnswer', (req, res, next) => {
  let inset_sql =
  `SELECT * from usertable
  WHERE user_name = '${req.body.user_name}'`;
  connection.query(inset_sql, (err, result) => {
    if(err){
      console.log('/api/confirmAnswer err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if(result.length) {
        if(result[0].question1 == req.body.question) {
          if (result[0].answer1 == req.body.answer) {
            res.status(200).json({
              code: 200,
              message: '验证通过'
            });
            res.end();
          } else {
            res.status(200).json({
              code: 100,
              message: '验证失败'
            });
            res.end();
          }
        } else if(result[0].question2 == req.body.question) {
          if (result[0].answer2 == req.body.answer) {
            res.status(200).json({
              code: 200,
              message: '验证通过'
            });
            res.end();
          } else {
            res.status(200).json({
              code: 100,
              message: '验证失败'
            });
            res.end();
          }
        }
      } else {
        res.status(200).json({
          code: 100,
          message: '查询信息出错'
        });
        res.end();
      }
    };
  });
});

// 重置密码
router.post('/resetPwd', (req, res, next) => {
  let sql =`UPDATE usertable
  SET password = '${req.body.password}'
  WHERE user_name = '${req.body.account}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/resetPwd err:', err);
      return res.status(500).json({
        code: 500,
        message: '重置密码出错'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '重置密码成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '重置密码失败'
      });
      res.end();
    }
  });
});

// 确认密码
router.post('/confirmPwd', function(req, res, next) {
  // usertable为表名
  const sql =`SELECT * FROM usertable
  WHERE user_id = '${req.body.userId}'
  AND password = '${req.body.pwd}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/confirmPwd  err:', err);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    };
    if (results.length > 0) {
      res.status(200).json({
        code: 200,
        message: '验证成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '验证失败'
      });
      res.end();
    };
  });
});

// 修改密码
router.post('/changePwd', (req, res, next) => {
  let sql =`UPDATE usertable
  SET password = '${req.body.pwd}'
  WHERE user_id = '${req.body.userId}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/resetPwd err:', err);
      return res.status(500).json({
        code: 500,
        message: '修改密码出错'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '修改密码成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '修改密码失败'
      });
      res.end();
    }
  });
});


// 获取密保和回答
router.post('/getQuesAns', (req, res, next) => {
  let select_sql =
  `SELECT * from usertable
  WHERE user_id = '${req.body.userId}'`;
  connection.query(select_sql, (err, result) => {
    if(err){
      console.log('/api/getQuesAns err.message:', err.message);
      return res.status(500).json({
        code: 500,
        message: '服务器错误'
      });
    } else {
      if (result.length) {
        if (result[0].question1 || result[0].question2) {
          let list = [{
            question1: result[0].question1,
            answer1: result[0].answer1
          }, {
            question2: result[0].question2,
            answer2: result[0].answer2
          }]
          res.status(200).json({
            code: 200,
            data: list,
            message: '获取密保成功'
          });
          res.end();
        } else {
          res.status(200).json({
            code: 200,
            data: [],
            message: '未设置密保'
          });
          res.end();
        }
      } else {
        res.status(200).json({
          code: 100,
          message: '获取密保失败'
        });
        res.end();
      }
    };
  });
});

// 修改密保
router.post('/updateEncry', (req, res, next) => {
  let sql =`UPDATE usertable
  SET question1 = '${req.body.q1}',answer1 = '${req.body.a1}',question2 = '${req.body.q2}',answer2 = '${req.body.a2}'
  WHERE user_id = '${req.body.userId}'`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/updateEncry err:', err);
      return res.status(500).json({
        code: 500,
        message: '修改密保出错'
      });
    };
    if(results.affectedRows) {
      res.status(200).json({
        code: 200,
        message: '修改密保成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '修改密保失败'
      });
      res.end();
    }
  });
});

// 用户注销
router.post('/userDestory', (req, res, next) => {
  let sql =`
  DELETE FROM video_section_list WHERE creator = '${req.body.userId}';
  DELETE FROM video_list WHERE creator = '${req.body.userId}';
  DELETE FROM answer_list WHERE answer_userId = '${req.body.userId}';
  DELETE FROM question_list WHERE create_userId = '${req.body.userId}';
  DELETE FROM course_join_list WHERE joiner = '${req.body.userId}';
  DELETE FROM course_resource WHERE creator = '${req.body.userId}';
  DELETE FROM course_list WHERE creator = '${req.body.userId}';
  DELETE FROM ebook_list WHERE creator = '${req.body.userId}';
  DELETE FROM history_list WHERE user_id = '${req.body.userId}';
  DELETE FROM usertable WHERE user_id = '${req.body.userId}';`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/userDestory err:', err);
      return res.status(500).json({
        code: 500,
        message: '注销出错'
      });
    };
    if(results[9].affectedRows) {
      res.status(200).json({
        code: 200,
        message: '注销成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '注销失败'
      });
      res.end();
    }
  });
});

// 修改用户信息
router.post('/updateUserInfo', (req, res, next) => {
  let sql =`UPDATE usertable
  SET user_name = '${req.body.user_name}',password = '${req.body.password}',user_role = '${req.body.user_role}'
  WHERE user_id = '${req.body.user_id}';`;
  connection.query(sql, (err, results) => {
    if(err) {
      console.log('/api/updateUserInfo err:', err);
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

// 用户删除
router.post('/delUser', (req, res, next) => {
  let sql =`
  DELETE FROM video_section_list WHERE creator = '${req.body.user_id}';
  DELETE FROM video_list WHERE creator = '${req.body.user_id}';
  DELETE FROM answer_list WHERE answer_userId = '${req.body.user_id}';
  DELETE FROM question_list WHERE create_userId = '${req.body.user_id}';
  DELETE FROM course_join_list WHERE joiner = '${req.body.user_id}';
  DELETE FROM course_resource WHERE creator = '${req.body.user_id}';
  DELETE FROM course_list WHERE creator = '${req.body.user_id}';
  DELETE FROM ebook_list WHERE creator = '${req.body.user_id}';
  DELETE FROM history_list WHERE user_id = '${req.body.user_id}';
  DELETE FROM usertable WHERE user_id = '${req.body.user_id}';`;
  connection.query(sql, (err, results) => {
    if(err){
      console.log('/api/delUser err:', err);
      return res.status(500).json({
        code: 500,
        message: '注销出错'
      });
    };
    if(results[9].affectedRows) {
      res.status(200).json({
        code: 200,
        message: '注销成功'
      });
      res.end();
    } else {
      res.status(200).json({
        code: 100,
        message: '注销失败'
      });
      res.end();
    }
  });
});

module.exports = router;