// Supabase
const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const steps = document.querySelectorAll('.step');
const progress = document.getElementById('progress');
let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
  });
  progress.style.width = `${((index + 1) / steps.length) * 100}%`;
}

function validateStep() {
  const currentInputs = steps[currentStep].querySelectorAll('input, select, textarea');
  for (let input of currentInputs) {
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
  }
  return true;
}

function nextStep() {
  if (!validateStep()) return;
  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

showStep(currentStep);

document.getElementById('phone').addEventListener('input', function(e) {
  let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

document.getElementById('social').addEventListener('blur', function(e) {
  let val = e.target.value.trim();
  if (val && !val.startsWith('http') && !val.startsWith('@')) {
    e.target.value = '@' + val;
  }
});

const stripeLinks = {
  food: "https://buy.stripe.com/00wfZi3By9Oj5Na7E56Na00",
  "non-food": "https://buy.stripe.com/dRmdRa1tq0dJejG2jL6Na06"
};

 document.getElementById("vendorForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const vendorName = document.getElementById("vendorName").value;
  const contactName = document.getElementById("contactName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const vendorType = document.getElementById("vendorType").value;
  const description = document.getElementById("description").value;
  const setupTime = document.getElementById("setupTime").value;
  const power = document.getElementById("power").value;
  const table = document.getElementById("table").value;
  const social = document.getElementById("social").value;
  const notes = document.getElementById("notes").value;
  const file = document.getElementById("businessLicense").files[0];

  // Upload the license if vendor is a food vendor
  let licenseUrl = null;
  if (vendorType === "food" && file) {
    const timestamp = Date.now();
    const safeVendorName = vendorName.replace(/\s+/g, "_").toLowerCase();
    const filePath = `${safeVendorName}_${timestamp}_${file.name}`;

const { error: uploadError } = await supabaseClient.storage
  .from("licenses")
  .upload(filePath, file, {
    contentType: file.type
  });


    if (uploadError) {
      alert("Failed to upload business license. Please try again.");
      console.error(uploadError);
      return;
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from("licenses")
      .getPublicUrl(filePath);

    licenseUrl = publicUrlData.publicUrl;
  }

  // Prepare the full vendor object
  const submission = {
    vendorName,
    contactName,
    phone,
    email,
    vendorType,
    description,
    setupTime,
    power,
    table,
    social,
    notes,
    licenseUrl // 📎 Add to vendors table
  };

  // Submit to Supabase table
  const { error } = await supabaseClient.from("vendors").insert([submission]);

  if (error) {
    alert("Something went wrong while submitting.");
    console.error(error);
    return;
  }

  // Redirect to payment
  const stripeLinks = {
    food: "https://buy.stripe.com/00wfZi3By9Oj5Na7E56Na00",
    "non-food": "https://buy.stripe.com/dRmdRa1tq0dJejG2jL6Na06"
  };

  const paymentUrl = stripeLinks[vendorType];
  if (paymentUrl) {
    document.getElementById("paymentFallbackLink").href = paymentUrl;
    window.location.href = paymentUrl;
  } else {
    document.getElementById("confirmationModal").style.display = "flex";
    this.reset();
    currentStep = 0;
    showStep(currentStep);
  }
});

function toggleLicenseField() {
  const vendorTypeSelect = document.getElementById("vendorType");
  const foodLicenseUpload = document.getElementById("foodLicenseUpload");
  const licenseInput = document.getElementById("businessLicense");

  if (!vendorTypeSelect || !foodLicenseUpload || !licenseInput) return;

  if (vendorTypeSelect.value === "food") {
    foodLicenseUpload.style.display = "block";
    licenseInput.setAttribute("required", "true");
  } else {
    foodLicenseUpload.style.display = "none";
    licenseInput.removeAttribute("required");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep); // This will work because currentStep was declared above
  toggleLicenseField();
  document.getElementById("vendorType").addEventListener("change", toggleLicenseField);
});
