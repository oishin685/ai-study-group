const iconPaths = {
  profile: '<circle cx="12" cy="8" r="3.2"/><path d="M5.5 19c.8-4 3-6 6.5-6s5.7 2 6.5 6"/><path d="m18 3 .7 1.6L20.5 5l-1.8.6L18 7.2l-.7-1.6L15.5 5l1.8-.4Z"/>',
  shield: '<path d="M12 3 5 6v5c0 4.4 2.8 7.7 7 9 4.2-1.3 7-4.6 7-9V6Z"/><path d="m9 12 2 2 4-5"/>',
  bulb: '<path d="M8.4 15.2A7 7 0 1 1 15.6 15c-.8.6-1.1 1.2-1.1 2H9.5c0-.8-.3-1.4-1.1-1.8Z"/><path d="M9.5 21h5M9.5 18h5"/>',
  book: '<path d="M4 5.5c3-1 5.7-.5 8 1.2v13c-2.3-1.7-5-2.2-8-1.2Z"/><path d="M20 5.5c-3-1-5.7-.5-8 1.2v13c2.3-1.7 5-2.2 8-1.2Z"/>',
  chat: '<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m5 18 5-5 3 3 2-2 4 4"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  idCard: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2.3"/><path d="M5.5 16c.5-2 1.5-3 3-3s2.5 1 3 3M14 10h4M14 14h4"/>'
};

function icon(name) {
  const paths = iconPaths[name] || iconPaths.book;
  return `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></span>`;
}

function cardMarkup(item) {
  const enabled = item.status === 'active' && item.url;
  const label = item.status === 'coming-soon' ? '準備中' : item.status === 'link-pending' ? 'リンク設定待ち' : '';
  const badge = item.badge && item.badge !== label ? `<span class="badge">${item.badge}</span>` : '';
  const state = label ? `<span class="status-label">${label}</span>` : '';
  const contents = `${icon(item.icon)}<span class="card-copy"><span class="labels">${badge}${state}</span><span class="card-title">${item.title}</span><span class="card-description">${item.description}</span></span><span class="card-action" aria-hidden="true">${enabled ? '›' : ''}</span>`;

  if (enabled) {
    return `<li><a class="card" href="${item.url}">${contents}</a></li>`;
  }
  return `<li><div class="card card-disabled" aria-disabled="true">${contents}</div></li>`;
}

async function loadContents() {
  const root = document.querySelector('#contents');
  try {
    const response = await fetch('./data/contents.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const sections = [...data.categories].sort((a, b) => a.order - b.order);
    root.innerHTML = sections.map((section) => {
      const items = data.contents
        .filter((item) => item.section === section.id)
        .sort((a, b) => a.order - b.order)
        .map(cardMarkup)
        .join('');
      return `<section class="content-section section-${section.id}" aria-labelledby="heading-${section.id}"><h2 id="heading-${section.id}">${section.title}</h2><ul class="card-list">${items}</ul></section>`;
    }).join('');
  } catch (error) {
    console.error('教材一覧を読み込めませんでした。', error);
    root.innerHTML = '<p class="load-message" role="alert">教材一覧を読み込めませんでした。時間をおいて、もう一度お試しください。</p>';
  }
}

loadContents();
