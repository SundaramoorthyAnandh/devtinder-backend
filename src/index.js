const express = require('express');
const { adminAuth } = require('../middlewares/auth');

const app = express();

app.use('/admin', adminAuth);

app.get('/admin/allData', (req, resp) => {
  resp.send('Sent all data');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
