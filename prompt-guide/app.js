(() => {
  const cards = Array.from(document.querySelectorAll('.guide-card'));
  const openCount = document.querySelector('#open-count');
  const openAllButton = document.querySelector('#open-all');
  const closeAllButton = document.querySelector('#close-all');
  const toast = document.querySelector('#toast');
  let toastTimer;
  let bulkChanging = false;

  const updateCount = () => {
    openCount.textContent = String(cards.filter((card) => card.open).length);
  };

  const showToast = (message) => {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2600);
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('copy failed');
  };

  const openCardFromHash = (shouldScroll = true) => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    const target = document.getElementById(hash);
    if (!(target instanceof HTMLDetailsElement)) return;

    target.open = true;
    updateCount();
    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  cards.forEach((card) => {
    card.addEventListener('toggle', () => {
      updateCount();
      if (card.open && !bulkChanging && window.location.hash !== `#${card.id}`) {
        window.history.replaceState(null, '', `#${card.id}`);
      }
    });
  });

  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const example = button.closest('.example');
      const quote = example?.querySelector('blockquote:not(.before)');
      if (!quote) return;

      try {
        await copyText(quote.innerText.trim());
        showToast('例文をコピーしました');
      } catch {
        showToast('コピーできませんでした。文章を選んでコピーしてください');
      }
    });
  });

  openAllButton.addEventListener('click', () => {
    bulkChanging = true;
    cards.forEach((card) => { card.open = true; });
    bulkChanging = false;
    updateCount();
    showToast('すべての詳しい説明を開きました');
  });

  closeAllButton.addEventListener('click', () => {
    bulkChanging = true;
    cards.forEach((card) => { card.open = false; });
    bulkChanging = false;
    updateCount();

    const currentTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (currentTarget instanceof HTMLDetailsElement) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    showToast('すべての詳しい説明を閉じました');
  });

  window.addEventListener('hashchange', () => openCardFromHash(true));

  updateCount();
  openCardFromHash(false);
})();
