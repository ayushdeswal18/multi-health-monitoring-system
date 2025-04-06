document.addEventListener('DOMContentLoaded', () => {
    initializeResults();
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });
  
    document.querySelectorAll('.result-card').forEach(card => {
      observer.observe(card);
    });
  
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('results')) {
      try {
        const results = JSON.parse(decodeURIComponent(urlParams.get('results')));
        displayResults(results);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
  });
  
  function initializeResults() {
    document.querySelectorAll('.result-card .prediction-status').forEach(status => {
      status.textContent = 'Awaiting results...';
    });
  }
  
  function setCircularProgress(card, percent) {
    const progress = card.querySelector('.progress');
    const offset = 314 - (314 * percent / 100);
    progress.style.strokeDashoffset = offset;
  }
  
  function updatePimaResults(result) {
    const card = document.getElementById('pimaResult');
    card.querySelector('.prediction-status').textContent = result.prediction ? 'Diabetes Risk Detected' : 'No Diabetes Risk Detected';
    const confidence = Math.round(result.confidence * 100);
    card.querySelector('.confidence-text span').textContent = confidence;
    setCircularProgress(card, confidence);
  
    const factorsList = card.querySelector('.risk-factors ul');
    factorsList.innerHTML = result.factors.map(f => `<li>${f.name}: ${f.value}</li>`).join('');
  }
  
  function updateRetinopathyResults(result) {
    const card = document.getElementById('retinoResult');
    card.querySelector('.prediction-status').textContent = `Retinopathy Stage: ${result.stage}`;
    const severity = Math.round(result.severity * 100);
    card.querySelector('.confidence-text span').textContent = severity;
    setCircularProgress(card, severity);
  
    const list = card.querySelector('.risk-factors ul');
    list.innerHTML = result.details.map(d => `<li>${d}</li>`).join('');
  }
  
  function updateHeartResults(result) {
    const card = document.getElementById('heartResult');
    card.querySelector('.prediction-status').textContent = result.risk_level;
    const risk = Math.round(result.risk_score * 100);
    card.querySelector('.confidence-text span').textContent = risk;
    setCircularProgress(card, risk);
  
    const list = card.querySelector('.risk-factors ul');
    list.innerHTML = result.indicators.map(i => `<li>${i.factor}: ${i.value}</li>`).join('');
  }
  
  function updateFusionResults(result) {
    const card = document.getElementById('fusionResult');
    card.querySelector('.prediction-status').textContent = result.overall_status;
    const score = Math.round(result.combined_score * 100);
    card.querySelector('.confidence-text span').textContent = score;
    setCircularProgress(card, score);
  
    const list = card.querySelector('.risk-factors ul');
    list.innerHTML = result.findings.map(f => `<li>${f}</li>`).join('');
  }
  
  function displayResults(results) {
    if (results.pima) updatePimaResults(results.pima);
    if (results.retinopathy) updateRetinopathyResults(results.retinopathy);
    if (results.heart) updateHeartResults(results.heart);
    if (results.fusion) updateFusionResults(results.fusion);
  }
  