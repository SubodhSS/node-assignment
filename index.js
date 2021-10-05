const express = require('express');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash');

const { connection } = require('./db.js');
const { accessTokenSecret } = require('./constant');
const users = require('./routes/users');
const buckets = require('./routes/buckets');
const tasks = require('./routes/tasks');

const app = express();


app.use(express.json());
app.all('*', checkUser);
app.use('/users', users);
app.use('/buckets', buckets);
app.use('/tasks', tasks);

function checkUser(req, res, next) {
  const nonSecurePaths = ['/', '/login', '/users'];
  if (nonSecurePaths.includes(req.path)) return next();

  //authenticate user
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  } else {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
  }
}    

app.get('/', function (req, res) {
  res.send('Welcome to assignment for the task...!!!');
});

app.post('/login', function (req, res) {
  const { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).send({
      status: 'Failure',
      message: 'Email or Password missing.' 
    });
  }
  const url = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
  connection.query(url, function (err, rows) {
    if (err) {
      return res.status(400).send({
          status: 'Failure',
          data: err.code
      });
  }

  if(isEmpty(rows)) {
    res.status(200).send({
        status: 'success',
        data: 'Invalid user credentials'
    });
  } else {
    const [data] = rows;
    const accessToken = jwt.sign({ id: data.id,  email: data.email }, accessTokenSecret, { expiresIn: '20m' });

        // res.json({
        //     accessToken
        // });
    let url = `UPDATE users SET token = '${accessToken}' WHERE id = ${data.id}`;
    connection.query(url, function (err1, rows1) {
        if (err1) {
            if(err1.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({
                    status: 'Failure',
                    message: 'Email already exist.' 
                });
            }
            return res.status(400).send({
                status: 'Failure',
                data: err1.code
            });
        }
        if(rows1.affectedRows) {
            return res.status(200).send({
                status: 'success',
                data: accessToken
            });
        }
      });
    }
    // res.status(200).send(`The solution is:  ${JSON.stringify(rows)}`)
  });

});
 
app.listen(3000, () => {
    console.log('Server running at port 3000');
});