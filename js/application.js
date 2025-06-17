
const steps     = document.querySelectorAll(".step");
const progress  = document.getElementById("progress");
let   currentStep = 0;

function showStep(i){
  steps.forEach((s,idx)=>s.classList.toggle("active",idx===i));
  progress.style.width = `${((i+1)/steps.length)*100}%`;
}
function validateStep(){
  const inputs = steps[currentStep].querySelectorAll("input,select,textarea");
  for(const el of inputs){
    if(!el.checkValidity()){ el.reportValidity(); return false; }
  }
  return true;
}
function nextStep(){ if(validateStep() && currentStep<steps.length-1){ currentStep++; showStep(currentStep);} }
function prevStep(){ if(currentStep>0){ currentStep--; showStep(currentStep);} }

showStep(currentStep);

/* formatting helpers */
document.getElementById("phone").addEventListener("input",e=>{
  const x = e.target.value.replace(/\D/g,"").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  e.target.value = !x[2]?x[1] : `(${x[1]}) ${x[2]}${x[3]?`-${x[3]}`:""}`;
});
document.getElementById("social").addEventListener("blur",e=>{
  let v=e.target.value.trim();
  if(v && !v.startsWith("http") && !v.startsWith("@")) e.target.value="@"+v;
});

/* -------------------------------------------------
   Supabase + Stripe submit
--------------------------------------------------*/
const SUPABASE_URL = "https://stgcknunpvlcndtwxdmc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Z2NrbnVucHZsY25kdHd4ZG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNTM2MTUsImV4cCI6MjA2NDYyOTYxNX0.H2JawYsroeA5Tnc_iIeGhRX0kLcUIk0bP3F7rK0JyX4";
const sb = supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

/* Stripe links keyed to tier or vendorType (keep legacy) */
const stripeLinks={
  community  :"https://buy.stripe.com/8x27sM6NK2lRfnK2jL6Na02",
  market  :"https://buy.stripe.com/4gM7sM0pmd0v3F2f6x6Na03",
  headline    :"https://buy.stripe.com/cNi6oI9ZWbWr8ZmgaB6Na04",
  food    :"https://buy.stripe.com/00wfZi3By9Oj5Na7E56Na00",
  "non-food":"https://buy.stripe.com/28E3cw0pm0dJdfCe2t6Na01"
};

/* safe getter – returns "" if element not found */
const val=id=>document.getElementById(id)?.value.trim()||"";

document.getElementById("vendorForm").addEventListener("submit",async e=>{
  e.preventDefault();

  /* collect both new and legacy fields so nothing errors */
  const data={
    business_name : val("vendorName"),
    contact_name  : val("contactName"),
    phone         : val("phone"),
    email         : val("email"),

    sponsor_goal  : val("sponsorGoal"),
    tier          : val("tier"),
    experience    : val("experience"),
    metrics       : val("metrics"),
    social        : val("social"),
    notes         : val("notes"),
  };

  const {error}=await sb.from("sponsors").insert([data]);
  if(error){ console.error(error); alert("Submission failed — try again."); return; }

  /* redirect if we have a matching link */
  const payURL=stripeLinks[data.tier] || stripeLinks[data.vendorType];
  if(payURL){
    document.getElementById("paymentFallbackLink").href=payURL;
    window.location.href=payURL;
  }else{
    document.getElementById("confirmationModal").style.display="flex";
    e.target.reset(); currentStep=0; showStep(currentStep);
  }
});
