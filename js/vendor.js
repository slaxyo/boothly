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

    // Supabase init must come AFTER the script is loaded
    const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    document.getElementById("vendorForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const data = {
        vendorName: document.getElementById("vendorName").value,
        contactName: document.getElementById("contactName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        vendorType: document.getElementById("vendorType").value,
        description: document.getElementById("description").value,
        setupTime: document.getElementById("setupTime").value,
        power: document.getElementById("power").value,
        table: document.getElementById("table").value,
        social: document.getElementById("social").value,
        notes: document.getElementById("notes").value,
      };

      const { error } = await supabaseClient.from("vendors").insert([data]);

      if (error) {
        alert("Something went wrong while submitting.");
        console.error(error);
      } else {
        document.getElementById("confirmationModal").style.display = "flex";
        this.reset();
        currentStep = 0;
        showStep(currentStep);
      }
    });