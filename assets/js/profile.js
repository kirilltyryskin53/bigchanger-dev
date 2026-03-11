const root = document.getElementById('profileRoot');

function contactLink(dev) {
  return dev.telegram || dev.discord || dev.email || dev.github || dev.website || '#';
}

function normalizeContact(url) {
  if (!url) {
    return '#';
  }

  if (url.includes('@') && !url.startsWith('http')) {
    return `mailto:${url}`;
  }

  return url;
}

function renderProfile(dev) {
  const links = [
    ['GitHub', dev.github],
    ['Telegram', dev.telegram],
    ['Discord', dev.discord],
    ['Email', dev.email ? `mailto:${dev.email}` : ''],
    ['Сайт', dev.website],
    ['Портфолио', dev.portfolio],
  ].filter(([, value]) => value);

  root.innerHTML = `
    <article class="card profile">
      <div>
        <img class="avatar" src="${dev.avatar}" alt="${dev.name}" />
      </div>
      <div>
        <h1>${dev.name}</h1>
        <p class="muted">${dev.specialization} · ${dev.country} · ${dev.level}</p>
        <p>${dev.bio}</p>
        <p><strong>Опыт:</strong> ${dev.experience_years} лет</p>
        <p><strong>Языки:</strong> ${dev.languages.join(', ')}</p>
        <p><strong>Формат работы:</strong> ${dev.work_format}</p>
        <div class="tags">${dev.stack.map((item) => `<span class="tag">${item}</span>`).join('')}</div>

        <h3>Ссылки</h3>
        <div class="links-list">
          ${links.map(([title, url]) => `<a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`).join('')}
        </div>

        <div class="actions" style="margin-top: 1rem">
          <a class="btn primary" href="${normalizeContact(contactLink(dev))}" target="_blank" rel="noopener noreferrer">Связаться</a>
          <a class="btn" href="developers.html">Назад в каталог</a>
        </div>
      </div>
    </article>
  `;
}

function renderNotFound() {
  root.innerHTML = `
    <section class="card">
      <h1>Профиль не найден</h1>
      <p class="muted">Проверьте ссылку или вернитесь в каталог.</p>
      <a class="btn" href="developers.html">Открыть каталог</a>
    </section>
  `;
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const response = await fetch('data/developers.json');
  const developers = await response.json();

  const dev = developers.find((item) => item.id === id);

  if (!dev) {
    renderNotFound();
    return;
  }

  renderProfile(dev);
}

init();
