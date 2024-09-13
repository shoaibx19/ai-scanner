import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Invoice.css';

function Invoice({ data, invoiceNumber }) {
  const invoiceRef = useRef();

  const generatePDF = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`invoice_${invoiceNumber}.pdf`);
    });
  };

  return (
    <div className="invoice-container">
      <div className="invoice" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="invoice-title">Invoice</div>
          <div className="company-info">
            7 STONES<br />
            PO BOX 808<br />
            TARPON SPRINGS, FL 34688<br />
            (855) 659-9406
          </div>
          <div className="invoice-number">{invoiceNumber.toString().padStart(6, '0')}</div>
        </div>
        <table className="invoice-table">
          <tbody>
            <tr className="header-row">
              <td>DATE</td>
              <td>SOLD TO</td>
              <td>SHIP TO</td>
              <td>P.O. NO.</td>
              <td>TERMS</td>
              <td>DUE DATE</td>
              <td>REP</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr className="header-row">
              <td>QUANTITY</td>
              <td colSpan="3">DESCRIPTION</td>
              <td>UNIT PRICE</td>
              <td>DISCOUNT</td>
              <td>AMOUNT</td>
            </tr>
            <tr>
              <td>1</td>
              <td colSpan="3">
                VIN: {data.vin}<br />
                DESC: {data.desc}<br />
                YR/MDL: {data.yrMdl}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td></td>
                <td colSpan="3"></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-totals">
          <div>SUBTOTAL</div>
          <div>TAX RATE</div>
          <div>TAX</div>
          <div>OTHER</div>
          <div className="total">TOTAL</div>
        </div>
      </div>
      <button className="download-btn" onClick={generatePDF}>Download Invoice</button>
    </div>
  );
}

export default Invoice;