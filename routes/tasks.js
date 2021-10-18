
const express = require('express');
const { isEmpty } = require('lodash');
const { connection } = require('../db');
const router = express.Router();

// define the home page route
router.get('/', function (req, res) {
    const { sortBy, order = 'ASC' } = req.query;
    let url = 'SELECT * FROM tasks';
    if (sortBy) {
        url = `${ url} ORDER BY ${sortBy} ${order}`
    }
    connection.query(url, function (err, rows) {
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
    let values = '';
    Object.keys(req.body).forEach(function (key, index) {
        var val = req.body[key];
        if (typeof val === 'number') {
            values = `${values} ${val}`;
        } else {
            values = `${values} '${val}'`;
        }
        if(index < Object.keys(req.body).length - 1) {
            values = `${values},`;
        }
    });
    const url = `INSERT INTO tasks
    (${Object.keys(req.body).join()})
    VALUES(${values})
    `;
    connection.query(url, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }
      
        if(rows.affectedRows) {
            return res.status(200).send({
                status: 'success',
                data: 'Task Created successfully.'
            });
        }
    });
});

router.put('/:id', function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM tasks WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }

        if(isEmpty(rows)) {
            return res.status(200).send({
                status: 'success',
                data: 'Task data not exist.'
            });
        } else {
            let url = `UPDATE tasks SET`;
            
            Object.keys(req.body).forEach(function (key, index) {
                var val = req.body[key];
                if (typeof val === 'number') {
                    url = `${url} ${ key } = ${val}`;
                } else {
                    url = `${url} ${ key } = '${val}'`;
                }
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
                        data: 'Task updated successfully.'
                    });
                }
            });
        }
    });
});

router.get('/:id', function (req, res) {
    const { id } = req.params;
    connection.query(`SELECT * FROM tasks WHERE id = ${id}`, function (err, rows) {
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
    connection.query(`SELECT * FROM tasks WHERE id = ${id}`, function (err, rows) {
        if (err) {
            return res.status(400).send({
                status: 'Failure',
                data: err.code
            });
        }

        if(isEmpty(rows)) {
            res.status(200).send({
                status: 'success',
                data: 'Tasks data not exist.'
            });
        } else {
            connection.query(`DELETE FROM tasks WHERE id = ${id}`, function (err1, rows1) {                
                if (err) {
                    return res.status(400).send({
                        status: 'Failure',
                        data: err.code
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    data: 'Task deleted successfully.'
                });
            });
        }
      });
});

module.exports = router