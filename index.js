const express = require('express');
const { adminAuth } = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuth);

app.use('/admin/allData', (req, res, next) => {
  res.send('All data sent');
});

app.listen(3000, () => {
  console.log('Server is up at port 3000');
});
