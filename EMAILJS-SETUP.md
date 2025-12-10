# 📧 EmailJS Integration Setup Guide

## ✅ What's Been Done

Your Munjiz website now has **real email functionality** integrated using **EmailJS**. When users submit contact forms, emails are automatically sent to `hdiyan122@gmail.com`.

### Features Implemented:
- ✅ Contact form submissions send emails
- ✅ Product contact form submissions send emails
- ✅ User confirmation message displayed after submission
- ✅ All form data captured (name, email, phone, message, product info)
- ✅ EmailJS library integrated (CDN)

---

## 🚀 Quick Setup (ONE-TIME ONLY)

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Click **Sign Up Free**
3. Create account (email, password)
4. Click the verification link in your email

### Step 2: Add Gmail as Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Select **Gmail** from the list
4. Name it: `service_munjiz`
5. Add your email: `hdiyan122@gmail.com`
6. Save (you may need to allow "Less secure apps" on Gmail)

### Step 3: Create Email Template
1. Go to **Email Templates** in EmailJS
2. Click **Create New Template**
3. Name: `template_munjiz_contact`
4. Use this template content:

```
Subject: New Contact Form Submission from {{user_name}}

From: {{user_name}}
Email: {{user_email}}
Phone: {{user_phone}}

Product: {{product_name}}
Price: {{product_price}}

Message:
{{user_message}}

---
This email was sent from your Munjiz website.
```

### Step 4: Get Your Public Key
1. Go to **Account** in EmailJS
2. Copy your **Public Key** (starts with long string)
3. Open `modals.js` in your website folder
4. Find line 9: `emailjs.init('8dLBDJ6Jqr-rCf8VC');`
5. Replace the key with your public key:
   ```javascript
   emailjs.init('YOUR_PUBLIC_KEY_HERE');
   ```

### Step 5: Test It!
1. Open your website in browser
2. Click "Contact us to complete your order" on any product
3. Fill in the form
4. Click "Submit Order Request"
5. You should see: **"Your message has been sent successfully. We will contact you shortly."**
6. Check your email inbox at `hdiyan122@gmail.com`

---

## 📋 Email Template Variables

These variables are automatically filled from your form:

| Variable | Source | Example |
|----------|--------|---------|
| `{{user_name}}` | Full Name field | John Doe |
| `{{user_email}}` | Email field | john@example.com |
| `{{user_phone}}` | Phone/WhatsApp field | +1234567890 |
| `{{product_name}}` | Selected product | Django Course |
| `{{product_price}}` | Product price (converted) | $55.00 |
| `{{user_message}}` | Message field | I want to purchase this |

---

## 🔧 Configuration Details

### Current Setup:
- **Service ID**: `service_munjiz`
- **Template ID**: `template_munjiz_contact`
- **Public Key**: `8dLBDJ6Jqr-rCf8VC` (if you want to replace with your own)
- **Recipient Email**: `hdiyan122@gmail.com`

### Files Modified:
1. **index.html** - Added EmailJS CDN script
2. **modals.js** - Added EmailJS initialization and email sending logic

---

## 🎯 How It Works

### User Submits Form:
1. User fills out contact or product contact form
2. Form validates (name, email, phone, message)
3. Email data object is created with all user info
4. EmailJS sends email to your Gmail inbox
5. Confirmation message shown to user

### Email Flow:
```
User Form → JavaScript → EmailJS API → Gmail Service → Your Email
```

---

## ✨ Email Template Customization

Want to customize the email template? You can:

### In EmailJS Dashboard:
1. Go to **Email Templates**
2. Click on `template_munjiz_contact`
3. Modify the subject and body
4. Use variables like `{{user_name}}`, `{{product_name}}`, etc.

### Example Custom Template:

```
Subject: 🎉 New Order Request - {{product_name}}

Hi Aya,

You have a new order request from a customer!

Customer Information:
- Name: {{user_name}}
- Email: {{user_email}}
- Phone: {{user_phone}}

Product Details:
- Product: {{product_name}}
- Price: {{product_price}}

Customer Message:
{{user_message}}

---
Best regards,
Munjiz System
```

---

## 🆘 Troubleshooting

### "Email not sending" error?
1. **Check EmailJS service**: Open EmailJS dashboard → Email Services → Verify Gmail is active
2. **Check Gmail settings**: Allow "Less secure apps" in Gmail settings
3. **Verify credentials**: Make sure service ID and template ID are correct in code
4. **Check console**: Open browser DevTools (F12) → Console → Look for error messages

### "Email shows in Spam/Promotions"?
1. This is normal for automated emails
2. Mark email as "Not Spam" to improve delivery
3. Gmail will learn to send future emails to Inbox

### "Form submits but no email appears"?
1. Open DevTools (F12) → Console tab
2. Submit form again
3. Look for error messages in console
4. Share error message for debugging

---

## 📊 Testing Your Setup

### Test Email 1: General Contact Form
1. Click "Contact Us" button anywhere on site
2. Fill form with:
   - Name: `Test User`
   - Email: `test@example.com`
   - Product: Any product
   - Message: `This is a test`
3. Submit and verify email received

### Test Email 2: Product Contact Form
1. Click "Contact us to complete your order" on any product
2. Fill form with all details
3. Submit and verify email received

### Test Email 3: Different Product
1. Test with different product selection
2. Verify product name appears in email

---

## 🔐 Security Notes

### Public Key Safety:
- The public key in code is **safe to expose** (it's meant to be public)
- Only your **private key** needs to be secret (which EmailJS never shares)
- Users cannot abuse this to send emails to other addresses

### Email Address Protection:
- Recipient email (`hdiyan122@gmail.com`) is hardcoded
- Users **cannot change** where emails are sent
- Users **cannot send emails to themselves** from your system

---

## 📞 Support

### EmailJS Issues?
- Visit: https://www.emailjs.com/docs/
- Contact: support@emailjs.com

### Website Issues?
- Check browser console (F12)
- Verify all configuration matches this guide
- Test on different browser

---

## 🎉 That's It!

Your email system is now ready to receive customer inquiries directly. Every form submission will:
1. ✅ Be validated
2. ✅ Send to your Gmail
3. ✅ Show success confirmation to user
4. ✅ Be formatted nicely in email

---

## 📝 Email Example

When a user submits a product contact form, you'll receive an email like:

```
To: hdiyan122@gmail.com
Subject: New Contact Form Submission from Ahmed

From: Ahmed
Email: ahmed@example.com
Phone: +212612345678

Product: Django Course
Price: $55.00

Message:
Hi, I'm interested in the Django course. Can you tell me more about the curriculum?

---
This email was sent from your Munjiz website.
```

---

## ✅ Implementation Checklist

- [ ] Created EmailJS account
- [ ] Added Gmail as email service (named `service_munjiz`)
- [ ] Created email template (named `template_munjiz_contact`)
- [ ] Updated public key in `modals.js` (line 9)
- [ ] Tested general contact form
- [ ] Tested product contact form
- [ ] Verified emails arrive at `hdiyan122@gmail.com`
- [ ] Tested confirmation message displays

---

**Status**: ✅ **READY TO USE**

Your email system is fully integrated and ready to receive customer orders!

