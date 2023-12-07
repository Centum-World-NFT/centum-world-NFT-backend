const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require('../models/adminModel')

exports.adminLogin = async(req,res) => {
    try {
        const { adminId, password } = req.body;
        if (!adminId || !password) {
          return res
            .status(422)
            .json({ message: "Please fill credentials to login" });
        }
        const adminLogin = await Admin.findOne({ adminId: adminId });
    
        //console.log(adminLogin);
        if (!adminLogin) {
          res.status(404).json({ message: "Invalid Credentials" });
        } else {
          if (password === adminLogin.password) {
            const token = jwt.sign(
              { adminId: adminLogin._id, role: "admin" },
              process.env.JWT_SECRET,
              { expiresIn: "8h" }
            );
            const adminId = adminLogin.adminId;
            // const referralId = adminLogin.referralId;
            res.status(201).json({
              message: "Admin Login Successfully",
              token: token,
              adminId,
              expires: new Date().getTime() + 60000,
            });
          } else {
            return res.status(404).json({ error: "Invalid Credentials" });
          }
        }
      } catch (error) {
        console.log(error);
      }
}