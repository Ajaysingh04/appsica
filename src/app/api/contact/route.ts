import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import JobApplication from "@/models/JobApplication";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();
    const phone = String(body?.phone || "").trim();
    const projectName = String(body?.projectname || body?.projectName || "").trim();
    const project = String(body?.project || "").trim();
    const source = String(body?.source || "contact-form").trim();
    const role = String(body?.role || body?.position || "").trim();
    const experience = String(body?.experience || "").trim();
    const portfolioUrl = String(body?.portfolioUrl || body?.portfolio || "").trim();
    const linkedinUrl = String(body?.linkedinUrl || body?.linkedin || "").trim();
    const skills = String(body?.skills || "").trim();
    const resumeUrl = String(body?.resumeUrl || body?.resume || "").trim();
    const resumeAttachment = body?.resumeAttachment && typeof body.resumeAttachment === "object"
      ? {
          filename: String(body.resumeAttachment.filename || "Candidate_Resume.pdf"),
          content: String(body.resumeAttachment.content || ""), // base64 string
        }
      : null;

    const isCareer =
      source === "career-application" ||
      body?.type === "career" ||
      Boolean(role && experience) ||
      Boolean(skills && resumeUrl);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Always save to Database first so no lead or applicant is ever lost
    try {
      await connectDB();
      await ContactMessage.create({
        name,
        email,
        phone,
        message: isCareer
          ? `[Skills: ${skills || "Not specified"}]\n\n[Resume: ${resumeUrl || (resumeAttachment ? `Attached: ${resumeAttachment.filename}` : "Not provided")}]\n\n${message}`
          : message,
        source: isCareer ? "career-application" : source,
        projectName: isCareer ? `Role: ${role || "General"} | Skills: ${skills || "N/A"}` : projectName,
        project: isCareer ? `Resume: ${resumeUrl || (resumeAttachment ? "Attached" : "N/A")} | Portfolio: ${portfolioUrl} | LinkedIn: ${linkedinUrl}` : project,
      });

      if (isCareer) {
        await JobApplication.create({
          name,
          email,
          phone,
          role: role || "General Application",
          experience,
          skills,
          resumeUrl,
          resumeAttachment: resumeAttachment
            ? { filename: resumeAttachment.filename, content: resumeAttachment.content }
            : undefined,
          message,
          status: "new",
        });
      }
    } catch (dbErr) {
      console.error("Failed to save contact/job application to DB:", dbErr);
    }

    const recipientEmail = isCareer
      ? process.env.HR_NOTIFICATION_EMAIL || "hr@appsica.com"
      : process.env.ADMIN_NOTIFICATION_EMAIL || "contact@appsica.com";

    const subject = isCareer
      ? `🎯 New Job Application: ${role || "Candidate"} - ${name}${skills ? ` [Skills: ${skills.slice(0, 35)}]` : ""}`
      : projectName
      ? `🔥 New Project Quote Request: ${projectName} - ${name}`
      : `📬 New Contact Message from ${name} (${phone || email})`;

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CL";

    const cleanPhoneDigits = phone ? phone.replace(/[^\d]/g, "") : "";
    const cleanPhoneTel = phone ? phone.replace(/[^\d+]/g, "") : "";
    const dashboardUrl = `${(process.env.NEXTAUTH_URL || "https://appsica.com").replace(/\/+$/, "")}/admin/dashboard/messages`;

    const htmlContent = isCareer ? `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
    
    <!-- Top Branding Header -->
    <div style="background: linear-gradient(135deg, #091322 0%, #1e1b4b 100%); padding: 32px 36px 28px; text-align: left; border-bottom: 3px solid #8b5cf6;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #c4b5fd; background-color: rgba(139, 92, 246, 0.2); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(196, 181, 253, 0.3);">
          💼 New Candidate Application • HR Desk
        </span>
        <span style="font-size: 12px; color: #cbd5e1; font-weight: 500;">
          ${formattedDate} IST
        </span>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
        Role: ${role || "General Application"}
      </h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #cbd5e1;">
        A professional candidate has submitted a job application / career inquiry through the Appsica Careers Portal.
      </p>
    </div>

    <!-- Main Container -->
    <div style="padding: 32px 36px;">
      
      <!-- Candidate Profile Highlight Card -->
      <div style="display: flex; align-items: center; gap: 16px; padding: 18px 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3); text-align: center; line-height: 50px;">
          ${initials}
        </div>
        <div style="flex: 1; min-width: 0;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${name}</h2>
          <p style="margin: 2px 0 0; font-size: 13px; color: #64748b;">
            <a href="mailto:${email}" style="color: #7c3aed; text-decoration: none; font-weight: 600;">${email}</a>
            ${phone ? ` • <a href="tel:${cleanPhoneTel}" style="color: #059669; text-decoration: none; font-weight: 600;">${phone}</a>` : ""}
          </p>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div style="margin-bottom: 28px; text-align: center;">
        <a href="mailto:${email}?subject=Re:%20Application%20for%20${encodeURIComponent(role || "Career Opportunity")}%20-%20Appsica%20Technologies" style="display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25); margin-right: 10px;">
          ✉️ Reply to Candidate
        </a>
        ${cleanPhoneDigits ? `
        <a href="https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(`Hi ${name}, thank you for applying for the ${role || "open role"} at Appsica Technologies.`)}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
          💬 WhatsApp
        </a>
        ` : ""}
      </div>

      <!-- Information Overview Table -->
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
        <div style="background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
            Candidate Summary
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${skills ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f0fdf4;">
            <td style="padding: 12px 20px; color: #166534; font-weight: 700;">Candidate Skills</td>
            <td style="padding: 12px 20px; color: #15803d; font-weight: 800; font-size: 15px;">${skills}</td>
          </tr>
          ` : ""}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600; width: 150px;">Target Role</td>
            <td style="padding: 12px 20px; color: #7c3aed; font-weight: 800;">${role || "General Inquiry"}</td>
          </tr>
          ${experience ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fcfdfe;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Experience Level</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 700;">${experience}</td>
          </tr>
          ` : ""}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Email Address</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 600;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fcfdfe;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Phone Number</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 600;">
              <a href="tel:${cleanPhoneTel}" style="color: #0f172a; text-decoration: none;">${phone}</a>
            </td>
          </tr>
          ` : ""}
          ${resumeUrl ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #eff6ff;">
            <td style="padding: 12px 20px; color: #1e40af; font-weight: 700;">Resume Document</td>
            <td style="padding: 12px 20px;">
              <a href="${resumeUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 7px 16px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 13px;">
                📄 Open / Download Resume Link
              </a>
            </td>
          </tr>
          ` : resumeAttachment?.filename ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #eff6ff;">
            <td style="padding: 12px 20px; color: #1e40af; font-weight: 700;">Resume Document</td>
            <td style="padding: 12px 20px; color: #059669; font-weight: 700;">
              📎 Attached file: <strong>${resumeAttachment.filename}</strong> (see email attachment)
            </td>
          </tr>
          ` : ""}
          ${portfolioUrl ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Portfolio / GitHub</td>
            <td style="padding: 12px 20px;">
              <a href="${portfolioUrl}" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">
                ${portfolioUrl}
              </a>
            </td>
          </tr>
          ` : ""}
          ${linkedinUrl ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fcfdfe;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">LinkedIn Profile</td>
            <td style="padding: 12px 20px;">
              <a href="${linkedinUrl}" target="_blank" style="color: #0a66c2; font-weight: 700; text-decoration: underline;">
                ${linkedinUrl}
              </a>
            </td>
          </tr>
          ` : ""}
        </table>
      </div>

      <!-- Candidate Cover Note / Statement -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
            Candidate Cover Letter / Message
          </span>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 18px 20px; font-size: 15px; line-height: 1.65; color: #334155;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
      </div>

      <!-- Admin Console Action Button -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed #cbd5e1; text-align: center;">
        <a href="${dashboardUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          ⚡ View in Admin Candidates Console
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px 36px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
      <p style="margin: 0;">
        This is an automated recruitment alert sent to <strong>${recipientEmail}</strong> from Appsica Technologies Careers Portal.
      </p>
      <p style="margin: 6px 0 0;">
        © ${new Date().getFullYear()} Appsica Technologies. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
