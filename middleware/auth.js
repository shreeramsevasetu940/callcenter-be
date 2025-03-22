var jwt = require('jsonwebtoken');
const Admin = require('../models/admin')
const Staff = require('../models/staff')

const verify = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['auth-token'];
  if (!token) {
    return res.status(500).json({ success: false, Message: 'A token required for authentication' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const id = req.user.id
    const checkuser = await Staff.findById(id)
    if (checkuser) {
      return next();
    } else {
      return res.status(500).json({ success: false, Message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, Message: 'Invalid token' });
  }
};

 function authorize(...role) {
   return async(req, res, next) => {
    const check_admin = await Admin.findOne({ user: req.user.id })
    // catch & match the user role
    let userRole;
    if(check_admin){
      userRole = "admin";
    }else{
      userRole = "user";
    }
    // revoke access based on role
    if (!role.includes(userRole)) {
      return res.status(403).json({
        acknowledgement: false,
        message: "Forbidden",
        description: "You're not applicable to access this page and features",
      });
    }

    next();
  };
}



module.exports = { verify: verify, authorize: authorize };
