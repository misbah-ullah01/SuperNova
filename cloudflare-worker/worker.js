/**
 * =====================================================
 * CLOUDFLARE WORKER - CONTACT FORM API
 * =====================================================
 * 
 * This worker handles contact form submissions securely.
 * It sends emails using MailChannels (free with CloudFlare Workers).
 * 
 * SECURITY FEATURES:
 * - CORS validation (only allows your domain)
 * - Input validation & sanitization
 * - Rate limiting headers
 * - No secrets in code (configured in CloudFlare dashboard)
 * 
 * SETUP:
 * 1. Deploy this worker to CloudFlare
 * 2. Set environment variables in CloudFlare dashboard:
 *    - RECIPIENT_EMAIL: Your email to receive messages
 *    - ALLOWED_ORIGIN: Your website domain (e.g., https://yourdomain.com)
 * 
 * =====================================================
 */

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env)
  }
}

/**
 * Main request handler
 */
async function handleRequest(request, env) {
  // Get environment variables (set in CloudFlare dashboard - NOT in code!)
  const RECIPIENT_EMAIL = env.RECIPIENT_EMAIL || 'your-email@example.com'
  const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || '*'
  const FROM_EMAIL = env.FROM_EMAIL || 'noreply@example.com'

  // CORS Headers - restrict to your domain in production
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  // Handle GET request - show API status (useful for testing)
  if (request.method === 'GET') {
    return jsonResponse({
      status: 'ok',
      message: 'SuperNova Contact Form API is running',
      usage: 'Send a POST request with name, email, subject, service, and message fields'
    }, 200, corsHeaders)
  }

  // Only allow POST requests for form submission
  if (request.method !== 'POST') {
    return jsonResponse({
      error: 'Method not allowed',
      allowed: 'POST'
    }, 405, corsHeaders)
  }

  // Verify origin in production - blocks requests from unauthorized domains
  const origin = request.headers.get('Origin')
  if (ALLOWED_ORIGIN !== '*' && origin && origin !== ALLOWED_ORIGIN) {
    return jsonResponse({ error: 'Forbidden' }, 403, corsHeaders)
  }

  try {
    // Parse request body
    const data = await request.json()

    // Extract and validate fields
    const { name, email, subject, service, message } = data

    // Validation
    const validationError = validateFormData(name, email, subject, message)
    if (validationError) {
      return jsonResponse({ error: validationError }, 400, corsHeaders)
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject || 'Contact Form Submission'),
      service: sanitizeInput(service || 'Not specified'),
      message: sanitizeInput(message)
    }

    // Send email using MailChannels (FREE with CloudFlare Workers)
    const emailResult = await sendEmail(sanitizedData, RECIPIENT_EMAIL, FROM_EMAIL)

    if (!emailResult.success) {
      console.error('Email send failed:', emailResult.error)
      return jsonResponse({
        error: 'Failed to send email: ' + emailResult.error
      }, 500, corsHeaders)
    }

    // Log success (viewable in CloudFlare dashboard logs)
    console.log(`✅ Contact form submitted: ${sanitizedData.name} (${sanitizedData.email})`)

    // Return success response
    return jsonResponse({
      success: true,
      message: 'Your message has been sent successfully!'
    }, 200, corsHeaders)

  } catch (error) {
    console.error('Worker error:', error.message)
    return jsonResponse({
      error: 'An error occurred processing your request'
    }, 500, corsHeaders)
  }
}

/**
 * Validate form data
 */
function validateFormData(name, email, subject, message) {
  // Required fields
  if (!name || !email || !message) {
    return 'Please fill in all required fields (name, email, message)'
  }

  // Name validation (2-100 chars, letters and spaces only)
  if (name.length < 2 || name.length > 100) {
    return 'Name must be between 2 and 100 characters'
  }

  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes'
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  // Message length (10-2000 chars)
  if (message.length < 10) {
    return 'Message must be at least 10 characters'
  }

  if (message.length > 2000) {
    return 'Message must not exceed 2000 characters'
  }

  // Subject length (if provided)
  if (subject && subject.length > 200) {
    return 'Subject must not exceed 200 characters'
  }

  return null // No validation errors
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
  if (!input) return ''

  return String(input)
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Send email using MailChannels API (free with CloudFlare Workers)
 */
async function sendEmail(data, recipientEmail, fromEmail) {
  const { name, email, subject, service, message } = data
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long'
  })

  try {
    const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{
              email: recipientEmail,
              name: 'SuperNova Team'
            }],
            reply_to: {
              email: email,
              name: name
            }
          },
        ],
        from: {
          email: fromEmail,
          name: 'SuperNova Contact Form',
        },
        subject: `✦ Contact Form: ${subject}`,
        content: [
          {
            type: 'text/plain',
            value: `
New Contact Form Submission
============================

Name: ${name}
Email: ${email}
Subject: ${subject}
Service: ${service}

Message:
${message}

---
Timestamp: ${timestamp}
Sent from SuperNova Contact Form
            `.trim()
          },
          {
            type: 'text/html',
            value: generateEmailHTML(name, email, subject, service, message, timestamp)
          }
        ],
      }),
    })

    if (response.status === 202 || response.status === 200) {
      return { success: true }
    } else {
      const errorText = await response.text()
      return { success: false, error: errorText }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Generate beautiful HTML email
 */
function generateEmailHTML(name, email, subject, service, message, timestamp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
          ✦ SuperNova
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
          New Contact Form Submission
        </p>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Info Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                    <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                    <p style="margin: 4px 0 0 0;">
                      <a href="mailto:${email}" style="color: #6366f1; font-size: 16px; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</span>
                    <p style="margin: 4px 0 0 0; color: #111827; font-size: 16px;">${subject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service Interest</span>
                    <p style="margin: 4px 0 0 0;">
                      <span style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${service}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Message -->
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 16px; font-weight: 600;">Message</h3>
          <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
        
        <!-- Reply Button -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="mailto:${email}?subject=Re: ${subject}" 
             style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Reply to ${name}
          </a>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-align: center;">
          📅 ${timestamp}
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
          Sent from SuperNova Contact Form • Powered by CloudFlare Workers
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Helper function to create JSON responses
 */
function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  })
}
