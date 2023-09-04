import express from "express";
import User from "../Models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { isAuth, isAdmin, generateToken, baseUrl, mailgun } from '../utils.js';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'; 
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const userRouter = express.Router();
 userRouter.get(
   '/',
   isAuth,
   isAdmin,
   expressAsyncHandler(async (req, res) => {
     const users = await User.find({});
     res.send(users);
   })
 );

 userRouter.get(
   '/:id',
   isAuth,
   isAdmin,
   expressAsyncHandler(async (req, res) => {
     const user = await User.findById(req.params.id);
     if (user) {
       res.send(user);
     } else {
       res.status(404).send({ message: 'User Not Found' });
     }
   })
 );
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);
//FORGET PASSWORD USING MAILGUN
// userRouter.post(
//   '/forget-password',
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });

//     if (user) {
//       const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '3h',
//       });
//       user.resetToken = token;
//       await user.save();

//       //reset link
//       console.log(`${baseUrl()}/reset-password/${token}`);

//       mailgun()
//         .messages()
//         .send(
//           {
//             from: 'OnlineBookstore <me@mg.yourdomain.com>',
//             to: `${user.name} <${user.email}>`,
//             subject: `Reset Password`,
//             html: ` 
//              <p>Please Click the following link to reset your password:</p> 
//              <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
//              `,
//           },
//           (error, body) => {
//             console.log("error",error);
//             console.log("body",body);
//           }
//         );
//       res.send({ message: 'We sent reset password link to your email.' });
//     } else {
//       res.status(404).send({ message: 'User not found' });
//     }
//   })
// );

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Simulated storage for verification codes
const verificationCodes = new Map();

// Generate a random verification code
function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

userRouter.post(
  '/request-code',
  expressAsyncHandler(async (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Store the verification code
    verificationCodes.set(phoneNumber, verificationCode);
    console.log(verificationCodes);

    // Send the verification code via SMS
    try {
      await twilio(accountSid, authToken).messages.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your verification code: ${verificationCode}`,
      });
      res.send({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send verification code' });
    }
  })
);

userRouter.post(
  '/reset-password-code',
  expressAsyncHandler(async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const enteredCode = req.body.enteredCode;
    const newPassword = req.body.newPassword;

    try {
      // Check if verification code matches
      const storedCode = verificationCodes.get(phoneNumber);
      console.log('Stored Code:', storedCode);

      if (storedCode && storedCode == enteredCode) {
        // Update the password for the user associated with the phone number
        // You would typically use a database and proper user identification here
        const user = await User.findOne({ phoneNumber });
console.log(user)
        if (user) {
          // Set the new password and save the user
          user.password = bcrypt.hashSync(newPassword, 8); // Hash the new password
          await user.save();
          // Clear the verification code after successful reset
          verificationCodes.delete(phoneNumber);

          res.send({ message: 'Password reset successful' });
        } else {
          res.status(400).send({ error: 'User not found' });
        }
      } else {
        res.status(400).send({ error: 'Invalid verification code' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: 'An error occurred while processing the request' });
    }
  })
);



//FORGET PASSWORD USING NODEMAILER
userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      user.resetToken = token;
      await user.save();

      //reset link
      console.log(`${baseUrl()}/reset-password/${token}`);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'lynnhourieh30@gmail.com',
          pass: 'sdrdbltmshcosfgr',
        },
      });
      var mailOptions = {
        from: 'OnlineBookstore <me@mg.yourdomain.com>',
        to: `${user.name} <${user.email}>`,
        subject: `Reset Password`,
        html: `
          <p>Please Click the following link to reset your password:</p>
          <a href="${baseUrl()}/reset-password/${token}">Reset Password</a>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send({ message: 'We sent the reset password link to your email.' });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.send({
              message: 'Password reseted successfully',
            });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
//super admin lynngourieh30@gmail.com
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'lynnhourieh30@gmail.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await User.findByIdAndDelete(req.params.id); // Use User model here
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

//expressAsyncHandler is to catch the error while signin
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    console.log("user",user)
    if (user) {
        //check if password is correct
        // bycrpt password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    console.log(res)
    res.status(401).send({ message: "Invalid email or password" });
  })
);
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
   const newUser =new User({
    name:req.body.name,
    email:req.body.email,
    password:bcrypt.hashSync(req.body.password)
   });
   //save new user to database
   const user =await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);


export default userRouter;