const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const countryEl = document.getElementById('countryFilter');
const specEl = document.getElementById('specFilter');
const levelEl = document.getElementById('levelFilter');
const formatEl = document.getElementById('formatFilter');

let allDevelopers = [];

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function renderCards(list) {
  if (!list.length) {
    cardsEl.innerHTML = '<p class="muted">Ничего не найдено. Попробуйте изменить фильтры.</p>';
    return;
  }

  cardsEl.innerHTML = list
    .map(
      (dev) => `
      <article class="card dev-card">
        <h3>${dev.name}</h3>
        <p class="muted">${dev.specialization} · ${dev.country} · ${dev.level}</p>
        <p>${dev.bio}</p>
        <div class="tags">${dev.stack.map((item) => `<span class="tag">${item}</span>`).join('')}</div>
        <a class="btn" href="developer-profile.html?id=${dev.id}">Открыть профиль</a>
      </article>
    `,
    )
    .join('');
}

function applyFilters() {
  const search = searchEl.value.trim().toLowerCase();
  const country = countryEl.value;
  const specialization = specEl.value;
  const level = levelEl.value;
  const workFormat = formatEl.value;

  const filtered = allDevelopers.filter((dev) => {
    const haystack = `${dev.name} ${dev.specialization} ${dev.stack.join(' ')} ${dev.bio}`.toLowerCase();

    return (
      (!search || haystack.includes(search)) &&
      (!country || dev.country === country) &&
      (!specialization || dev.specialization === specialization) &&
      (!level || dev.level === level) &&
      (!workFormat || dev.work_format === workFormat)
    );
  });

  renderCards(filtered);
}

async function init() {
  const response = await fetch('data/developers.json');
  allDevelopers = await response.json();

  fillSelect(countryEl, [...new Set(allDevelopers.map((d) => d.country))]);
  fillSelect(specEl, [...new Set(allDevelopers.map((d) => d.specialization))]);
  fillSelect(formatEl, [...new Set(allDevelopers.map((d) => d.work_format))]);

  [searchEl, countryEl, specEl, levelEl, formatEl].forEach((el) => {
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  renderCards(allDevelopers);
}

init();
