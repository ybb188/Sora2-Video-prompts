async function loadData() {
  try {
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error('无法加载 data.json');
    const data = await res.json();
    renderCards(data.items || []);
  } catch (err) {
    console.error(err);
    document.getElementById('content').innerHTML = `
      <div class="col-span-full text-center text-red-400">数据加载失败：${err.message}</div>
    `;
  }
}

function renderCards(items) {
  const container = document.getElementById('content');
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center text-gray-400">暂无数据，请在 data.json 中填写提示词。</div>';
    return;
  }

  container.innerHTML = items.map((item) => {
    const title = escapeHtml(item.title || '未命名');
    const prompt = escapeHtml(item.prompt || '');
    const negative = escapeHtml(item.negative || '');
    const model = escapeHtml(item.model || 'Sora');
    const author = escapeHtml(item.author || '');
    const videoUrl = item.videoUrl ? `<video class="w-full rounded-md mt-3" src="${encodeURI(item.videoUrl)}" controls></video>` : '';
    const tags = Array.isArray(item.tags) ? item.tags.map(t => `<span class="text-xs bg-emerald-800/40 text-emerald-300 px-2 py-1 rounded mr-2">${escapeHtml(t)}</span>`).join('') : '';

    return `
      <article class="border border-emerald-900/40 rounded-lg p-4 bg-black/20 hover:bg-black/30 transition">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-emerald-300">${title}</h2>
          <span class="text-xs text-gray-400">${model}</span>
        </div>
        <div class="mt-2">${tags}</div>
        ${videoUrl}
        <div class="mt-3">
          <div class="text-xs text-gray-400 mb-1">Prompt</div>
          <pre class="text-sm text-gray-200 whitespace-pre-wrap bg-emerald-900/10 border border-emerald-900/40 rounded p-3">${prompt}</pre>
        </div>
        ${negative ? `
        <div class="mt-3">
          <div class="text-xs text-gray-400 mb-1">Negative Prompt</div>
          <pre class="text-sm text-gray-200 whitespace-pre-wrap bg-emerald-900/10 border border-emerald-900/40 rounded p-3">${negative}</pre>
        </div>` : ''}
        ${author ? `<div class="mt-3 text-xs text-gray-400">作者：${author}</div>` : ''}
      </article>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;'
  }[s]));
}

loadData();