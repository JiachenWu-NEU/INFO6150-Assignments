function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Server error' });
}

module.exports = { notFound, errorHandler };