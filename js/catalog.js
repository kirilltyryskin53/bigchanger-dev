const cardsEl = document.getElementById('cards');
const searchEl = document.getElementById('search');
const countryEl = document.getElementById('countryFilter');
const specEl = document.getElementById('specFilter');
const levelEl = document.getElementById('levelFilter');
const formatEl = document.getElementById('formatFilter');

let allDevelopers = [];

function fillSelect(select, values) {
  select.querySelectorAll('option:not([value=""])').forEach((option) => option.remove());
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function renderMessage(message) {
  cardsEl.innerHTML = `<p class="muted">${message}</p>`;
}

function renderCards(list) {
  if (!allDevelopers.length) {
    renderMessage(t('empty_catalog'));
    return;
  }

  if (!list.length) {
    renderMessage(t('no_results'));
    return;
  }

  cardsEl.innerHTML = list
    .map(
      (dev) => `
      <article class="card dev-card">
        <h3>${dev.name}</h3>
        <p class="muted">${dev.specialization} · ${dev.country} · ${dev.level}</p>
        <p>${dev.bio || ''}</p>
        <div class="tags">${(dev.stack || []).map((item) => `<span class="tag">${item}</span>`).join('')}</div>
        <a class="btn" href="developer-profile.html?id=${dev.id}">${t('open_profile')}</a>
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
    const stack = Array.isArray(dev.stack) ? dev.stack.join(' ') : dev.stack || '';
    const haystack = `${dev.name || ''} ${dev.specialization || ''} ${stack} ${dev.bio || ''}`.toLowerCase();

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

function applyStaticFilterLabels() {
  document.querySelector('#countryFilter option[value=""]').textContent = t('filter_country_all');
  document.querySelector('#specFilter option[value=""]').textContent = t('filter_spec_all');
  document.querySelector('#levelFilter option[value=""]').textContent = t('filter_level_all');
  document.querySelector('#formatFilter option[value=""]').textContent = t('filter_work_all');
}

async function init() {
  initLanguageSwitcher();
  applyStaticFilterLabels();

  try {
    const { data, error } = await supabaseClient
      .from('developers')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    allDevelopers = data || [];

    fillSelect(countryEl, [...new Set(allDevelopers.map((d) => d.country).filter(Boolean))]);
    fillSelect(specEl, [...new Set(allDevelopers.map((d) => d.specialization).filter(Boolean))]);
    fillSelect(formatEl, [...new Set(allDevelopers.map((d) => d.work_format).filter(Boolean))]);

    [searchEl, countryEl, specEl, levelEl, formatEl].forEach((el) => {
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    });

    renderCards(allDevelopers);
  } catch (e) {
    renderMessage(t('load_error'));
  }

  document.addEventListener('bc:lang-change', () => {
    applyStaticFilterLabels();
    renderCards(allDevelopers);
  });
}

init();
