export const generateInvoiceHtml = (data: any) => {
    if (!data || !data.HeadTable || data.HeadTable.length === 0) {
        return '<html><body><h2>No Data Available</h2></body></html>';
    }

    const head = data.HeadTable[0];
    const children = data.ChildTable || [];

    const invoiceDate = head.InvoiceDate ? head.InvoiceDate.split('T')[0] + 'T00:00:00' : '';
    const invoiceNo = head.InvoiceNo || '';
    const invoiceMonth = head.InvoiceMonth || '';
    const invoiceYear = head.InvoiceYear || '';
    const companyName = head.CompanyName || '';
    const companyAddress = head.CompanyAddress || '';
    const gstin = head.GSTIN || '';
    const stateName = head.StateName || '';
    const stateCode = head.StateCode || '';
    
    // Summary Fields
    const totalAmountWithoutGst = parseFloat(head.TotalAmountWithoutGst || '0').toFixed(2);
    const cgstAmount = parseFloat(head.CGSTAmount || '0').toFixed(2);
    const sgstAmount = parseFloat(head.SGSTAmount || '0').toFixed(2);
    const igstAmount = parseFloat(head.IGSTAmount || '0').toFixed(2);
    const totalAmount = parseFloat(head.TotalAmount || '0').toFixed(2);

    let itemsHtml = '';
    children.forEach((item: any, index: number) => {
        const dateStr = item.Date ? item.Date.replace('T', 'T') : ''; // e.g. 2026-01-27T19:20:26
        
        const creditInPortal = parseFloat(item.Amount || '0').toFixed(2);
        const cgstAmt = parseFloat(item.CGSTAmt || '0').toFixed(2);
        const sgstAmt = parseFloat(item.SGSTAmt || '0').toFixed(2);
        const igstAmt = parseFloat(item.IGSTAmt || '0').toFixed(2);
        const totalLineAmount = parseFloat(item.TotalAmountWithTax || '0').toFixed(2);

        itemsHtml += `
            <tr>
                <td>${index + 1}</td>
                <td style="word-break: break-all; max-width: 80px;">${dateStr}</td>
                <td class="text-right">${creditInPortal}</td>
                <td class="text-right">${cgstAmt}</td>
                <td class="text-right">${sgstAmt}</td>
                <td class="text-right">${parseFloat(igstAmt) > 0 ? igstAmt : '-'}</td>
                <td class="text-right">${totalLineAmount}</td>
            </tr>
        `;
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 12px;
                color: #000;
                font-size: 13px;
                -webkit-text-size-adjust: 100%;
            }
            .invoice-wrapper {
                max-width: 800px;
                margin: 0 auto;
                background: #fff;
            }
            .border-box {
                border: 1px solid #000;
            }
            .header-info {
                text-align: center;
                border-bottom: 1px solid #000;
                padding: 12px 6px;
                line-height: 1.5;
            }
            .header-info h2 {
                margin: 0 0 4px 0;
                font-size: 16px;
                text-decoration: underline;
                font-weight: bold;
            }
            .header-info h1 {
                margin: 4px 0;
                font-size: 16px;
                font-weight: bold;
            }
            .header-info p {
                margin: 2px 0;
                font-size: 14px;
                font-weight: bold;
            }
            .grid-container {
                display: flex;
                border-bottom: 1px solid #000;
            }
            .grid-col {
                flex: 1;
                padding: 8px;
            }
            .grid-col:first-child {
                border-right: 1px solid #000;
            }
            .info-row {
                margin-bottom: 8px;
            }
            .info-row span {
                display: inline-block;
                vertical-align: top;
            }
            .info-label {
                width: 70px;
            }
            .info-value {
                width: calc(100% - 75px);
                word-wrap: break-word;
            }
            .summary-section {
                padding: 8px;
                border-bottom: 1px solid #000;
                line-height: 1.6;
            }
            .table-title {
                padding: 8px;
                margin: 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                border-bottom: 1px solid #000;
            }
            table th, table td {
                border: 1px solid #000;
                padding: 6px;
                font-size: 13px;
            }
            table th {
                font-weight: normal;
                text-align: left;
            }
            .text-right {
                text-align: right;
            }
            table td {
                vertical-align: top;
            }
            table tr:first-child th {
                border-top: none;
            }
            table tr th:first-child, table tr td:first-child {
                border-left: none;
            }
            table tr th:last-child, table tr td:last-child {
                border-right: none;
            }
            .tc-title {
                color: red;
                font-size: 13px;
                padding: 8px;
                margin: 0;
            }
            .footer-box {
                margin-top: 40px;
                border: 1px solid #d3d3d3;
                padding: 12px;
                color: red;
                font-size: 13px;
                line-height: 1.6;
            }
            .footer-box p {
                margin: 4px 0;
            }
        </style>
    </head>
    <body>
        <div class="invoice-wrapper">
            <div class="border-box">
                <div class="header-info">
                    <h2>MONTHLY TAX INVOICE</h2>
                    <h1>DOODA TECHNOLOGY PRIVATE LIMITED</h1>
                    <p>C/O Rukmini Devi, Station Road, Mirzapur, Bihar -846001</p>
                    <p>GSTIN : 10AAICD3326M1ZU</p>
                    <p>Tel : 1800 103 8583   Email : info@serviceondoors.com</p>
                </div>

                <div class="grid-container">
                    <div class="grid-col">
                        <div class="info-row">
                            <span class="info-label">Name :</span>
                            <span class="info-value">${companyName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Address :</span>
                            <span class="info-value">${companyAddress}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">GSTIN :</span>
                            <span class="info-value">${gstin}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">State :</span>
                            <span class="info-value">${stateName} (${stateCode})</span>
                        </div>
                    </div>
                    <div class="grid-col">
                        <div class="info-row">
                            <span style="width: 100px;">Invoice No :</span>
                            <span>${invoiceNo}</span>
                        </div>
                        <div class="info-row">
                            <span style="width: 100px;">Invoice Date :</span>
                            <span>${invoiceDate}</span>
                        </div>
                        <div class="info-row" style="margin-top: 40px;">
                            <span style="width: 130px;">Invoice Month/Year :</span>
                            <span>${invoiceMonth} / ${invoiceYear}</span>
                        </div>
                    </div>
                </div>

                <div class="summary-section">
                    <div>HSN/SAC : 998361</div>
                    <div>Digital Marketing Service Charges : Rs ${totalAmountWithoutGst}</div>
                    <div>CGST (9%) : Rs ${cgstAmount} , SGST (9%) Rs : ${sgstAmount}</div>
                    <div>Bill Amt : Rs ${totalAmount}</div>
                </div>

                <div class="table-title">Records of costs and taxes :</div>
                <table>
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Date</th>
                            <th class="text-right">Credit In<br/>Portal</th>
                            <th class="text-right">CGST<br/>(9%)</th>
                            <th class="text-right">SGST<br/>(9%)</th>
                            <th class="text-right">IGST<br/>(18%)</th>
                            <th class="text-right">Amount (Rs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <p class="tc-title">Terms And Conditions</p>
            </div>

            <div class="footer-box">
                <p>Subject to Bihar Jurisdiction only.</p>
                <p>It is computer generated bill, No signatory required.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
