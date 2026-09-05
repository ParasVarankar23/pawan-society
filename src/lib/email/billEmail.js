import { sendEmail } from "./transporter";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMoney(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export async function sendBillEmail({
  email,
  memberName,
  roomNumber,
  billNumber,
  billingMonth,
  billDate,
  dueDate,
  previousOutstanding = 0,
  currentCharges = {},
  penalty = 0,
  totalOutstanding = 0,
  balanceAmount = 0,
  pdfPath = null,
}) {
  if (!email) {
    throw new Error("Member email is required");
  }

  if (!billNumber) {
    throw new Error("Bill number is required");
  }

  const charges = {
    maintenance: Number(
      currentCharges.maintenance || 0
    ),
    sinkingFund: Number(
      currentCharges.sinkingFund || 0
    ),
    insurance: Number(
      currentCharges.insurance || 0
    ),
    educationFund: Number(
      currentCharges.educationFund || 0
    ),
    parking: Number(
      currentCharges.parking || 0
    ),
    nonOccupancy: Number(
      currentCharges.nonOccupancy || 0
    ),
    rentNoc: Number(
      currentCharges.rentNoc || 0
    ),
    water: Number(
      currentCharges.water || 0
    ),
    other: Number(
      currentCharges.other || 0
    ),
  };

  const attachment = [];

  if (pdfPath) {
    attachment.push({
      filename:
        `Pawan-Society-Bill-${billNumber}.pdf`,
      path: pdfPath,
      contentType: "application/pdf",
    });
  }

  const safeName =
    escapeHtml(memberName || "Member");

  const safeRoom =
    escapeHtml(roomNumber || "");

  const safeMonth =
    escapeHtml(billingMonth || "");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />

        <style>
          body {
            margin: 0;
            padding: 0;
            background: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
            color: #172033;
          }

          .container {
            max-width: 650px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow:
              0 8px 30px rgba(0,0,0,0.08);
          }

          .header {
            padding: 24px;
            background: linear-gradient(
              135deg,
              #0b74de,
              #16b9e9
            );
            color: #ffffff;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .header p {
            margin: 6px 0 0;
            opacity: 0.9;
          }

          .content {
            padding: 28px;
          }

          .bill-info {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }

          .bill-info td {
            padding: 9px 4px;
            border-bottom: 1px solid #edf0f5;
          }

          .label {
            color: #667085;
          }

          .amount-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .amount-table th,
          .amount-table td {
            padding: 10px;
            border-bottom: 1px solid #edf0f5;
            text-align: left;
          }

          .amount-table th:last-child,
          .amount-table td:last-child {
            text-align: right;
          }

          .total {
            margin-top: 22px;
            padding: 18px;
            background: #eef7ff;
            border-radius: 10px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 7px 0;
          }

          .grand-total {
            font-size: 21px;
            font-weight: bold;
          }

          .footer {
            padding: 20px 28px;
            background: #f8fafc;
            color: #667085;
            font-size: 13px;
          }
        </style>
      </head>

      <body>

        <div class="container">

          <div class="header">
            <h1>Pawan Society</h1>
            <p>Maintenance Bill</p>
          </div>

          <div class="content">

            <p>
              Dear <strong>${safeName}</strong>,
            </p>

            <p>
              Your maintenance bill has been generated
              for the following period.
            </p>

            <table class="bill-info">
              <tr>
                <td class="label">Bill No.</td>
                <td>
                  <strong>${billNumber}</strong>
                </td>
              </tr>

              <tr>
                <td class="label">Room No.</td>
                <td>${safeRoom}</td>
              </tr>

              <tr>
                <td class="label">Billing Month</td>
                <td>${safeMonth}</td>
              </tr>

              <tr>
                <td class="label">Bill Date</td>
                <td>${escapeHtml(billDate || "")}</td>
              </tr>

              <tr>
                <td class="label">Due Date</td>
                <td>${escapeHtml(dueDate || "")}</td>
              </tr>
            </table>

            <h3>Bill Details</h3>

            <table class="amount-table">

              <thead>
                <tr>
                  <th>Particular</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>Previous Outstanding</td>
                  <td>
                    ${formatMoney(previousOutstanding)}
                  </td>
                </tr>

                <tr>
                  <td>Maintenance</td>
                  <td>
                    ${formatMoney(charges.maintenance)}
                  </td>
                </tr>

                <tr>
                  <td>Sinking Fund</td>
                  <td>
                    ${formatMoney(charges.sinkingFund)}
                  </td>
                </tr>

                <tr>
                  <td>Insurance</td>
                  <td>
                    ${formatMoney(charges.insurance)}
                  </td>
                </tr>

                <tr>
                  <td>Education Fund</td>
                  <td>
                    ${formatMoney(charges.educationFund)}
                  </td>
                </tr>

                <tr>
                  <td>Parking</td>
                  <td>
                    ${formatMoney(charges.parking)}
                  </td>
                </tr>

                <tr>
                  <td>Non-Occupancy</td>
                  <td>
                    ${formatMoney(charges.nonOccupancy)}
                  </td>
                </tr>

                <tr>
                  <td>Rent / NOC</td>
                  <td>
                    ${formatMoney(charges.rentNoc)}
                  </td>
                </tr>

                <tr>
                  <td>Water</td>
                  <td>
                    ${formatMoney(charges.water)}
                  </td>
                </tr>

                <tr>
                  <td>Other Charges</td>
                  <td>
                    ${formatMoney(charges.other)}
                  </td>
                </tr>

                <tr>
                  <td>Penalty</td>
                  <td>
                    ${formatMoney(penalty)}
                  </td>
                </tr>

              </tbody>

            </table>

            <div class="total">

              <div class="total-row">
                <span>Total Outstanding</span>
                <span>
                  ${formatMoney(totalOutstanding)}
                </span>
              </div>

              <div class="total-row">
                <span>Amount Paid</span>
                <span>
                  ${formatMoney(
                    totalOutstanding - balanceAmount
                  )}
                </span>
              </div>

              <div class="total-row grand-total">
                <span>Balance Payable</span>
                <span>
                  ${formatMoney(balanceAmount)}
                </span>
              </div>

            </div>

            <p style="margin-top:25px;">
              Please find your detailed maintenance
              bill attached to this email.
            </p>

            <p>
              Thank you,<br />
              <strong>Pawan Society</strong>
            </p>

          </div>

          <div class="footer">
            Pawan Society, Sector 7,
            Khanda Colony, New Panvel,
            Maharashtra - 410206
          </div>

        </div>

      </body>
    </html>
  `;

  const text = `
Pawan Society

Maintenance Bill

Dear ${memberName || "Member"},

Bill No: ${billNumber}
Room No: ${roomNumber || ""}
Billing Month: ${billingMonth || ""}
Bill Date: ${billDate || ""}
Due Date: ${dueDate || ""}

Previous Outstanding:
${formatMoney(previousOutstanding)}

Maintenance:
${formatMoney(charges.maintenance)}

Sinking Fund:
${formatMoney(charges.sinkingFund)}

Insurance:
${formatMoney(charges.insurance)}

Education Fund:
${formatMoney(charges.educationFund)}

Parking:
${formatMoney(charges.parking)}

Non-Occupancy:
${formatMoney(charges.nonOccupancy)}

Rent / NOC:
${formatMoney(charges.rentNoc)}

Water:
${formatMoney(charges.water)}

Other:
${formatMoney(charges.other)}

Penalty:
${formatMoney(penalty)}

Total Outstanding:
${formatMoney(totalOutstanding)}

Balance Payable:
${formatMoney(balanceAmount)}

Thank you,
Pawan Society
  `.trim();

  return sendEmail({
    to: email,
    subject:
      `Pawan Society - Maintenance Bill ${billNumber}`,
    text,
    html,
    attachments: attachment,
  });
}