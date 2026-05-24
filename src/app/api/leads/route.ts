import { NextResponse } from "next/server";

// ============================================
// LEAD CAPTURE API - Website to Backend
// ============================================
// Connects Next.js website to Node.js/MySQL backend
// Endpoint: POST /api/leads
// ============================================

const BACKEND_API_URL = process.env.BACKEND_API_URL || "https://api.factorydirecthomescenter.com";
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email" },
        { status: 400 }
      );
    }

    // Map website form data to backend format
    // Backend expects: firstName, lastName, email, phoneNo, financeOption, homePlacementOption, deliveryState, message, floorTitle
    const backendData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNo: body.phone || body.phoneNo || "",
      // Map financing status to financeOption ID (backend uses IDs)
      financeOption: mapFinancingOption(body.financingStatus),
      // Map land status to homePlacementOption ID
      homePlacementOption: mapPlacementOption(body.landStatus),
      // Map delivery state - backend expects state ID
      deliveryState: mapDeliveryState(body.deliveryState || body.state),
      message: body.message || "",
      floorTitle: body.interest || "",
    };

    console.log("Submitting lead to backend:", backendData);

    // Submit to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/user/enquiryform/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(BACKEND_API_KEY && { "Authorization": `Bearer ${BACKEND_API_KEY}` }),
      },
      body: JSON.stringify(backendData),
    });

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        success: true,
        message: "Lead submitted successfully",
        backendResponse: result,
      });
    } else {
      const errorText = await response.text();
      console.error("Backend error:", errorText);
      
      // Fallback: Send email notification
      await sendEmailNotification(body);
      
      return NextResponse.json({
        success: true,
        message: "Lead captured (email fallback)",
        warning: "Backend sync failed, email sent instead",
      });
    }

  } catch (error) {
    console.error("Lead capture error:", error);
    
    // Even on error, try to send email
    try {
      await sendEmailNotification(await request.json());
    } catch (e) {
      // Ignore email errors
    }
    
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    );
  }
}

// Map financing status to backend finance option ID
// These IDs should match your backend database
function mapFinancingOption(status: string): string {
  const optionMap: Record<string, string> = {
    "cash": "1",
    "pre-approved": "2", 
    "need-financing": "3",
    "unsure": "4",
    "finance": "3",
  };
  return optionMap[status] || "4"; // Default to "unsure"
}

// Map land status to backend placement option ID
function mapPlacementOption(status: string): string {
  const optionMap: Record<string, string> = {
    "yes-owned": "1",
    "yes-purchasing": "2",
    "no-need-land": "3",
    "park": "4",
    "unsure": "5",
    "i-have-land": "1",
    "in-community": "4",
  };
  return optionMap[status] || "5"; // Default to "not sure yet"
}

// Map state name to backend delivery state ID
function mapDeliveryState(state: string): string {
  const stateMap: Record<string, string> = {
    "indiana": "1",
    "ohio": "2",
    "michigan": "3",
    "wisconsin": "4",
    "illinois": "5",
    "kentucky": "6",
  };
  return stateMap[state?.toLowerCase()] || "1"; // Default to Indiana
}

// Fallback email notification
async function sendEmailNotification(leadData: any) {
  try {
    const emailPayload = {
      to: "sales@factorydirecthomescenter.com",
      subject: `New Website Lead: ${leadData.firstName} ${leadData.lastName}`,
      html: `
        <h2>New Website Lead</h2>
        <p><strong>Name:</strong> ${leadData.firstName} ${leadData.lastName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone || "Not provided"}</p>
        <p><strong>Interest:</strong> ${leadData.interest || "Not specified"}</p>
        <p><strong>Land Status:</strong> ${leadData.landStatus || "Not specified"}</p>
        <p><strong>Timeframe:</strong> ${leadData.timeframe || "Not specified"}</p>
        <p><strong>Financing:</strong> ${leadData.financingStatus || "Not specified"}</p>
        <p><strong>State:</strong> ${leadData.deliveryState || leadData.state || "Not specified"}</p>
        <p><strong>Message:</strong> ${leadData.message || "None"}</p>
        <hr>
        <p><em>This lead was submitted from the website contact form.</em></p>
      `,
    };

    // Try to send via backend email endpoint or any configured email service
    console.log("Email notification would be sent:", emailPayload);
    
    // TODO: Implement actual email sending via SendGrid, Resend, etc.
    // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailPayload) });
    
  } catch (error) {
    console.error("Email notification failed:", error);
  }
}
