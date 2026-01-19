# =====================================================
# 🚀 CLOUDFLARE WORKER SETUP GUIDE
# =====================================================
# 
# Complete step-by-step instructions to deploy your
# contact form API on CloudFlare Workers (100% FREE)
#
# =====================================================

## 📋 What You'll Get

✅ 100,000 requests per DAY (free forever)
✅ Ultra-fast global edge network
✅ Free email sending via MailChannels
✅ No credit card required
✅ Automatic HTTPS
✅ No server maintenance

---

## 🔐 SECURITY FIRST - Important!

### Files that should NEVER be pushed to GitHub:
- `wrangler.toml` (contains account info)
- Any file with API keys or passwords
- `.env` files

### Already Protected:
- All secrets are stored in CloudFlare Dashboard (not in code)
- The worker.js file contains NO sensitive data
- Email addresses are configured via environment variables

---

## 📝 STEP-BY-STEP SETUP

### Step 1: Create CloudFlare Account (2 minutes)

1. Go to: https://dash.cloudflare.com/sign-up
2. Enter your email and create password
3. Verify your email address
4. You're in! No credit card needed.

---

### Step 2: Access Workers Dashboard (1 minute)

1. Log into CloudFlare Dashboard
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create Application"**
4. Select **"Create Worker"**

---

### Step 3: Create Your Worker (5 minutes)

1. Give your worker a name: `supernova-contact-form`
   - Your API URL will be: `https://supernova-contact-form.YOUR_SUBDOMAIN.workers.dev`

2. Click **"Deploy"** (creates empty worker)

3. Click **"Edit Code"** (opens editor)

4. **Delete ALL the default code**

5. **Copy the ENTIRE contents of `worker.js`** from:
   `cloudflare-worker/worker.js`

6. **Paste into the CloudFlare editor**

7. Click **"Save and Deploy"** (top right)

---

### Step 4: Configure Environment Variables (3 minutes)

⚠️ **THIS IS CRITICAL FOR SECURITY**

1. Go back to your Worker's main page
2. Click **"Settings"** tab
3. Click **"Variables"** in the left menu
4. Under **"Environment Variables"**, click **"Add variable"**

Add these 3 variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `RECIPIENT_EMAIL_VAR` | `your-real-email@gmail.com` | Where you receive messages |
| `ALLOWED_ORIGIN_VAR` | `*` (or your domain) | Your website URL |
| `SENDER_EMAIL_VAR` | `noreply@yourdomain.com` | From address in emails |

5. Click **"Save and Deploy"**

**Example Values:**
```
RECIPIENT_EMAIL_VAR = john.doe@gmail.com
ALLOWED_ORIGIN_VAR = https://supernova-agency.com
SENDER_EMAIL_VAR = contact@supernova-agency.com
```

**For Testing (use these first):**
```
RECIPIENT_EMAIL_VAR = your-email@gmail.com
ALLOWED_ORIGIN_VAR = *
SENDER_EMAIL_VAR = noreply@test.com
```

---

### Step 5: Get Your Worker URL (1 minute)

1. Go to your Worker's main page
2. Look at the top - you'll see your URL:
   ```
   https://supernova-contact-form.YOUR_SUBDOMAIN.workers.dev
   ```
3. **Copy this URL** - you'll need it for the next step

---

### Step 6: Update Your Website JavaScript

1. Open `js/main.js` in your project

2. Find the line (around line 196):
   ```javascript
   const CONTACT_API_URL = 'YOUR_CLOUDFLARE_WORKER_URL_HERE';
   ```

3. Replace with your actual Worker URL:
   ```javascript
   const CONTACT_API_URL = 'https://supernova-contact-form.YOUR_SUBDOMAIN.workers.dev';
   ```

4. Save the file

---

### Step 7: Test Your Form 🧪

1. Open your website locally or on your server
2. Go to the Contact page
3. Fill out the form with test data
4. Click "Send Message"
5. Check your email inbox!

**Testing Checklist:**
- [ ] Form shows "Sending..." while processing
- [ ] Success message appears after submission
- [ ] You receive the email
- [ ] Email contains all form data
- [ ] Reply-to is set to sender's email

---

## 🔧 TROUBLESHOOTING

### "Failed to send email" Error

**Possible causes:**
1. Environment variables not set correctly
2. MailChannels domain verification needed (for custom domains)

**Solution:**
1. Check CloudFlare Dashboard > Workers > Settings > Variables
2. Make sure all 3 variables are set
3. Try with `ALLOWED_ORIGIN_VAR = *` first

### CORS Error in Browser Console

**Solution:**
1. Check `ALLOWED_ORIGIN_VAR` matches your website domain
2. For testing, set it to `*`
3. Include `https://` in the origin

### Not Receiving Emails

**Check:**
1. Look in spam/junk folder
2. Verify `RECIPIENT_EMAIL_VAR` is correct
3. Check CloudFlare Workers logs for errors

### How to View Worker Logs

1. Go to CloudFlare Dashboard
2. Workers & Pages > Your Worker
3. Click "Logs" tab
4. View real-time logs and errors

---

## 🚀 GOING TO PRODUCTION

### When Your Website Goes Live:

1. **Update ALLOWED_ORIGIN_VAR:**
   ```
   ALLOWED_ORIGIN_VAR = https://yourdomain.com
   ```

2. **Optional: Set up custom domain for API:**
   - Go to Workers > Your Worker > Triggers
   - Add a custom route like: `api.yourdomain.com/contact`

3. **Enable rate limiting (optional):**
   - CloudFlare Dashboard > Security > Rate Limiting

---

## 📊 MONITORING & ANALYTICS

### Free Analytics Included:

1. Go to Workers & Pages
2. Click your Worker
3. View metrics:
   - Total requests
   - Success/error rates
   - CPU time used
   - Geographic distribution

---

## 🔐 SECURITY CHECKLIST

Before going live, verify:

- [ ] No secrets in `worker.js` code
- [ ] `wrangler.toml` added to `.gitignore`
- [ ] Environment variables set in CloudFlare (not in code)
- [ ] `ALLOWED_ORIGIN_VAR` set to your domain (not `*`)
- [ ] Email addresses are valid
- [ ] Form has rate limiting enabled (already in your JS)
- [ ] Honeypot field is active (already in your form)

---

## 💡 TIPS

### Cost
- **FREE forever** for personal/small business use
- 100,000 requests/day is more than enough
- No hidden fees

### Performance
- Global edge network = ~50ms response time worldwide
- No cold starts (unlike Lambda/Vercel)
- 99.99% uptime

### Upgrading (if needed later)
- Workers Paid plan: $5/month for 10M requests
- But you probably won't need it!

---

## 📞 NEED HELP?

1. **CloudFlare Docs:** https://developers.cloudflare.com/workers/
2. **MailChannels Setup:** https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
3. **Community:** https://community.cloudflare.com/

---

## 🎉 YOU'RE DONE!

Once set up, your contact form will:
1. ✅ Send you real emails
2. ✅ Work globally with fast response times
3. ✅ Handle 100k+ submissions per day
4. ✅ Cost you $0

**Congratulations on setting up your free, secure contact form API!**

---

*Last Updated: January 2026*
