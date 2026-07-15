const validatePasscode = (req, res, next) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ success: false, message: 'Passcode is required' });
  }
  if (typeof passcode !== 'string' || passcode.length !== 6 || !/^\d{6}$/.test(passcode)) {
    return res.status(400).json({ success: false, message: 'Passcode must be a 6-digit number' });
  }
  next();
};

module.exports = validatePasscode;
