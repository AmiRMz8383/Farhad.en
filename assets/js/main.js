
// main.js - lightweight interactions
document.addEventListener('DOMContentLoaded', () => {
  // populate year
  document.getElementById('year').textContent = new Date().getFullYear();

  // load content.json if available
  fetch('content.json').then(r => {
    if (!r.ok) throw new Error('no content');
    return r.json();
  }).then(data => {
    Object.keys(data).forEach(key => {
      const els = document.querySelectorAll('[data-key="' + key + '"]');
      els.forEach(el => {
        if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
          el.value = data[key];
        } else {
          el.innerHTML = data[key];
        }
      });
    });
  }).catch(()=>{/* no content.json — fine */});

  // scroll animation observer
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('in');
    });
  }, {threshold:0.12});
  document.querySelectorAll('[data-anim]').forEach(el=>obs.observe(el));

  // button click micro-interaction
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      btn.animate([{transform:'scale(0.98)'},{transform:'scale(1)'}], {duration:180, easing:'cubic-bezier(.2,.9,.3,1)'});
    });
  });

  // logo uploader local preview
  const logoInput = document.getElementById('logoInput');
  if (logoInput) {
    logoInput.addEventListener('change', (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      const url = URL.createObjectURL(file);
      document.getElementById('logo').src = url;
    });
  }

  // Export content button -> downloads current content as JSON
  const exportBtn = document.getElementById('downloadContent');
  if(exportBtn){
    exportBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const keys = document.querySelectorAll('[data-key]');
      const obj = {};
      keys.forEach(k=>{
        const key = k.getAttribute('data-key');
        obj[key] = k.innerHTML;
      });
      const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'content.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});
