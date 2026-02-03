import nodemailer from "nodemailer";

interface OrderDetailsForEmail {
  customerName: string;
  orderID: string;
  orderDate: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    country?: string;
    zip: string;
  };
  deliveryDate?: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderConfirmationEmail = async ({
  toEmail,
  orderDetails,
  subject = "noreplay@seemanchal-makhana - Your Order is Confirmed!",
  text = "Thank you for your order! Your order has been confirmed.",
}: {
  toEmail: string;
  orderDetails: OrderDetailsForEmail;
  subject?: string;
  text?: string;
}) => {
  //   console.log("Preparing to send email to:", toEmail);
  const mailOptions = {
    from: `"Rajesh Murmu"<${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    text,
    html: `
    <!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 3px solid #007bff;">
        <h1 style="color: #007bff; margin: 0;">Order Confirmed!</h1>
        <p style="font-size: 1.1em;">Thank you for your purchase, ${orderDetails.customerName}!</p>
    </div>
    
    <div style="padding: 20px;">
        <h3>Order Summary</h3>
        <p><strong>Order #:</strong> ${orderDetails.orderID}</p>
        <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="text-align: left; padding: 8px;">Item</th>
                    <th style="text-align: center; padding: 8px;">Qty</th>
                    <th style="text-align: right; padding: 8px;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails.items
                  .map(
                    (item) => `
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                            <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                            <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">₹ ${item.price.toFixed(2)}</td>
                        </tr>
                    `,
                  )
                  .join("")}

                  ${
                    orderDetails.totalAmount > 1000
                      ? `
                  <tr>
                    <td colspan="2" style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;"><strong>Delivery Charges:</strong></td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">₹ 0</td>
                  </tr>
                  `
                      : `<tr>
                    <td colspan="2" style="padding: 8px; border-bottom: 1px solid #ddd; text-align: left;"><strong>Delivery Charges:</strong></td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">₹ 49</td>
                  </tr>`
                  }
            </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 10px;">
            <p><strong>Total: ₹ ${orderDetails.totalAmount.toFixed(2)}</strong></p>
        </div>
    </div>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
        <h3>Shipping Details</h3>
        <p>${orderDetails.shippingAddress.street}<br>
           ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state}<br>
           ${orderDetails.shippingAddress.country}, ${orderDetails.shippingAddress.zip}</p>
        <p><strong>Est. Delivery: </strong> ${orderDetails.deliveryDate ? new Date(orderDetails.deliveryDate).toLocaleDateString() : "Your order will be delivered within 5-7 business days"}</p>
    </div>

    <div style="text-align: center; padding: 20px;">
        <p>Need help? Contact us at <a href="mailto:sales.rajeshmurmu@gmail.com">sales.rajeshmurmu@gmail.com</a></p>
        <p>OR</p>
        <p>Need help? Contact us at <a href="tel:+91-8603804266">Call +91-8603804266</a></p>
        <p style="font-size: 0.8em; color: #777;">&copy; 2025 Your Seemanchal Makhana. All rights reserved.</p>
    </div>
</body>
</html>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
