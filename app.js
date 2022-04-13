const express = require('express');

const port = process.env.PORT || 3000;
const app = express();
const router = require('./routes/index')

app.use('/users', router);


app.listen(port, () => {
    console.log(`back end app is up and running on ${port}`);
}) 