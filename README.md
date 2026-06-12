# Sustle Solutions Website — Setup & Deployment Guide

## 📁 Project Structure
```
sustle-website/
├── index.html       ← Main website
├── styles.css       ← All styles
├── app.js           ← Interactivity + AI Chatbot
├── images/          ← All your photos (already included)
└── README.md        ← This file
```

---

## 🖥️ Step 1: Open in VS Code (Mac)

1. Unzip the downloaded folder (sustle-website.zip)
2. Open **VS Code**
3. Go to **File → Open Folder** → select `sustle-website`
4. Install the extension **Live Server** (by Ritwick Dey) from the Extensions panel (Ctrl+Shift+X)
5. Right-click `index.html` → **Open with Live Server**
6. Your site opens at `http://127.0.0.1:5500`

---

## 🤖 Step 2: Enable the AI Chatbot

The chatbot uses the Anthropic API. To activate it:

1. Get your API key from https://console.anthropic.com
2. Open `app.js` in VS Code
3. In the `fetch()` call inside `getBotResponse()`, add your key to the headers:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE',   // ← Add this line
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true'
},
```

> ⚠️ **Important for Production**: Never expose your API key in frontend code for a public site. For AWS hosting, use a backend proxy (Lambda function or API Gateway) to keep your key secure. See Step 5 for the secure setup.

---

## 🚀 Step 3: Deploy to GitHub Pages (Testing)

1. Create a free account at https://github.com if you don't have one

2. Create a new repository:
   - Go to github.com → click **+** → **New repository**
   - Name it: `sustle-website`
   - Set to **Public**
   - Click **Create repository**

3. In VS Code, open Terminal (**Terminal → New Terminal**) and run:

```bash
cd /path/to/sustle-website

# Initialize git
git init
git add .
git commit -m "Initial Sustle website"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/sustle-website.git
git branch -M main
git push -u origin main
```

4. Enable GitHub Pages:
   - Go to your repo on GitHub
   - **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / root
   - Click **Save**

5. Your site will be live at:  
   `https://YOUR_USERNAME.github.io/sustle-website`

---

## ☁️ Step 4: Production Hosting on AWS

### Option A — AWS Amplify (Easiest, Recommended)
1. Go to https://aws.amazon.com/amplify/
2. Click **New App → Host Web App**
3. Connect your GitHub repository
4. Amplify auto-deploys on every git push
5. Add a custom domain (sustle.co.in) in Amplify settings

### Option B — S3 + CloudFront (Most control)
1. Create an S3 bucket named `sustle.co.in`
2. Enable **Static website hosting** in bucket properties
3. Upload all files from `sustle-website/`
4. Create a CloudFront distribution pointing to the S3 bucket
5. Point your domain DNS to the CloudFront URL

---

## 🔒 Step 5: Secure AI Chatbot for Production (AWS Lambda)

Create a simple Lambda proxy so your API key stays server-side:

```javascript
// Lambda function (Node.js 18)
const https = require('https');

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,  // stored in Lambda env vars
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': 'https://www.sustle.co.in' },
    body: JSON.stringify(data)
  };
};
```

Then in `app.js`, change the fetch URL to your Lambda API Gateway endpoint:
```javascript
const response = await fetch('https://YOUR_API_GATEWAY_URL/chat', { ... });
```

---

## 📞 Contact Info in the Website
- **Projects**: projects@sustle.co.in  
- **Careers**: pankaj@sustle.co.in  
- **Phone**: +91-7776837700  
- **Website**: www.sustle.co.in

---

## 🛠️ Customization Tips

| What to change | Where |
|---|---|
| Company logo | Replace `images/logo.png` |
| Colors (green/gold) | Edit `--primary` and `--accent` variables in `styles.css` |
| Contact form destination | Connect Formspree (free) or AWS SES |
| Add client logos | Add an `<img>` section in the "Brands We Serve" area in `index.html` |
| LinkedIn URL | Search for `linkedin.com/company/sustle` in `index.html` |

---

*Built with HTML5, CSS3, Vanilla JS, Font Awesome 6, Google Fonts (Inter + Poppins), and Claude AI (Anthropic)*
