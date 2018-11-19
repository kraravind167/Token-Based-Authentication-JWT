const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
const app = express();

const user = require('./routes/user.route');
const ProtectedRoute = express.Router();
const jwt = require('jsonwebtoken');
const User = require('./models/user.model')
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/jwttokenauth', { useNewUrlParser: true });

app.get('/checking', (req, res) => {
    res.json({
        "Message": "Function works"
    });
});

app.use('/user', user);

/* Protected Routes */
app.use('/auth', ProtectedRoute);

ProtectedRoute.use((req, res, next) => {
    var token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.json({ "msg": "Invalid Token" });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        res.send({
            "msg": "No token provided"
        });
    }

});

ProtectedRoute.get('/getAll', (req, res) => {
    User.find({}).then((user) => {
        res.json(user);
    });

});


app.listen(port, () => {
    console.log('Server is running on port' + port);
})
