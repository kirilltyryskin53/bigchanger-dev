const form = document.getElementById('submitForm');
const messageEl = document.getElementById('formMessage');

function parseCommaSeparated(input) {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = isError ? 'muted error-text' : 'muted success-text';
}

function validate(payload) {
  if (!payload.name || !payload.country || !payload.specialization || !payload.level || !payload.bio) {
    return t('validation_required');
  }

  if (!payload.telegram && !payload.discord && !payload.email && !payload.github && !payload.website) {
    return t('validation_contacts');
  }

  return '';
}

async function onSubmit(event) {
  event.preventDefault();

  const payload = {
    name: form.name.value.trim(),
    country: form.country.value.trim(),
    specialization: form.specialization.value.trim(),
    level: form.level.value,
    bio: form.bio.value.trim(),
    stack: parseCommaSeparated(form.stack.value),
    languages: parseCommaSeparated(form.languages.value),
    work_format: form.work_format.value.trim(),
    experience_years: form.experience_years.value ? Number(form.experience_years.value) : null,
    avatar: form.avatar.value.trim(),
    telegram: form.telegram.value.trim(),
    discord: form.discord.value.trim(),
    email: form.email.value.trim(),
    github: form.github.value.trim(),
    website: form.website.value.trim(),
    portfolio: form.portfolio.value.trim(),
    status: 'pending'
  };

  const validationError = validate(payload);
  if (validationError) {
    showMessage(validationError, true);
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;

  try {
    const { error } = await supabaseClient.from('developers').insert([payload]);

    if (error) {
      throw error;
    }

    showMessage(`${t('submit_success')} / ${t('submit_success_en')}`);
    form.reset();
  } catch (e) {
    showMessage(t('load_error'), true);
  } finally {
    submitBtn.disabled = false;
  }
}

function init() {
  initLanguageSwitcher();
  form.addEventListener('submit', onSubmit);
}

init();