` : `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 640px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
    
    <!-- Top Branding Header -->
    <div style="background: linear-gradient(135deg, #0b1329 0%, #172554 100%); padding: 32px 36px 28px; text-align: left; border-bottom: 3px solid #2563eb;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #60a5fa; background-color: rgba(37, 99, 235, 0.2); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(96, 165, 250, 0.3);">
          ⚡ New Website Lead
        </span>
        <span style="font-size: 12px; color: #94a3b8; font-weight: 500;">
          ${formattedDate} IST
        </span>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
        ${projectName ? `Project Quote: ${projectName}` : "New Client Inquiry"}
      </h1>
      <p style="margin: 6px 0 0; font-size: 14px; color: #cbd5e1;">
        A visitor has submitted a new message through the Appsica website.
      </p>
    </div>

    <!-- Main Container -->
    <div style="padding: 32px 36px;">
      
      <!-- Client Profile Highlight Card -->
      <div style="display: flex; align-items: center; gap: 16px; padding: 18px 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; flex-shrink: 0; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); text-align: center; line-height: 50px;">
          ${initials}
        </div>
        <div style="flex: 1; min-width: 0;">
          <h2 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${name}</h2>
          <p style="margin: 2px 0 0; font-size: 13px; color: #64748b;">
            <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${email}</a>
            ${phone ? ` • <a href="tel:${cleanPhoneTel}" style="color: #059669; text-decoration: none; font-weight: 600;">${phone}</a>` : ""}
          </p>
        </div>
      </div>

      <!-- Quick Contact Buttons -->
      <div style="margin-bottom: 28px; text-align: center;">
        <a href="mailto:${email}?subject=Re:%20Inquiry%20regarding%20${encodeURIComponent(projectName || "your project")}%20-%20Appsica%20Technologies" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25); margin-right: 10px;">
          ✉️ Reply via Email
        </a>
        ${cleanPhoneDigits ? `
        <a href="https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(`Hi ${name}, thank you for reaching out to Appsica Technologies regarding your project.`)}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);">
          💬 WhatsApp
        </a>
        ` : ""}
      </div>

      <!-- Information Overview Table -->
      <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
        <div style="background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
            Inquiry Breakdown
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600; width: 140px;">Client Name</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 700;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fcfdfe;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Email Address</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 600;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Phone Number</td>
            <td style="padding: 12px 20px; color: #0f172a; font-weight: 600;">
              <a href="tel:${cleanPhoneTel}" style="color: #0f172a; text-decoration: none;">${phone}</a>
            </td>
          </tr>
          ` : ""}
          ${projectName ? `
          <tr style="border-bottom: 1px solid #f1f5f9; background-color: #fcfdfe;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Project / Title</td>
            <td style="padding: 12px 20px; color: #2563eb; font-weight: 700;">${projectName}</td>
          </tr>
          ` : ""}
          <tr style="background-color: #ffffff;">
            <td style="padding: 12px 20px; color: #64748b; font-weight: 600;">Form Source</td>
            <td style="padding: 12px 20px; color: #475569;">
              <span style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 12px; border: 1px solid #bfdbfe;">
                ${source}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Message / Requirements Card -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
            Client Message / Requirements
          </span>
        </div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 8px; padding: 18px 20px; font-size: 15px; line-height: 1.65; color: #334155;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
      </div>

      <!-- Admin Console Action Button -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed #cbd5e1; text-align: center;">
        <a href="${dashboardUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
          ⚡ Open Admin Lead Console
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px 36px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
      <p style="margin: 0;">
        This is an automated notification sent to <strong>${recipientEmail}</strong> from Appsica Technologies portal.
      </p>
      <p style="margin: 6px 0 0;">
        © ${new Date().getFullYear()} Appsica Technologies. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
`;

    // 2. Option A: Custom SMTP (Hostinger / cPanel / Zoho / Google Workspace)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS?.replace(/\s+/g, "");
    let mailSent = false;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: process.env.SMTP_SECURE !== "false",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions: Record<string, any> = {
          from: `"Appsica Technologies" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: email,
          subject,
          html: htmlContent,
        };

        if (resumeAttachment && resumeAttachment.content) {
          mailOptions.attachments = [
            {
              filename: resumeAttachment.filename || "Resume.pdf",
              content: resumeAttachment.content,
              encoding: "base64",
            },
          ];
        }

        await transporter.sendMail(mailOptions);
        mailSent = true;
        console.log(`[Nodemailer] Successfully sent email to ${recipientEmail} via ${smtpUser}`);
      } catch (smtpErr) {
        console.error("SMTP Error sending email:", smtpErr);
      }
    }

    // 2. Option B: Resend Mail Service
    if (!mailSent && process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail =
          process.env.RESEND_FROM_EMAIL || "Appsica Contact <onboarding@resend.dev>";

        const sendResult = await resend.emails.send({
          from: fromEmail,
          to: [recipientEmail],
          subject,
          replyTo: email,
          html: htmlContent,
        });

        if (sendResult.error) {
          console.warn(
            `Resend notice for ${recipientEmail}: ${sendResult.error.message}`
          );

          // If domain is unverified in Resend, automatically fallback to the verified test inbox
          const match = sendResult.error.message.match(/own email address \(([^)]+)\)/i);
          if (match && match[1] && match[1].toLowerCase() !== recipientEmail.toLowerCase()) {
            const fallbackEmail = match[1];
            console.log(`Auto-forwarding to verified Resend test email: ${fallbackEmail}`);
            const retryResult = await resend.emails.send({
              from: fromEmail,
              to: [fallbackEmail],
              subject: `[FORWARDED TO TEST INBOX] ${subject}`,
              replyTo: email,
              html: `
                <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 12px 16px; margin-bottom: 20px; border-radius: 8px; color: #92400e; font-size: 13px; font-family: Arial, sans-serif;">
                  <strong>Resend Notice:</strong> Delivered to verified test email (<code>${fallbackEmail}</code>) because target <code>${recipientEmail}</code> is on an unverified domain in Resend.
                </div>
                ${htmlContent}
              `,
            });
            if (!retryResult.error) {
              mailSent = true;
            } else {
              console.warn("Fallback Resend sending failed:", retryResult.error.message);
            }
          }
        } else {
          mailSent = true;
        }
      } catch (resendErr) {
        console.error("Resend Error sending email:", resendErr);
      }
    }

    if (!mailSent) {
      console.warn("Email sending failed or skipped, but inquiry was securely stored in Database.");
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been submitted successfully.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Unable to send message." },
      { status: 500 }
    );
  }
}


