const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

const mime = require('mime-types');
mime.types['css'] = 'text/css';


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'no-reply@findacofounder.online',
    pass: 'r%gzp9pS', // your Zoho Mail password
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'contact.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'terms.html'));
});
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'privacy.html'));
});

app.post('/submit-form', async (req, res) => {
  console.log(req.body)
  const { name, email, message } = req.body;
  console.log(name, email, message)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const mailOptions = {
    from: 'no-reply@findacofounder.online',
    to: 'support@findacofounder.online',
    subject: 'New Form Submission',
    text: `From: ${name} <${email}>\n\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Thank You! 😁  We will respond within 48 hours!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send the email' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
