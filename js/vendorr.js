

const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");
const vendorTypeSelect = document.getElementById("vendorType");
const foodLicenseUpload = document.getElementById("foodLicenseUpload");
const licenseInput = document.getElementById("businessLicense");

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
    step.style.display = i === index ? "block" : "none";
  });

  progress.style.width = `${((index + 1) / steps.length) * 100}%`;
}

function validateStep() {
  const currentInputs = steps[currentStep].querySelectorAll("input, select, textarea");
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

function toggleLicenseField() {
  if (vendorTypeSelect.value === "food") {
    foodLicenseUpload.style.display = "block";
    licenseInput.setAttribute("required", "true");
  } else {
    foodLicenseUpload.style.display = "none";
    licenseInput.removeAttribute("required");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStep(currentStep);
  toggleLicenseField();
  vendorTypeSelect.addEventListener("change", toggleLicenseField);
});