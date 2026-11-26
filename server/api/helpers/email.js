
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailService = {
  credentials: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'fastfoodfast0@gmail.com',
      pass: process.env.PASS,
    },
  },
};

emailService.transporter = nodemailer.createTransport(emailService.credentials);

export default emailService;
