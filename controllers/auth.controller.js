import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "PersonalPr$ject";
import User from '../models/auth.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import StaticId from '../models/staticId.js';
// const User = require('../models/auth');

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: "ayushjain201574@gmail.com",
    pass: "kstp hncn yljw pbvk",
  },
});

const otps = new Map();

const auth = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  console.log(user,"defl")
  // Check whether the user with the same email exists already
  // try {
  if (!user) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresIn = Date.now() + 60000; // OTP expires in 5 minutes

    otps.set(email, { otp, expiresIn });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send("Error sending email");
      }

      res.status(200).send({ isNewUser: true });
    });
  }else{

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return res
      .status(400)
      .json({ error: "Please try to login with correct credentials" });
  }

  const data = {
    user: {
      id: user._id,
    },
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
  res.json(authtoken);
}

  // Catch errors
  // } catch (error) {
  //     console.error(error.message);
  //     res.status(500).send("Internal Server Error");
  // }
};

const verifyOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required");
  }

  const storedOtp = otps.get(email);

  if (!storedOtp) {
    return res.status(400).send("OTP not found or expired");
  }

  const { otp: validOtp, expiresIn } = storedOtp;

  if (Date.now() > expiresIn) {
    otps.delete(email);
    return res.status(400).send("OTP expired");
  }

  if (otp !== validOtp) {
    return res.status(400).send("Invalid OTP");
  }

  otps.delete(email);
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  const lastCreatedParentId = await StaticId.find({}).limit(1).exec();

  const newParentId = String(parseInt(lastCreatedParentId[0].parentId) + 1);

  await StaticId.findOneAndUpdate({}, { parentId: newParentId });

  // Create a new user
  let userDetails = {
    email,
    password: secPass,
    parentId: newParentId
  };

  let userCreate = await User.create(userDetails);
  const data = {
    user: {
      id: userCreate._id,
    },
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
  // console.log(jwtData);
  res.json(authtoken);
  // userCreate.save();
  res.status(200).send("OTP verified");
};

const resendOtp = (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresIn = Date.now() + 60000; // OTP expires in 5 minutes

  otps.set(email, { otp, expiresIn });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email");
    }
    res.status(200).send("OTP sent");
  });
};

export default { auth, verifyOtp, resendOtp };