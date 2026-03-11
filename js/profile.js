const root = document.getElementById('profileRoot');

function parseList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function contactLink(dev) {
  return dev.telegram || dev.discord || dev.email || dev.github || dev.website || '#';
}

function normalizeContact(url) {
  if (!url) return '#';
  if (url.includes('@') && !url.startsWith('http') && !url.startsWith('mailto:')) return `mailto:${url}`;
  return url;
}

function renderProfile(dev) {
  const languages = parseList(dev.languages);
  const stack = parseList(dev.stack);

  const links = [
    ['GitHub', dev.github],
    ['Telegram', dev.telegram],
    ['Discord', dev.discord],
    ['Email', dev.email ? `mailto:${dev.email}` : ''],
    ['Website', dev.website],
    ['Portfolio', dev.portfolio]
  ].filter(([, value]) => value);

  root.innerHTML = `
    <article class="card profile">
      <div>
        <img class="avatar" src="${dev.avatar || 'https://via.placeholder.com/300x300?text=Dev'}" alt="${dev.name}" />
      </div>
      <div>
        <h1>${dev.name}</h1>
        <p class="muted">${dev.specialization || ''} · ${dev.country || ''} · ${dev.level || ''}</p>
        <p>${dev.bio || ''}</p>
        <p><strong>${t('profile_exp')}</strong> ${dev.experience_years || '-'}</p>
        <p><strong>${t('profile_lang')}</strong> ${languages.join(', ') || '-'}</p>
        <p><strong>${t('profile_work')}</strong> ${dev.work_format || '-'}</p>
        <div class="tags">${stack.map((item) => `<span class="tag">${item}</span>`).join('')}</div>

        <h3>${t('profile_links')}</h3>
        <div class="links-list">
          ${links
            .map(
              ([title, url]) =>
                `<a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`,
            )
            .join('')}
        </div>

        <div class="actions" style="margin-top: 1rem">
          <a class="btn primary" href="${normalizeContact(contactLink(dev))}" target="_blank" rel="noopener noreferrer">${t('contact_btn')}</a>
          <a class="btn" href="developers.html">${t('back_catalog')}</a>
        </div>
      </div>
    </article>
  `;
}

function renderNotFound() {
  root.innerHTML = `
    <section class="card">
      <h1>${t('profile_not_found')}</h1>
      <p class="muted">${t('profile_not_found_desc')}</p>
      <a class="btn" href="developers.html">${t('back_catalog')}</a>
    </section>
  `;
}

async function init() {
  initLanguageSwitcher();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    renderNotFound();
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from('developers')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();

    if (error || !data) {
      renderNotFound();
      return;
    }

    renderProfile(data);
  } catch (e) {
    renderNotFound();
  }

  document.addEventListener('bc:lang-change', async () => {
    const { data } = await supabaseClient
      .from('developers')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();
    if (data) renderProfile(data);
  });
}

init();
