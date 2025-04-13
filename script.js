import * as tf from '@tensorflow/tfjs';
let model;

// Load the model from model.json
async function loadModel() {
  model = await tf.loadLayersModel('disease-model/model.json');
  console.log('Model loaded');
}

// Call loadModel on page load
window.onload = loadModel;

fetch('data.json')
  .then(response => response.json())
  .then(data => window.diseaseData = data.diseases);

function detectDisease() {
  const input = document.getElementById('search').value.toLowerCase().split(',').map(s => s.trim());
  const results = [];

  window.diseaseData.forEach(disease => {
    const matchingSymptoms = disease.symptoms.filter(symptom =>
      input.some(userSymptom => symptom.toLowerCase().includes(userSymptom))
    );

    if (matchingSymptoms.length > 0) {
      results.push({
        name: disease.name,
        matches: matchingSymptoms.length,
        total: disease.symptoms.length,
        disease
      });
    }
  });

  results.sort((a, b) => b.matches / b.total - a.matches / a.total);

  const list = document.getElementById('diseaseList');
  list.innerHTML = results.length ? results.map(result => `
    <div class="disease-card">
      <h2>${result.name}</h2>
      <p><strong>Symptoms:</strong> ${result.disease.symptoms.join(', ')}</p>
      <p><strong>Prevention:</strong> ${result.disease.prevention.join(', ')}</p>
      <p><strong>Treatment:</strong> ${result.disease.treatment.join(', ')}</p>
    </div>
  `).join('') : `<p>No matching disease found. Please try again.</p>`;
}
