const form = document.getElementById('surveyForm');
const sections = document.querySelectorAll('.section');
let currentSection = 0;

function showSection(index) {
  sections.forEach((sec, i) => {
    sec.style.display = i === index ? 'block' : 'none';
  });
}

function nextSection() {
  if (currentSection === 1) {
    const selectedTopics = Array.from(form.querySelectorAll('input[name="topics"]:checked'))
      .map(input => input.value);
    if (!selectedTopics.includes('feedback')) document.getElementById('feedbackFollowup').style.display = 'none';
    if (!selectedTopics.includes('accountability')) document.getElementById('accountabilityFollowup').style.display = 'none';
    if (!selectedTopics.includes('burnout')) document.getElementById('burnoutFollowup').style.display = 'none';
  }

  if (currentSection < sections.length - 1) {
    currentSection++;
    showSection(currentSection);
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      data[key] += `, ${value}`;
    } else {
      data[key] = value;
    }
  }

  fetch('https://script.google.com/macros/s/AKfycbx_0ubWf_f4F6t9nLHlOJyI7c5mtGCrDHr-TKlO_PgPYwU1rTtEgLkZM3VOp2pzr6fA/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.text())
  .then(text => {
    console.log('Submitted to Google Sheets:', text);
    alert('Thank you! Your response was recorded.');
  })
  .catch(err => {
    console.error('Submission error:', err);
    alert('Oops! Something went wrong.');
  });
});

sections.forEach((section, index) => {
  if (index < sections.length - 1) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Next';
    btn.className = 'next-button';
    btn.addEventListener('click', nextSection);
    section.appendChild(btn);
  }
});

showSection(0);
