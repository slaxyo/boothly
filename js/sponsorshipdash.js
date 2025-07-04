document.addEventListener('DOMContentLoaded', () => {
  const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function fetchSponsors() {
    const { data, error } = await sb.from('sponsors').select('*');
    if (error) return console.error('Fetch error:', error);
    populateTable(data);
  }

  function populateTable(sponsors) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    sponsors.forEach(sponsor => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(sponsor.created_at).toLocaleString()}</td>
        <td>${sponsor.business_name || ''}</td>
        <td>${sponsor.contact_name || ''}</td>
        <td>${sponsor.phone || ''}</td>
        <td>${sponsor.email || ''}</td>
        <td>${sponsor.sponsor_goal || ''}</td>
        <td>${sponsor.tier || ''}</td>
        <td>${sponsor.experience ? '✅' : '❌'}</td>
        <td>${sponsor.metrics || ''}</td>
        <td>${sponsor.social || ''}</td>
        <td>${sponsor.notes || ''}</td>
        <td>${sponsor.description || ''}</td>
      `;
      tbody.appendChild(row);
    });
  }

  document.getElementById('searchInput').addEventListener('input', function(e) {
    const filter = e.target.value.toLowerCase();
    document.querySelectorAll('#tableBody tr').forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(filter) ? '' : 'none';
    });
  });

  fetchSponsors();
});
