document.getElementById('profileForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Profile info saved (mock).');
});

const invoiceList = document.getElementById('invoiceList');
const historyTable = document.getElementById('historyTable');

const invoices = [
  { event: "Clarkston Summer Market", amount: "$150", due: "Unpaid" },
  { event: "TechFest 2025", amount: "$100", due: "Paid" }
];

invoices.forEach(invoice => {
  const card = document.createElement('div');
  card.className = 'invoice-card';
  card.innerHTML = `
    <p><strong>${invoice.event}</strong></p>
    <p>Amount: ${invoice.amount}</p>
    <p>Status: <span style="color:${invoice.due === 'Paid' ? 'green' : 'red'}">${invoice.due}</span></p>
    ${invoice.due === 'Unpaid' ? '<button onclick="alert(\'Redirecting to payment...\')">Pay Now</button>' : ''}
  `;
  invoiceList.appendChild(card);

  if (invoice.due === 'Paid') {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>2025-06-01</td>
      <td>${invoice.event}</td>
      <td>${invoice.amount}</td>
      <td>${invoice.due}</td>
      <td><button onclick="window.print()">Print</button></td>
    `;
    historyTable.appendChild(row);
  }
});
