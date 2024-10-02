const adminAuth = (req, resp, next) => {
  const token = 'qw12rt45';

  const isAdminAuthOk = token === 'qw12rt45';

  console.log('Admin auth is in progress...');

  if (!isAdminAuthOk) {
    resp.status(401).send('Admin not authorized');
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
