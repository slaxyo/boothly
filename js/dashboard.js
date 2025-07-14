const PASSWORD = "market2024";
const COOKIE_KEY = "auth";
const COOKIE_VALUE = PASSWORD;

const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const login = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const vendorStats = document.getElementById("vendorStats");

let currentEditId = null;
let currentQuoteId = null;

window.onload = function () {
  const isAuthed = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_KEY}=`));

  if (!isAuthed) return;

  const login = document.getElementById("login");
  const dashboard = document.getElementById("dashboard");
  const quoteSection = document.getElementById("quoteSection");

  if (login) login.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
  if (quoteSection) quoteSection.style.display = "block";

  if (document.querySelector("#vendorTable")) loadVendors();
  if (document.querySelector("#quoteTable")) loadQuotes();
};

function setAuthCookie() {
  document.cookie = `${COOKIE_KEY}=${COOKIE_VALUE}; path=/; max-age=86400`;
}

function checkPassword() {
  const input = document.getElementById("password").value;
  if (input === PASSWORD) {
    setAuthCookie();
    document.getElementById("login")?.style.setProperty("display", "none");
    document.getElementById("dashboard")?.style.setProperty("display", "block");
    document.getElementById("quoteSection")?.style.setProperty("display", "block");
    if (document.querySelector("#vendorTable")) loadVendors();
    if (document.querySelector("#quoteTable")) loadQuotes();
  } else {
    alert("Incorrect password.");
  }
}

async function loadVendors() {
const { data, error } = await supabaseClient
  .from("vendors")
  .select("*")
  .order("created_at", { ascending: true }); // or false for newest first

  if (error) return console.error("Load error:", error);

  const tbody = document.querySelector("#vendorTable tbody");
  tbody.innerHTML = "";

  let total = 0;
  let checkedIn = 0;

  data.forEach((v) => {
    total++;
    if (v.checkedIn) checkedIn++;

    const row = document.createElement("tr");
row.innerHTML = `
  <td colspan="11">
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; align-items: flex-start;">
      <div style="flex: 1;">
        <strong>${v.vendorName}</strong> — ${v.vendorType}<br>
        <small>Contact:</small> ${v.contactName} <br>  Phone: ${v.phone} <br> Email: ${v.email}<br>
        <small>Setup:</small> ${v.setupTime} <br> Power: ${v.power} <br> Table: ${v.table}<br>
        <small>Description:</small> ${v.description}<br>
        ${v.social ? `<small>Social:</small> ${v.social}<br>` : ""}
        <small>Paid Status:</small> ${v.paid === true ? "TRUE" : v.paid === false ? "FALSE" : "NULL"}<br>
        ${v.licenseUrl ? `<small>Business License:</small> <a href="${v.licenseUrl}" target="_blank">View File</a><br>` : ""}
        <span class="note-toggle" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'">Toggle Notes</span>
        <div class="hidden-note">${v.notes || ""}</div>
      </div>
      <div style="min-width: 140px; text-align: right;">
        <button onclick="toggleCheckIn(${v.id}, ${v.checkedIn})" ${v.checkedIn ? 'class="checked-in"' : ''}>${v.checkedIn ? "Checked In" : "Check In"}</button><br>
        <button onclick="togglePaid(${v.id}, ${v.paid})" style="margin-top: 6px;">
  ${v.paid ? "Mark Unpaid" : "Mark Paid"}
</button><br>

        <button onclick="editVendor(${v.id}, \`${v.vendorName}\`, \`${v.contactName}\`, \`${v.phone}\`, \`${v.email}\`, \`${v.notes || ""}\`)" style="margin-top: 6px;">Edit</button>
        <button onclick="deleteVendor(${v.id})">Delete</button>
      </div>
    </div>
  </td>
