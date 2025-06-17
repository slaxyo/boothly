const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchVendors() {
const { data, error } = await supabaseClient.from("vendors").select("*");

  if (error) {
    console.error("Error fetching vendors:", error);
    return;
  }
  populateTable(data);
}

function populateTable(vendors) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  vendors.forEach(vendor => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${vendor.vendorName}</td>
      <td>${vendor.contactName}</td>
      <td>${vendor.checked_in ? "✅" : "❌"}</td>
      <td>
        <button class="${vendor.checked_in ? "checked" : ""}" onclick="toggleCheckIn('${vendor.id}', ${vendor.checked_in})">
          ${vendor.checked_in ? "Undo" : "Check In"}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function toggleCheckIn(id, currentState) {
  const { error } = await supabaseClient
    .from("vendors")
    .update({ checked_in: !currentState })
    .eq("id", id);

  if (error) {
    console.error("Check-in update failed:", error);
    return;
  }

  fetchVendors();
}

document.getElementById("searchInput").addEventListener("input", function (e) {
  const val = e.target.value.toLowerCase();
  document.querySelectorAll("#tableBody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
  });
});

fetchVendors();
