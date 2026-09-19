(() => {
  'use strict';
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); document.querySelectorAll('.nav-menu[open]').forEach(d => d.open = false); } });
  document.addEventListener('click', event => { document.querySelectorAll('.nav-menu[open]').forEach(d => { if (!d.contains(event.target)) d.open = false; }); });
  const mobileReferral = document.querySelector('.mobile-referral');
  const media = matchMedia('(max-width:900px)');
  function syncNav() { mobileReferral.hidden = !media.matches; if (!media.matches) closeMenu(); }
  media.addEventListener('change', syncNav); syncNav();
  document.querySelectorAll('#primary-nav a').forEach(a => { if (a.getAttribute('href') === location.pathname) a.setAttribute('aria-current', 'page'); });

  let display = {};
  try { display = JSON.parse(get('dayspring-display') || '{}') || {}; } catch {}
  const dialog = document.querySelector('.access-dialog');
  const textButton = document.querySelector('[data-text-size]');
  const contrastButton = document.querySelector('[data-contrast]');
  function applyDisplay() {
    document.documentElement.classList.toggle('large-text', !!display.large);
    document.documentElement.classList.toggle('high-contrast', !!display.contrast);
    textButton.setAttribute('aria-pressed', String(!!display.large));
    contrastButton.setAttribute('aria-pressed', String(!!display.contrast));
  }
  applyDisplay();
  document.querySelectorAll('[data-accessibility]').forEach(b => b.addEventListener('click', () => dialog.showModal()));
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  textButton.addEventListener('click', () => { display.large = !display.large; set('dayspring-display', JSON.stringify(display)); applyDisplay(); });
  contrastButton.addEventListener('click', () => { display.contrast = !display.contrast; set('dayspring-display', JSON.stringify(display)); applyDisplay(); });
  const banner = document.querySelector('.cookie-banner');
  if (!get('dayspring-notice')) banner.hidden = false;
  document.querySelector('[data-cookie-dismiss]').addEventListener('click', () => { set('dayspring-notice', 'dismissed'); banner.hidden = true; });
  document.querySelector('[data-cookie-settings]').addEventListener('click', () => { banner.hidden = false; banner.querySelector('button').focus(); });

  document.querySelectorAll('.enquiry-form').forEach(form => {
    const select = form.querySelector('[name=service]');
    const requested = new URLSearchParams(location.search).get('service');
    if ([...select.options].some(option => option.value === requested)) select.value = requested;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const text = ['DaySpring Centre — conversation summary', 'Prepared locally. NOT submitted to DaySpring.', '',
        'Enquiry: ' + select.options[select.selectedIndex].text,
        ...[['name','Name'],['organisation','Organisation'],['phone','Telephone'],['email','Email'],['area','Area'],['preferred','Preferred contact'],['message','Discussion points']].map(([key,label]) => label + ': ' + (data.get(key) || 'Not provided')),
        '', 'Call 07519 560119 to discuss the next step.'].join('\n');
      const result = form.querySelector('.form-result'); result.replaceChildren();
      const heading = document.createElement('h3'); heading.textContent = 'Your summary is ready — it has not been sent.';
      const copy = document.createElement('p'); copy.textContent = 'Open the draft in your email app, review it and press Send there. If no email app opens, download your summary and email it to dayspringcentre@dayspringcentre.co.uk, or call us. Please arrange any sensitive information sharing separately.';
      const preview = document.createElement('pre'); preview.textContent = text;
      const download = document.createElement('button'); download.type = 'button'; download.className = 'button outline'; download.textContent = 'Download my summary';
      download.addEventListener('click', () => { const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'dayspring-conversation-summary.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
      const call = document.createElement('a'); call.className = 'button'; call.href = 'tel:+447519560119'; call.textContent = 'Call DaySpring';
      const email = document.createElement('a'); email.className = 'button'; email.textContent = 'Open email draft'; email.href = 'mailto:dayspringcentre@dayspringcentre.co.uk?subject=' + encodeURIComponent('Website enquiry: ' + select.options[select.selectedIndex].text) + '&body=' + encodeURIComponent(text);
      result.append(heading, copy, preview, email, download, call); result.hidden = false; result.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'center'});
    });
    form.addEventListener('input', () => { form.querySelector('.form-result').hidden = true; });
  });
})();
