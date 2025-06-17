
const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* Stripe links keyed to tier  */
const stripeLinks = {
  bronze : "https://buy.stripe.com/bronze_link",
  silver : "https://buy.stripe.com/silver_link",
  gold   : "https://buy.stripe.com/gold_link",
  custom : "https://buy.stripe.com/custom_link"
};

document.getElementById("vendorForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    business_name : document.getElementById("vendorName").value,
    contact_name  : document.getElementById("contactName").value,
    phone         : document.getElementById("phone").value,
    email         : document.getElementById("email").value,
    sponsor_goal  : document.getElementById("sponsorGoal").value,
    tier          : document.getElementById("tier").value,
    experience    : document.getElementById("experience").value === "yes",
    metrics       : document.getElementById("metrics").value,
    social        : document.getElementById("social").value,
    notes         : document.getElementById("notes").value
  };

  const { error } = await sb.from("sponsors").insert([data]);

  if (error) {
    alert("Submission failed — please try again.");
    console.error(error);
    return;
  }

  /* redirect to matching payment link */
  const payURL = stripeLinks[data.tier];
  if (payURL) {
    document.getElementById("paymentFallbackLink").href = payURL;
    window.location.href = payURL;
  } else {
    document.getElementById("confirmationModal").style.display = "flex";
  }
});
