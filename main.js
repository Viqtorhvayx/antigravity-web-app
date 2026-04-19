// Create background particles for dynamic effect
function createParticles() {
  const container = document.querySelector('.particles');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize properties
    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `-${delay}s`;
    
    container.appendChild(particle);
  }
}

// Button interaction
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  
  const btn = document.getElementById('action-btn');
  btn.addEventListener('click', () => {
    btn.textContent = 'Pipeline is Active! 🚀';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
      btn.textContent = 'Test Interaction';
      btn.style.background = '';
    }, 2000);
  });
});
