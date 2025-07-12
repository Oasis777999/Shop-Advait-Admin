import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Invoice / Bill", 14, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 14, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36);
  doc.text(`Customer: ${order.billingData?.name || "-"}`, 14, 44);
  doc.text(`Phone: ${order.billingData?.phone || "-"}`, 14, 50);
  doc.text(`Email: ${order.billingData?.email || "-"}`, 14, 56);
  doc.text(
    `Address: ${order.billingData?.address || ""}, ${order.billingData?.city || ""} - ${order.billingData?.pincode || ""}`,
    14,
    63
  );

  autoTable(doc, {
    startY: 75,
    head: [["Product ID", "Product Name", "Payment", "Status", "Rate", "Total"]],
    body: [
      [
        order.productId,
        order.product?.name || "N/A",
        order.paymentMethod,
        order.status || "Placed",
        order.product.sellPrice,
        order.product.costPrice,
      ]
    ]
  });

  doc.setFontSize(10);
  doc.text("Thank you for shopping with us!", 14, doc.lastAutoTable.finalY + 20);

  doc.save(`Invoice-${order._id}.pdf`);
};
