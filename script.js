const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    contents.forEach(c => c.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Helper: set inputs to current time for a given index (1 or 2)
function setCurrentTime(index) {
  const now = new Date();
  const dateInput = document.getElementById(`date${index}`);
  const hourInput = document.getElementById(`hour${index}`);
  const minuteInput = document.getElementById(`minute${index}`);
  const secondInput = document.getElementById(`second${index}`);

  dateInput.value = now.toISOString().slice(0, 10); // YYYY-MM-DD
  hourInput.value = now.getHours();
  minuteInput.value = now.getMinutes();
  secondInput.value = now.getSeconds();
}

document.getElementById('setCurrent1').addEventListener('click', () => setCurrentTime(1));
document.getElementById('setCurrent2').addEventListener('click', () => setCurrentTime(2));

document.getElementById('submitBtn').addEventListener('click', () => {
  const d1 = document.getElementById('date1').value;
  const d2 = document.getElementById('date2').value;
  const h1 = parseInt(document.getElementById('hour1').value, 10);
  const m1 = parseInt(document.getElementById('minute1').value, 10);
  const s1 = parseInt(document.getElementById('second1').value, 10);
  const h2 = parseInt(document.getElementById('hour2').value, 10);
  const m2 = parseInt(document.getElementById('minute2').value, 10);
  const s2 = parseInt(document.getElementById('second2').value, 10);

  if (!d1 || !d2 || isNaN(h1) || isNaN(m1) || isNaN(s1) || isNaN(h2) || isNaN(m2) || isNaN(s2)) {
    alert("Please fill all inputs correctly.");
    return;
  }

  const dt1 = new Date(`${d1}T${String(h1).padStart(2,'0')}:${String(m1).padStart(2,'0')}:${String(s1).padStart(2,'0')}`);
  const dt2 = new Date(`${d2}T${String(h2).padStart(2,'0')}:${String(m2).padStart(2,'0')}:${String(s2).padStart(2,'0')}`);

  let diff = Math.abs(dt1.getTime() - dt2.getTime()) / 1000;

  const days = Math.floor(diff / (3600*24));
  diff -= days * 3600 * 24;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  diff -= minutes * 60;
  const seconds = Math.floor(diff);

  document.getElementById('result').textContent = 
    `Difference: ${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)`;
});

const timeUnitsInSeconds = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  years: 31557600
};

let normalUnitsWithWeeks = ['years', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
let normalUnitsWithoutWeeks = ['years', 'days', 'hours', 'minutes', 'seconds'];

function convertToNormal(value, unit, includeWeeks) {
  let totalSeconds = value * timeUnitsInSeconds[unit];

  const result = {};
  let remainder = totalSeconds;

  const unitsToUse = includeWeeks ? normalUnitsWithWeeks : normalUnitsWithoutWeeks;

  for (const u of unitsToUse) {
    const unitSeconds = timeUnitsInSeconds[u];
    result[u] = Math.floor(remainder / unitSeconds);
    remainder %= unitSeconds;
  }

  return result;
}

function formatNormal(obj, includeWeeks) {
  let parts = [];
  const unitsToUse = includeWeeks ? normalUnitsWithWeeks : normalUnitsWithoutWeeks;

  for (const unit of unitsToUse) {
    if (obj[unit] && obj[unit] > 0) {
      parts.push(`${obj[unit]} ${unit}`);
    }
  }
  return parts.length ? parts.join(' ') : '0 seconds';
}

function parseInputsToSeconds(includeWeeks) {
  let years = parseInt(document.getElementById('normalYears').value) || 0;
  let weeks = parseInt(document.getElementById('normalWeeks').value) || 0;
  let days = parseInt(document.getElementById('normalDays').value) || 0;
  let hours = parseInt(document.getElementById('normalHours').value) || 0;
  let minutes = parseInt(document.getElementById('normalMinutes').value) || 0;
  let seconds = parseInt(document.getElementById('normalSeconds').value) || 0;

  if (!includeWeeks) {
    days += weeks * 7;
    weeks = 0;
  }

  let totalSeconds = 0;
  totalSeconds += years * timeUnitsInSeconds.years;
  totalSeconds += weeks * timeUnitsInSeconds.weeks;
  totalSeconds += days * timeUnitsInSeconds.days;
  totalSeconds += hours * timeUnitsInSeconds.hours;
  totalSeconds += minutes * timeUnitsInSeconds.minutes;
  totalSeconds += seconds;

  return totalSeconds;
}

document.getElementById('inputUnit').addEventListener('change', () => {
  const selectedUnit = document.getElementById('inputUnit').value;
  document.getElementById('toUnitName').textContent = selectedUnit.charAt(0).toUpperCase() + selectedUnit.slice(1);
});

document.getElementById('includeWeeks').addEventListener('change', () => {
  const includeWeeks = document.getElementById('includeWeeks').checked;
  document.getElementById('normalWeeks').disabled = !includeWeeks;
  if (!includeWeeks) {
    document.getElementById('normalWeeks').value = 0;
  }
});

document.getElementById('toNormalBtn').addEventListener('click', () => {
  const val = parseFloat(document.getElementById('inputValue').value);
  const unit = document.getElementById('inputUnit').value;
  const includeWeeks = document.getElementById('includeWeeks').checked;

  if (isNaN(val) || val < 0) {
    document.getElementById('normalResult').textContent = 'Please enter a valid non-negative number.';
    return;
  }
  const normal = convertToNormal(val, unit, includeWeeks);
  document.getElementById('normalResult').textContent = formatNormal(normal, includeWeeks);
});

document.getElementById('fromNormalBtn').addEventListener('click', () => {
  const includeWeeks = document.getElementById('includeWeeks').checked;
  const totalSeconds = parseInputsToSeconds(includeWeeks);
  const unit = document.getElementById('inputUnit').value;
  const converted = totalSeconds / timeUnitsInSeconds[unit];
  document.getElementById('convertedResult').textContent = `${converted} ${unit}`;
});

window.addEventListener('DOMContentLoaded', () => {
  const includeWeeks = document.getElementById('includeWeeks').checked;
  document.getElementById('normalWeeks').disabled = !includeWeeks;
});
