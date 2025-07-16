import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // === Title ===
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("Invoice / Bill", 14, 20);

  // === Invoice Meta Info ===
  doc.setFontSize(12);
  const orderDate = new Date(order.createdAt).toLocaleDateString();

  doc.text(`Order ID: ${order._id}`, 14, 30);
  doc.text(`Date: ${orderDate}`, 14, 36);

  // === Customer Info ===
  const billing = order.billingData || {};
  const customerAddress = `${billing.address || ""}, ${billing.city || ""}, ${billing.state || ""}, ${billing.pincode || ""}`;

  doc.text(`Customer: ${billing.name || "-"}`, 14, 44);
  doc.text(`Phone: ${billing.phone || "-"}`, 14, 50);
  doc.text(`Email: ${billing.email || "-"}`, 14, 56);
  doc.text(`Address: ${customerAddress}`, 14, 62);
  doc.text(`Landmark: ${billing.landMark || "-"}`, 14, 68);

  // === Product Table ===
  autoTable(doc, {
    startY: 75,
    head: [["Product ID", "Name", "Qty", "Rate", "Total"]],
    body: order.product.map((item) => [
      item._id || "N/A",
      item.name || "N/A",
      item.quantity || 1,
      item.sellPrice,
      item.sellPrice * item.quantity
      ,
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontSize: 11,
    },
    styles: { fontSize: 10 },
  });

  // === Payment & Total Summary ===
  const finalY = doc.lastAutoTable.finalY + 10;
  const grandTotal = order.sellPrice
  autoTable(doc, {
    startY: finalY,
    head: [["Field", "Details"]],
    body: [
      ["Payment Method", order.paymentMethod || "-"],
      ["Order Status", order.status || "Placed"],
      ["Shipping", 0],
      ["Grand Total", order.sellTotalPrice],
    ],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 150, 136], textColor: 255 },
    theme: "grid",
    tableLineColor: 200,
    tableLineWidth: 0.1,
  });

  // === Footer ===
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "Thank you for shopping with us!",
    14,
    doc.lastAutoTable.finalY + 15
  );

  // === Save PDF ===
  doc.save(`Invoice-${order._id}.pdf`);
};
