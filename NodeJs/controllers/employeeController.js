const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Employee } = require('../models/employee');

router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in retriving Employees :' + JSON.stringify(err, undefined, 2)) }
    });
});

router.get('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    Employee.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in retriving Employees :' + JSON.stringify(err, undefined, 2)) }
    })
})

router.post('/', (req, res) => {
    var emp = new Employee()

    emp.name = req.body.name;
    emp.position = req.body.position;
    emp.office = req.body.office;
    emp.salary = req.body.salary;
    emp.save(function (err) {
        if (err)
            res.json(err);
        res.json({
            message: "New Player Added!",
            emp
        });
    });
});

router.put('/:id', (req, res) => {
    Employee.findById(req.params.id, function (err, emp) {
        if (err)
            res.send(err);
        emp.name = req.body.name;
        emp.position = req.body.position;
        emp.office = req.body.office;
        emp.salary = req.body.salary;

        emp.save(function (err) {
            if (err)
                res.json(err)
            res.json(emp)
        })
    })
})
router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id: ${req.params.id}`);

    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Employee delete:' + JSON.stringify(err, undefined, 2)) }
    });
})

module.exports = router;