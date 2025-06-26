 const steps = document.querySelectorAll('.setup-step');
  const progressBar = document.getElementById('progressBar');
  const minimizeBtn = document.getElementById('minimizeBtn');
  const closeBtn = document.getElementById('closeBtn');
  const setupToast = document.getElementById('setupToast');

  steps.forEach(step => {
    step.addEventListener('click', () => {
      step.classList.toggle('completed');
      updateProgress();
    });
  });

  function updateProgress() {
    const total = steps.length;
    const completed = document.querySelectorAll('.setup-step.completed').length;
    const percent = Math.round((completed / total) * 100);
    progressBar.style.width = percent + '%';
  }

  minimizeBtn.addEventListener('click', () => {
    setupToast.classList.toggle('minimized');
    minimizeBtn.textContent = setupToast.classList.contains('minimized') ? '↥' : '↧';
  });

  closeBtn.addEventListener('click', () => {
    setupToast.style.opacity = '0';
    setupToast.style.transform = 'translateY(20px)';
    setTimeout(() => setupToast.remove(), 200);
  });

  updateProgress(); // initial render