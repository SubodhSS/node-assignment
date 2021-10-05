
const express = require('express');
const { isEmpty } = require('lodash');
const { connection } = require('../db');
const router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    connection.query('SELECT * FROM users', function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }
        return res.status(200).send({
            status: 'success',
            data: rows
        })
      });
});

router.post('/', function (req, res) {
    const { email, password } = req.body;
    connection.query(`INSERT INTO users
    (email, password)
    VALUES('${email}', '${password}')
    `, function (err, rows) {
        if (err) {
            if(err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send({
                    status: 'Failure',
                    message: 'Email already exist.' 
                });
            }
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }
      
        if(rows.affectedRows) {
            return res.status(200).send({
                status: 'success',
                data: 'User Created successfully.'
            });
        }
    });
});

router.put('/:id', function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM users WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }

        if(isEmpty(rows)) {
            return res.status(200).send({
                status: 'success',
                data: 'User data not exist.'
            });
        } else {
            let url = `UPDATE users SET`;
            
            Object.keys(req.body).forEach(function (key, index) {
                var val = req.body[key];
                url = `${url} ${ key } = '${val}'`;
                if(index < Object.keys(req.body).length - 1) {
                    url = `${url},`;
                }
            });
        
            url = `${url} WHERE id = ${id}`;
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
                        data: 'User updated successfully.'
                    });
                }
            });
        }
    });
});

router.get('/:id', function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM users WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }

        if(isEmpty(rows)) {
            res.status(200).send({
                status: 'success',
                data: {}
            });
        } else {
            const [ data ] = rows;
            res.status(200).send({
                status: 'success',
                data
            });
        }
      });
});

router.delete('/:id', function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM users WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }

        if(isEmpty(rows)) {
            res.status(200).send({
                status: 'success',
                data: 'User data not exist.'
            });
        } else {
            connection.query(`DELETE FROM users WHERE id = ${id}`, function (err1, rows1) {                
                if (err1) {
                    return res.status(400).send({
                        status: 'Failure',
                        data: err1.code
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    data: 'User deleted successfully.'
                });
            });
        }
      });
});

module.exports = router