`;

    tbody.appendChild(row);
  });

  vendorStats.textContent = `Total Vendors: ${total} | Checked In: ${checkedIn} | Not Checked In: ${total - checkedIn}`;
}
async function togglePaid(id, currentPaidStatus) {
  const newStatus = !currentPaidStatus;

  const { data, error } = await supabaseClient
    .from('vendors')
    .update({ paid: newStatus })
    .eq('id', id);

  if (error) {
    alert("Error updating payment status");
    console.error(error);
    return;
  }

  // Refresh the list or row
  loadVendors(); // or however you're re-rendering the table
}

async function toggleCheckIn(id, currentStatus) {
  const { error } = await supabaseClient.from("vendors").update({ checkedIn: !currentStatus }).eq("id", id);
  if (error) return alert("Failed to update check-in status");
  loadVendors();
}

async function deleteVendor(id) {
  if (!confirm("Are you sure you want to delete this vendor?")) return;
  const { error } = await supabaseClient.from("vendors").delete().eq("id", id);
  if (error) return alert("Failed to delete.");
  loadVendors();
}

function editVendor(id, name, contact, phone, email, notes) {
  currentEditId = id;
  document.getElementById("editName").value = name;
  document.getElementById("editContact").value = contact;
  document.getElementById("editPhone").value = phone;
  document.getElementById("editEmail").value = email;
  document.getElementById("editNotes").value = notes;
  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

async function saveEdit() {
  const updatedData = {
    vendorName: document.getElementById("editName").value,
    contactName: document.getElementById("editContact").value,
    phone: document.getElementById("editPhone").value,
    email: document.getElementById("editEmail").value,
    notes: document.getElementById("editNotes").value
  };
  const { error } = await supabaseClient.from("vendors").update(updatedData).eq("id", currentEditId);
  if (error) return alert("Update failed");
  closeEditModal();
  loadVendors();
}

async function loadQuotes() {
  const { data, error } = await supabaseClient.from("quotes").select("*").order("submitted_at", { ascending: false });
  if (error) return console.error("Quote load error:", error);

  const tbody = document.querySelector("#quoteTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.forEach((q) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${q.name}</td>
      <td>${q.phone}</td>
      <td>${q.brand}</td>
      <td>${q.model}</td>
      <td>${q.repair}</td>
      <td>${q.price}</td>
      <td>${new Date(q.submitted_at).toLocaleString()}</td>
      <td>
        <button class="contact-btn" data-id="${q.id}">Contacted</button>
        <button class="edit-btn" data-id="${q.id}">Edit</button>
        <button class="delete-btn" data-id="${q.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => editQuote(btn.dataset.id);
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => deleteQuote(btn.dataset.id);
  });
  document.querySelectorAll(".contact-btn").forEach(btn => {
    btn.onclick = () => markContacted(btn.dataset.id, btn);
  });
}

async function markContacted(id, btn) {
  btn.disabled = true;
  btn.classList.add("contacted");
  btn.textContent = "Contacted ✔";
  const removeAfter = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const { error } = await supabaseClient.from("quotes").update({ contacted: true, remove_at: removeAfter.toISOString() }).eq("id", id);
  if (error) alert("Failed to update quote status");
}

async function deleteQuote(id) {
  if (!confirm("Delete this quote?")) return;
  const { error } = await supabaseClient.from("quotes").delete().eq("id", id);
  if (error) alert("Failed to delete quote");
  else loadQuotes();
}

async function editQuote(id) {
  currentQuoteId = id;
  const { data, error } = await supabaseClient.from("quotes").select("*").eq("id", id).single();
  if (error) return alert("Failed to fetch quote.");
  document.getElementById("editQuoteName").value = data.name;
  document.getElementById("editQuotePhone").value = data.phone;
  document.getElementById("editQuoteModel").value = data.model;
  document.getElementById("editQuoteRepair").value = data.repair;
  document.getElementById("editQuotePrice").value = data.price;
  document.getElementById("quoteEditModal").style.display = "flex";
}

async function saveQuoteEdit() {
  const updated = {
    name: document.getElementById("editQuoteName").value,
    phone: document.getElementById("editQuotePhone").value,
    model: document.getElementById("editQuoteModel").value,
    repair: document.getElementById("editQuoteRepair").value,
    price: document.getElementById("editQuotePrice").value,
  };
  const { error } = await supabaseClient.from("quotes").update(updated).eq("id", currentQuoteId);
  if (error) return alert("Update failed.");
  closeQuoteModal();
  loadQuotes();
}

function closeQuoteModal() {
  document.getElementById("quoteEditModal").style.display = "none";
}