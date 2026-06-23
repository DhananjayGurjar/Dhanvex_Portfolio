const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// ─── Initialize Supabase ───────────────────────────────────────────────────────
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ─── Initialize Express ────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── Gmail Transporter (Nodemailer) ─────────────────────────────────────────────
let transporter = null;

if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD !== 'PASTE_YOUR_16_CHAR_APP_PASSWORD_HERE') {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Verify SMTP connection on startup
  transporter.verify()
    .then(() => console.log('✅ Gmail SMTP connected successfully.'))
    .catch((err) => {
      console.error('❌ Gmail SMTP connection failed:', err.message);
      console.error('   → Make sure GMAIL_APP_PASSWORD in .env is a valid Google App Password.');
      transporter = null;
    });
} else {
  console.warn('⚠️  Gmail credentials not configured. Emails will be skipped.');
  console.warn('   → Set GMAIL_APP_PASSWORD in .env to enable email sending.');
}

// ─── Email Templates ────────────────────────────────────────────────────────────

function buildThankYouEmail(name, projectType) {
  return {
    subject: `Thanks for reaching out, ${name}! — Dhananjay Gurjar`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#0C0C0C; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0C0C0C; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#191919 0%,#0f0f0f 100%); border:1px solid rgba(255,255,255,0.05); border-radius:16px; overflow:hidden;">
        
        <!-- Header -->
        <tr><td style="padding:40px 40px 20px; text-align:center;">
          <h1 style="margin:0; font-size:28px; font-weight:800; color:#fcfdff; letter-spacing:-0.5px;">DHANANJAY GURJAR</h1>
          <div style="width:60px; height:3px; background:linear-gradient(135deg,#B600A8,#7621B0); margin:12px auto 0; border-radius:2px;"></div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:20px 40px 30px;">
          <p style="color:#e4e2e2; font-size:16px; line-height:1.6; margin:0 0 16px;">
            Hi <strong style="color:#ffaceb;">${name}</strong>,
          </p>
          <p style="color:#c4c7ca; font-size:14px; line-height:1.7; margin:0 0 16px;">
            Thank you for expressing interest in a <strong style="color:#fcfdff;">${projectType}</strong> project! I've received your proposal and I'm excited to learn more about your vision.
          </p>
          <p style="color:#c4c7ca; font-size:14px; line-height:1.7; margin:0 0 24px;">
            I'll review the details and get back to you within <strong style="color:#fcfdff;">24 hours</strong> to discuss next steps, scope, and timelines.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:linear-gradient(135deg,#18011F 0%,#B600A8 33%,#7621B0 66%,#BE4C00 100%); border-radius:50px; padding:14px 32px; text-align:center;">
              <a href="mailto:dhananjaygurjar20@gmail.com" style="color:#ffffff; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">REPLY DIRECTLY</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px 30px; border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:#8d9194; font-size:11px; text-align:center; margin:0; line-height:1.6;">
            Dhananjay Gurjar · B.Tech Student · Indore, India<br>
            <a href="mailto:dhananjaygurjar20@gmail.com" style="color:#ffaceb; text-decoration:none;">dhananjaygurjar20@gmail.com</a> · 
            <a href="tel:+919302277981" style="color:#ffaceb; text-decoration:none;">+91 93022 77981</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

function buildNotificationEmail(data) {
  const { name, email, company, project_type, budget, timeline, brief } = data;
  return {
    subject: `🚀 New Project Request — ${name} | ${project_type}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f8f9fa; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa; padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#18011F 0%,#B600A8 50%,#7621B0 100%); padding:28px 40px; text-align:center;">
          <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:2px; text-transform:uppercase;">New Project Request</h1>
        </td></tr>

        <!-- Details Table -->
        <tr><td style="padding:30px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px; width:140px;">Name</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px; font-weight:500;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Email</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px;"><a href="mailto:${email}" style="color:#7621B0; text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Company</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px;">${company || '—'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Project Type</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px; font-weight:600;">${project_type}</td>
            </tr>
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Budget</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px; font-weight:600;">${budget}</td>
            </tr>
            <tr>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Timeline</td>
              <td style="padding:12px 0; border-bottom:1px solid #f0f0f0; color:#111827; font-size:14px;">${timeline}</td>
            </tr>
            <tr>
              <td style="padding:12px 0; color:#6b7280; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1px; vertical-align:top;">Brief</td>
              <td style="padding:12px 0; color:#111827; font-size:14px; line-height:1.6;">${brief}</td>
            </tr>
          </table>
        </td></tr>

        <!-- Quick Action -->
        <tr><td style="padding:0 40px 30px; text-align:center;">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:#7621B0; border-radius:8px; padding:12px 28px;">
              <a href="mailto:${email}?subject=Re: Your ${project_type} Project Proposal&body=Hi ${name},%0A%0AThanks for your proposal! " style="color:#ffffff; text-decoration:none; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">REPLY TO ${name.toUpperCase()}</a>
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

// ─── Helper: Send Emails ────────────────────────────────────────────────────────

async function sendEmails(proposalData) {
  if (!transporter) {
    console.warn('⚠️  Skipping emails — Gmail not configured.');
    return { sent: false, reason: 'Gmail not configured' };
  }

  const results = { thankYou: false, notification: false };

  // 1. Thank-you email to the visitor
  try {
    const thankYou = buildThankYouEmail(proposalData.name, proposalData.project_type);
    await transporter.sendMail({
      from: `"Dhananjay Gurjar" <${process.env.GMAIL_USER}>`,
      to: proposalData.email,
      subject: thankYou.subject,
      html: thankYou.html,
    });
    results.thankYou = true;
    console.log(`📧 Thank-you email sent to ${proposalData.email}`);
  } catch (err) {
    console.error('❌ Failed to send thank-you email:', err.message);
  }

  // 2. Notification email to Dhananjay
  try {
    const notification = buildNotificationEmail(proposalData);
    await transporter.sendMail({
      from: `"Portfolio Bot" <${process.env.GMAIL_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: notification.subject,
      html: notification.html,
    });
    results.notification = true;
    console.log(`📧 Notification email sent to ${process.env.NOTIFY_EMAIL}`);
  } catch (err) {
    console.error('❌ Failed to send notification email:', err.message);
  }

  return { sent: true, results };
}

// ─── Routes ─────────────────────────────────────────────────────────────────────

// Serve portfolio as root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'review.html'));
});

