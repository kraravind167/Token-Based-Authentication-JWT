const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
const app = express();

const user = require('./routes/user.route');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/jwttokenauth',{useNewUrlParser:true});

app.get('/checking', (req, res) => {
    res.json({
       "Message": "Function works"
    });
});

app.use('/user',user);

app.listen(port, () => {
    console.log('Server is running on port' + port);
})