# 🔑 Critical: EmailJS Template Setup

## ⚠️ IMPORTANT: This MUST Be Done For Emails to Work!

Your contact forms will NOT send emails until you create this template in EmailJS.

---

## 🎯 Quick Setup (2 minutes)

### Step 1: Go to EmailJS Website
- Visit: https://www.emailjs.com/
- Login to your account
- Look for **"Email Templates"** in the left menu

### Step 2: Create New Template
1. Click **"Create New Template"**
2. Name it: `template_fhe6wgg` (IMPORTANT: Exact name!)
3. Copy the template below and paste into the template editor:

```
Subject: 🎉 New Order Request - {{product_name}} from {{user_name}}

Dear Website Owner,

You have received a new inquiry through Munjiz!

📋 CUSTOMER DETAILS:
├─ Name: {{user_name}}
├─ Email: {{user_email}}
├─ Phone: {{user_phone}}
└─ Product Interested: {{product_name}}

💬 MESSAGE:
{{user_message}}

---

📧 Reply To: {{user_email}}
🔗 Service: Munjiz Website Contact Form
⏰ Time: {{$date}}

---
Thank you for using Munjiz!
```

### Step 3: Save & Verify
1. Click **"Save"**
2. Confirm the template ID shows: `template_fhe6wgg`
3. Done! ✅

---

## 📝 Template Variables Explanation

| Variable | What It Is | Example |
|----------|-----------|---------|
| `{{user_name}}` | Customer's full name | Ahmed Mohammed |
| `{{user_email}}` | Customer's email | ahmed@example.com |
| `{{user_phone}}` | Customer's phone (optional) | +212612345678 |
| `{{product_name}}` | Product they want | Django Course |
| `{{user_message}}` | Their message/questions | I'd like more info |

---

## ✅ Your Configuration

These are your exact EmailJS credentials (already configured):

```
Public Key:  FpbbU5jLTD80qCWLz
Service ID:  service_hjaklhd
Template ID: template_fhe6wgg (← You must create this!)
Email To:    hdiyan122@gmail.com (automatic)
```

---

## 🧪 After Creating Template

### Test It Immediately:
1. **Open** your website
2. **Scroll** to "Get In Touch" section
3. **Fill** the form:
   ```
   Name:    Test User
   Email:   your-email@example.com
   Message: This is a test
   ```
4. **Click** "Send Message"
5. **Check** your email inbox
6. **You should receive** the test email

---

## 📧 What You'll Receive

When customers submit the form, you'll get emails like:

```
To: hdiyan122@gmail.com
Subject: 🎉 New Order Request - Django Course from Ahmed Mohammed

Dear Website Owner,

You have received a new inquiry through Munjiz!

📋 CUSTOMER DETAILS:
├─ Name: Ahmed Mohammed
├─ Email: ahmed@example.com
├─ Phone: +212612345678
└─ Product Interested: Django Course

💬 MESSAGE:
Hi, I'm interested in the Django course. Can you tell me the delivery method?

---

📧 Reply To: ahmed@example.com
🔗 Service: Munjiz Website Contact Form

---
Thank you for using Munjiz!
```

---

## ⚡ Quick Checklist

- [ ] I visited https://www.emailjs.com/
- [ ] I logged into my EmailJS account
- [ ] I went to Email Templates
- [ ] I clicked "Create New Template"
- [ ] I named it `template_fhe6wgg`
- [ ] I pasted the template code above
- [ ] I clicked "Save"
- [ ] Template ID shows `template_fhe6wgg` ✅

---

## 🆘 If You Don't See It Working

### Common Issues:

**1. "Email not arriving in inbox"**
   - Check SPAM folder first
   - Verify template was created
   - Check template ID is exactly: `template_fhe6wgg`

**2. "Template not saving"**
   - Make sure you're logged in
   - Clear browser cache (Ctrl+Shift+Delete)
   - Try different browser

**3. "Can't find Email Templates"**
   - You might be in wrong section
   - Look for "Email Templates" in left sidebar
   - Not the same as "Forms"

---

## 🔍 Verify Your Setup

After creating the template, verify:

1. **Template ID**: Exactly `template_fhe6wgg` ✅
2. **Service ID**: `service_hjaklhd` (already exists) ✅
3. **Public Key**: `FpbbU5jLTD80qCWLz` (already exists) ✅
4. **Recipient**: `hdiyan122@gmail.com` ✅

---

## 💡 Pro Tips

### Email Subject Line
The subject line will show:
```
🎉 New Order Request - [Product Name] from [Customer Name]
```

This makes it easy to spot customer inquiries in your inbox!

### Email Format
The template uses:
- Clear sections with emojis
- Easy-to-read formatting
- Automatic customer email for reply
- Professional appearance

### Customization
You can edit the template anytime:
1. Go to Email Templates
2. Click on `template_fhe6wgg`
3. Make changes
4. Save

---

## 🚀 After Setup

Once template is created:
1. ✅ Contact forms work immediately
2. ✅ Emails go to hdiyan122@gmail.com
3. ✅ You receive customer inquiries
4. ✅ Can reply directly to customers
5. ✅ Everything is automatic

---

## 📞 Still Need Help?

### EmailJS Support:
- Website: https://www.emailjs.com/
- Docs: https://www.emailjs.com/docs/
- Email: support@emailjs.com

### Website Issues:
- Check browser console (F12)
- Verify template exists in EmailJS
- Refresh page and try again

---

## ✨ That's It!

Just create the template with the code above and emails will work perfectly! 

No other setup needed - everything else is already configured.

**Template Name**: `template_fhe6wgg` ← This is the key!