// Submit project proposal
app.post('/api/submit-proposal', async (req, res) => {
  try {
    const { name, email, company, project_type, budget, timeline, brief } = req.body;

    // Validate required fields
    if (!name || !email || !project_type || !budget || !timeline || !brief) {
      return res.status(400).json({
        error: 'Missing required fields. Please fill in all required fields.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email address format.',
      });
    }

    // Step 1: Insert into Supabase
    const { data, error } = await supabase
      .from('project_requests')
      .insert([
        {
          name,
          email,
          company: company || null,
          project_type,
          budget,
          timeline,
          brief,
        },
      ])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({
        error: 'Failed to save your proposal. Please try again or contact directly.',
      });
    }

    console.log(`✅ Proposal saved from ${name} (${email})`);

    // Step 2: Send emails (non-blocking — data is already safe in DB)
    const emailResult = await sendEmails({ name, email, company, project_type, budget, timeline, brief });

    return res.json({
      success: true,
      message: 'Proposal submitted successfully!',
      emailSent: emailResult.sent,
      data,
    });
  } catch (err) {
    console.error('❌ Internal server error:', err);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
});

// ─── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: !!process.env.SUPABASE_URL,
    email: !!transporter,
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🚀 Portfolio Backend v2.0                 ║');
  console.log(`║   Running on port ${PORT}                    ║`);
  console.log('║                                              ║');
  console.log(`║   Supabase:  ${process.env.SUPABASE_URL ? '✅ Connected' : '❌ Not configured'}               ║`);
  console.log(`║   Email:     ${transporter ? '✅ Gmail ready' : '⚠️  Not configured'}              ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});
