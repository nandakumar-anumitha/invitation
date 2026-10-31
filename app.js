(() => {
  'use strict';
  const config = window.WEDDING_CONFIG || {};
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const DEFAULT_LOCATION = 'https://share.google/yBJDRBLYke2OfDeVp';
  const safeUrl = (value, fallback = '') => {
    if (!value) return fallback;
    try { const u = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(u.protocol) ? u.href : fallback; } catch { return fallback; }
  };
  const locationUrl = safeUrl(config.locationUrl, DEFAULT_LOCATION);
  const phone = value => /^\+?[0-9\s()-]{7,24}$/.test(value || '') ? value.replace(/\D/g, '') : '';
  const whatsapp = (message, recipient = '') => `https://wa.me/${phone(recipient)}?text=${encodeURIComponent(message)}`;
  const openWhatsApp = (message, recipient) => { window.open(whatsapp(message, recipient), '_blank', 'noopener,noreferrer'); };
  let lang = 'en';
  let countdownEvent = 'reception';
  let toastTimer;
  const tr = (en, ta) => lang === 'ta' ? ta : en;
  function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4500); }
  async function copy(text) {
    try { if (!navigator.clipboard || !window.isSecureContext) throw new Error('fallback'); await navigator.clipboard.writeText(text); }
    catch {
      const area = document.createElement('textarea'); area.value = text; area.style.cssText = 'position:fixed;left:-9999px'; document.body.append(area); area.select();
      const copied = document.execCommand('copy'); area.remove();
      if (!copied) { window.prompt(tr('Copy this link:', 'இந்த இணைப்பை நகலெடுக்கவும்:'), text); return; }
    }
    toast(tr('Link copied to clipboard', 'இணைப்பு நகலெடுக்கப்பட்டது'));
  }
  function siteUrl() {
    const u = new URL(safeUrl(config.siteUrl, location.href)); u.hash = ''; u.search = ''; return u.href;
  }
  const guest = (new URLSearchParams(location.search).get('guest') || '').trim().slice(0, 100);
  function renderGuest() {
    if (!guest) return;
    $('#guest-note').hidden = false;
    $('#guest-note').textContent = tr(`A special invitation for ${guest}`, `${guest} அவர்களுக்கு அன்பான அழைப்பு`);
  }
  function setLanguage(next) {
    lang = next; document.documentElement.lang = lang;
    $$('[data-en][data-ta]').forEach(el => { el.textContent = el.dataset[lang]; });
    $$('[data-lang]').forEach(el => { el.hidden = el.dataset.lang !== lang; });
    $('#language').setAttribute('aria-label', tr('Switch to Tamil', 'Switch to English'));
    renderGuest(); updateCountdown(); if (invitationPages.length) renderPage();
    try { localStorage.setItem('wedding-language', lang); } catch {}
  }
  $('#language').addEventListener('click', () => setLanguage(lang === 'en' ? 'ta' : 'en'));
  $$('.location-link').forEach(a => { a.href = locationUrl; });
  // A shared Maps URL is not a destination address. Preserve it instead of
  // incorrectly passing the short URL as a Maps Directions destination.
  $('#directions').href = safeUrl(config.directionsUrl, locationUrl);
  $('#directions').addEventListener('click', () => { if (!config.directionsUrl) toast(tr('In Google Maps, tap Directions to start your journey.', 'Google Maps இல் Directions என்பதைத் தேர்ந்தெடுக்கவும்.')); });
  $('#copy-location').addEventListener('click', () => copy(locationUrl));
  const qr = $('#qr-dialog');
  $('#show-qr').addEventListener('click', () => {
    // Local QR is generated for the supplied location. A changed location uses
    // the public QR service; only the configured public location URL is sent.
    $('#qr-image').src = locationUrl === DEFAULT_LOCATION ? 'assets/location-qr.svg' : `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=20&data=${encodeURIComponent(locationUrl)}`;
    $('#qr-error').hidden = true; $('#qr-image').hidden = false; qr.showModal();
  });
  $('#qr-image').addEventListener('error', () => { $('#qr-image').hidden = true; $('#qr-error').hidden = false; });
  $$('.dialog-close').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }));
  const eventDetails = {
    wedding: { date: '2026-11-16T06:00:00+05:30', start: '20261116T003000Z', end: '20261116T013000Z', title: 'Wedding Ceremony — V Nandakumar & K Anumitha', caption: ['16 November 2026 · 6:00 AM IST', '16 நவம்பர் 2026 · காலை 6:00 மணி · IST'] },
    reception: { date: '2026-11-15T18:00:00+05:30', start: '20261115T123000Z', end: '20261115T133000Z', title: 'Wedding Reception — V Nandakumar & K Anumitha', caption: ['15 November 2026 · 6:00 PM IST', '15 நவம்பர் 2026 · மாலை 6:00 மணி · IST'] }
  };
  function updateCountdown(now = Date.now()) {
    const detail = eventDetails[countdownEvent];
    const remaining = Math.max(0, Math.floor((Date.parse(detail.date) - now) / 1000));
    const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
    ['days', 'hours', 'minutes', 'seconds'].forEach((key, i) => {
      const value = String(values[i]).padStart(2, '0'), digit = $('#' + key);
      if (digit.textContent !== value) {
        digit.textContent = value;
        if (digit.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) digit.animate([{opacity: 0.55, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 350, easing: 'ease-out'});
      }
    });
    $('#countdown-event-title').textContent = countdownEvent === 'reception' ? tr('Wedding Reception', 'திருமண வரவேற்பு விழா') : tr('Wedding Ceremony', 'திருமண விழா');
    $('#countdown-caption').textContent = remaining ? detail.caption[lang === 'ta' ? 1 : 0] : tr('The celebration date has arrived — thank you for your love and blessings!', 'விழா நாள் வந்துவிட்டது — உங்கள் அன்புக்கும் ஆசிகளுக்கும் நன்றி!');
    $('.countdown').setAttribute('aria-label', tr(`Time until ${countdownEvent}`, countdownEvent === 'wedding' ? 'திருமணத்திற்கான காலம்' : 'வரவேற்பிற்கான காலம்'));
  }
  $$('[data-count]').forEach(btn => btn.addEventListener('click', () => { countdownEvent = btn.dataset.count; $$('[data-count]').forEach(b => { const active = b === btn; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); }); updateCountdown(); }));
  updateCountdown(); setInterval(updateCountdown, 1000);
  function download(data, name, type) {
    const url = URL.createObjectURL(new Blob([data], {type})); const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function icsEscape(text) { return text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
  function foldLine(line) {
    const encoder = new TextEncoder(); let result = '', part = '';
    for (const char of line) { if (encoder.encode(part + char).length > 74) { result += part + '\r\n'; part = ' '; } part += char; } return result + part;
  }
  $$('[data-calendar]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.calendar, detail = eventDetails[key];
    const description = `Please join V Nandakumar & K Anumitha. ${key === 'wedding' ? 'Ceremony starts at 6:00 AM IST. This is not a confirmed muhurtham time.' : 'Reception starts at 6:00 PM IST.'} End time is a one-hour calendar placeholder; actual finish time is not specified. Location: ${locationUrl}`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nandakumar Anumitha//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${key}-202611@nandakumar-anumitha.invitation`, `DTSTAMP:${stamp}`, `DTSTART:${detail.start}`, `DTEND:${detail.end}`, `SUMMARY:${icsEscape(detail.title)}`, `DESCRIPTION:${icsEscape(description)}`, `LOCATION:${icsEscape(locationUrl)}`, `URL:${locationUrl}`, 'END:VEVENT', 'END:VCALENDAR'];
    download(lines.map(foldLine).join('\r\n') + '\r\n', `${key}-nandakumar-anumitha.ics`, 'text/calendar;charset=utf-8');
    toast(tr('Calendar file downloaded. Open it to add the event.', 'நாட்காட்டி கோப்பைத் திறந்து விழாவைச் சேர்க்கவும்.'));
  }));
  $('#share-invitation').addEventListener('click', async () => {
    if (location.protocol === 'file:' && !config.siteUrl) { toast(tr('Publish the website first to share a public invitation link.', 'பொது இணைப்பைப் பகிர முதலில் இணையதளத்தை வெளியிடவும்.')); return; }
    const selectedPdf = activeDocument === 'engagement' ? config.engagementPdfUrl : config.pdfUrl;
    const shareUrl = selectedPdf ? new URL(selectedPdf, siteUrl()).href : siteUrl();
    if (navigator.share) { try { await navigator.share({title:'V Nandakumar & K Anumitha', text:tr('You are warmly invited to celebrate with us.', 'எங்கள் விழாவிற்கு அன்புடன் அழைக்கிறோம்.'), url: shareUrl}); return; } catch (e) { if (e.name === 'AbortError') return; } }
    await copy(shareUrl);
  });
  $('#share-page').addEventListener('click', async () => {
    const url = siteUrl();
    if (navigator.share) {
      try { await navigator.share({title:'V Nandakumar & K Anumitha — Wedding Invitation', url}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    // Share the webpage URL so the preview is linked to the website. Sending
    // the poster as a photo instead opens WhatsApp's media viewer when tapped.
    openWhatsApp(url);
  });
  $('#share-full-image').addEventListener('click', async () => {
    const button = $('#share-full-image');
    const imageUrl = safeUrl('assets/wedding-og.png');
    button.disabled = true;
    button.textContent = tr('Preparing image…', 'படம் தயாராகிறது…');
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Image unavailable');
      const file = new File([await response.blob()], 'Nandakumar-Anumitha-Wedding-Invitation.png', {type:'image/png'});
      if (navigator.share && navigator.canShare?.({files:[file]})) {
        await navigator.share({files:[file], title:'V Nandakumar & K Anumitha — Wedding Invitation', text:siteUrl()});
        return;
      }
    } catch (error) { if (error.name === 'AbortError') return; }
    finally { button.disabled = false; button.textContent = button.dataset[lang]; }
    // Browsers without native file sharing can still deliver the original
    // uncropped poster for the guest to attach as a photo in WhatsApp.
    const link = document.createElement('a'); link.href = imageUrl; link.download = 'Nandakumar-Anumitha-Wedding-Invitation.png';
    document.body.append(link); link.click(); link.remove();
    toast(tr('Image downloaded. Attach it as a photo in WhatsApp to share the complete invitation.', 'படம் பதிவிறக்கப்பட்டது. முழு அழைப்பிதழைப் பகிர WhatsApp இல் புகைப்படமாக இணைக்கவும்.'));
  });
  const rsvpPhone = phone(config.rsvpPhone);
  const contacts = Array.isArray(config.contacts) ? config.contacts : [];
  contacts.forEach(contact => { const number = phone(contact.phone); if (!number) return; const a = document.createElement('a'); a.className = 'button outline'; a.href = `tel:+${number}`; a.textContent = `☎ ${contact.name || 'Family'}`; $('#contact-buttons').append(a); });
  $('#contact-pending').hidden = $('#contact-buttons').children.length > 0;
  $('#open-wishes').addEventListener('click', () => $('#wishes-dialog').showModal());
  $('#wishes-form').addEventListener('submit', event => { event.preventDefault(); if (!$('#wishes').value.trim()) { $('#wishes').focus(); return; } openWhatsApp($('#wishes').value.trim(), rsvpPhone); });
  let activeDocument = 'wedding';
  let pdfUrl = safeUrl(config.pdfUrl);
  let invitationPages = (Array.isArray(config.invitationPages) ? config.invitationPages : []).filter(p => safeUrl(p.image));
  let pageIndex = 0;
  function renderPage() {
    if (!invitationPages.length) return;
    const page = invitationPages[pageIndex];
    const image = $('#invitation-image');
    const pageUrl = safeUrl(page.image);
    if (image.src !== pageUrl) { image.src = pageUrl; $('#invitation-stage').scrollTop = 0; $('#invitation-stage').scrollLeft = 0; }
    image.alt = tr(`Invitation page ${pageIndex + 1}: ${page.en}`, `அழைப்பிதழ் பக்கம் ${pageIndex + 1}: ${page.ta || page.en}`);
    $('#page-counter').textContent = `${String(pageIndex + 1).padStart(2,'0')} / ${String(invitationPages.length).padStart(2,'0')}`;
    $('#page-title').textContent = page[lang] || page.en;
    $('#previous-page').disabled = pageIndex === 0;
    $('#next-page').disabled = pageIndex === invitationPages.length - 1;
    $$('#invitation-thumbnails button').forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === pageIndex));
      button.setAttribute('aria-label', tr(`Page ${i + 1}: ${invitationPages[i].en}`, `பக்கம் ${i + 1}: ${invitationPages[i].ta}`));
    });
  }
  function turnPage(delta) { pageIndex = Math.max(0, Math.min(invitationPages.length - 1, pageIndex + delta)); renderPage(); }
  function renderThumbnails() {
    $('#invitation-thumbnails').replaceChildren();
    invitationPages.forEach((page, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'invitation-thumbnail';
    const img = document.createElement('img'); img.src = safeUrl(page.thumbnail, safeUrl(page.image)); img.alt = ''; img.loading = 'lazy';
    const number = document.createElement('span'); number.textContent = String(i + 1).padStart(2,'0');
    button.append(img, number); button.addEventListener('click', () => { pageIndex = i; renderPage(); }); $('#invitation-thumbnails').append(button);
    });
  }
  renderThumbnails();
  $('#previous-page').addEventListener('click', () => turnPage(-1));
  $('#next-page').addEventListener('click', () => turnPage(1));
  $('#invitation-stage').addEventListener('keydown', event => {
    if ($('#pdf-zoom').value !== 'page-width') return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); turnPage(event.key === 'ArrowRight' ? 1 : -1); }
  });
  $('#invitation-image').addEventListener('error', () => toast(tr('This page could not load. Please use View Invitation to open the PDF.', 'இந்தப் பக்கத்தைத் திறக்க இயலவில்லை. PDF அழைப்பிதழைத் திறக்கவும்.')));
  $('#toggle-pdf-preview').addEventListener('click', () => {
    const show = $('#native-pdf').hidden; $('#native-pdf').hidden = !show; $('#toggle-pdf-preview').setAttribute('aria-expanded', String(show));
    if (show && !$('#pdf-frame').getAttribute('src')) $('#pdf-frame').src = pdfUrl + '#zoom=page-width';
  });
  let documentRequest = 0;
  async function loadDocument() {
    const request = ++documentRequest;
    $('#pdf-placeholder').hidden = true;
    $('#pdf-ready').hidden = false;
    $('#view-pdf').href = pdfUrl; $('#download-pdf').href = pdfUrl;
    $('#download-pdf').download = activeDocument === 'engagement' ? 'Nandakumar-Anumitha-Engagement-Album.pdf' : 'Nandakumar-Anumitha-Wedding-Invitation.pdf';
    if (invitationPages.length) renderPage();
    // Read only enough bytes to confirm the PDF, instead of downloading a full
    // 25 MB album before a guest can see its lightweight page previews.
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Missing PDF');
      const reader = response.body?.getReader();
      let bytes = [];
      if (reader) {
        try { while (bytes.length < 5) { const {value, done} = await reader.read(); if (done) break; bytes.push(...value.slice(0, 5 - bytes.length)); } }
        finally { await reader.cancel(); }
      } else { bytes = new Uint8Array(await response.arrayBuffer()).slice(0,5); }
      if (String.fromCharCode(...bytes) !== '%PDF-') throw new Error('Not a PDF');
      if (request !== documentRequest) return;
      $('#pdf-placeholder').hidden = true; $('#pdf-ready').hidden = false;
      if (!invitationPages.length) { $('#invitation-stage').hidden = true; $('.page-navigation').hidden = true; $('#native-pdf').hidden = false; $('#pdf-frame').src = pdfUrl + '#zoom=page-width'; }
    } catch {
      if (request !== documentRequest) return;
      if (!invitationPages.length) { $('#pdf-placeholder').hidden = false; $('#pdf-ready').hidden = true; }
      // Local file previews can still show their images without fetch access.
    }
  }
  if (pdfUrl) loadDocument();
  $$('[data-document]').forEach(button => button.addEventListener('click', () => {
    if (activeDocument === button.dataset.document) return;
    activeDocument = button.dataset.document;
    pdfUrl = safeUrl(activeDocument === 'engagement' ? config.engagementPdfUrl : config.pdfUrl);
    const pages = activeDocument === 'engagement' ? config.engagementPages : config.invitationPages;
    invitationPages = (Array.isArray(pages) ? pages : []).filter(p => safeUrl(p.image));
    pageIndex = 0; $('#pdf-zoom').value = 'page-width';
    $('#invitation-stage').classList.remove('is-zoomed'); $('#invitation-paper').style.width = '';
    $('#native-pdf').hidden = true; $('#pdf-frame').removeAttribute('src');
    $('#toggle-pdf-preview').setAttribute('aria-expanded', 'false');
    $$('[data-document]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderThumbnails(); renderPage(); loadDocument();
  }));
  $('#pdf-zoom').addEventListener('change', () => {
    const zoom = $('#pdf-zoom').value, fit = zoom === 'page-width';
    $('#invitation-stage').classList.toggle('is-zoomed', !fit);
    $('#invitation-paper').style.width = fit ? '' : `${Math.round(760 * Number(zoom) / 100)}px`;
    $('#invitation-stage').scrollTop = 0; $('#invitation-stage').scrollLeft = 0;
    if (!$('#native-pdf').hidden) $('#pdf-frame').src = pdfUrl.split('#')[0] + '#zoom=' + zoom;
  });
  $('#pdf-fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) { await document.exitFullscreen(); return; }
      if (!$('#invitation-viewer').requestFullscreen) throw new Error('Unsupported');
      await $('#invitation-viewer').requestFullscreen();
    } catch { window.open(pdfUrl, '_blank', 'noopener,noreferrer'); }
  });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 16; i++) { const petal = document.createElement('i'); petal.className = 'petal'; petal.style.left = `${i * 6.6}%`; petal.style.animationDuration = `${12 + i % 7}s`; petal.style.animationDelay = `${-i * 2.3}s`; $('#petals').append(petal); }
  }
  try { const saved = localStorage.getItem('wedding-language'); if (saved === 'ta') lang = saved; } catch {}
  setLanguage(lang);
})();
