
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailService = {
  transporter: nodemailer.createTransport({
    url: 'smtps://smtp.gmail.com:465',
    auth: {
      user: 'fastfoodfast0@gmail.com',
      pass: process.env.PASS,
    },
  }),
};

export default emailService;
