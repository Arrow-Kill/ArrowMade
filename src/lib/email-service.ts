import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Email configuration
const EMAIL_CONFIG = {
  email: process.env.NEXT_PUBLIC_EMAIL,
  password: process.env.NEXT_PUBLIC_PASS,
  isDevelopment: process.env.NODE_ENV !== 'production'
};

// Create transporter for sending emails
const createTransporter = () => {
  if (!EMAIL_CONFIG.email || !EMAIL_CONFIG.password) {
    console.error('Email credentials not found. Please set NEXT_PUBLIC_EMAIL and NEXT_PUBLIC_PASS in your environment variables.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other email services
    auth: {
      user: EMAIL_CONFIG.email,
      pass: EMAIL_CONFIG.password
    }
  });
};

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  return `${baseUrl}/auth/verify-email?token=${token}`;
}

export function createPasswordResetUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  return `${baseUrl}/auth/reset-password?token=${token}`;
}

interface SendVerificationEmailOptions {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({ 
  to, 
  name, 
  verificationUrl 
}: SendVerificationEmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Fallback to console logging if no email credentials
      console.log('📧 Verification Email (No Email Credentials - Development Mode)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${to}`);
      console.log(`Subject: Verify your VisionChat AI account`);
      console.log(`Name: ${name}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return true;
    }

    const mailOptions = {
      from: `"VisionChat AI" <${EMAIL_CONFIG.email}>`,
      to: to,
      subject: 'Verify your VisionChat AI account',
      html: generateVerificationEmailHTML(name, verificationUrl),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // Fallback to console logging in development
    if (EMAIL_CONFIG.isDevelopment) {
      console.log('📧 Verification Email (Fallback - Development Mode)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${to}`);
      console.log(`Subject: Verify your VisionChat AI account`);
      console.log(`Name: ${name}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return true;
    }
    
    return false;
  }
}

function generateVerificationEmailHTML(name: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Verify your email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">VisionChat AI</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hi ${name},</h2>
        
        <p style="margin-bottom: 30px;">
          Thank you for signing up for VisionChat AI! Please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold;
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #6c757d; font-size: 14px;">
          This link will expire in 24 hours. If you did not create an account, please ignore this email.
        </p>
        
        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${verificationUrl}</span>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>© 2024 VisionChat AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

interface SendPasswordResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({ 
  to, 
  name, 
  resetUrl 
}: SendPasswordResetEmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Fallback to console logging if no email credentials
      console.log('📧 Password Reset Email (No Email Credentials - Development Mode)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${to}`);
      console.log(`Subject: Reset your VisionChat AI password`);
      console.log(`Name: ${name}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return true;
    }

    const mailOptions = {
      from: `"VisionChat AI" <${EMAIL_CONFIG.email}>`,
      to: to,
      subject: 'Reset your VisionChat AI password',
      html: generatePasswordResetEmailHTML(name, resetUrl),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    
    // Fallback to console logging in development
    if (EMAIL_CONFIG.isDevelopment) {
      console.log('📧 Password Reset Email (Fallback - Development Mode)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${to}`);
      console.log(`Subject: Reset your VisionChat AI password`);
      console.log(`Name: ${name}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return true;
    }
    
    return false;
  }
}

function generatePasswordResetEmailHTML(name: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Reset your password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">VisionChat AI</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #495057; margin-top: 0;">Hi ${name},</h2>
        
        <p style="margin-bottom: 30px;">
          We received a request to reset your VisionChat AI password. Please click the button below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold;
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #6c757d; font-size: 14px;">
          This link will expire in 24 hours. If you did not request a password reset, please ignore this email.
        </p>
        
        <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break: break-all;">${resetUrl}</span>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
        <p>© 2024 VisionChat AI. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
} 