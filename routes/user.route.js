
const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    User = require('../models/user.model');
    jwt = require('jsonwebtoken');

/*SignUP */
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({
                "Error": err
            })
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                email: req.body.email,
                password: hash
            });

            user.save().then((result)=>{
                console.log(result);
                res.status(200).json({
                    success: "New User has been created"
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
});

/*SignIN */

router.post('/signin',(req,res)=> {
    User.findOne({email:req.body.email})
    .exec()
    .then((user)=>{
        bcrypt.compare(req.body.password,user.password,(err,result)=> {
            if(err){
               return res.status(401).json({
                      failed: "Unauthorized Access"
                });
            } if(result){
                const JWTtoken = jwt.sign({
                    email: user.email,
                    _id: user._id
                },
                'secret',
                {
                    expiresIn: '1h'
                });
                return res.status(200).json({
                    success:"Welcome to Tokenbased JWT Authentication",
                    token: JWTtoken
                });
            }
            return res.status(401).json({
                failed:"Unauthorized Access"
            });
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;