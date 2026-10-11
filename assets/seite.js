// Hofer Wohnbau – kleine Helfer: Handy-Menü, Projektfilter, Bildbetrachter
(function () {
  // Handy-Menü
  var knopf = document.querySelector('.menue-knopf');
  var nav = document.querySelector('.nav');
  if (knopf && nav) {
    knopf.addEventListener('click', function () {
      var offen = nav.classList.toggle('offen');
      knopf.setAttribute('aria-expanded', offen ? 'true' : 'false');
    });
  }

  // Projektfilter (Alle / Wohnen / Gewerbe)
  var filter = document.querySelectorAll('.filter button');
  filter.forEach(function (b) {
    b.addEventListener('click', function () {
      var art = b.getAttribute('data-art');
      filter.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('.karten .karte').forEach(function (k) {
        k.hidden = art !== 'alle' && k.getAttribute('data-art') !== art;
      });
    });
  });

  // Bildbetrachter für die Projektgalerie
  var links = Array.prototype.slice.call(document.querySelectorAll('.galerie a'));
  if (!links.length) return;
  var box = document.createElement('div');
  box.className = 'betrachter';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<img alt=""><button class="zu" aria-label="Schließen">×</button>' +
    '<button class="zur" aria-label="Vorheriges Bild">‹</button><button class="vor" aria-label="Nächstes Bild">›</button>' +
    '<div class="zaehler"></div>';
  document.body.appendChild(box);
  var bild = box.querySelector('img'), zaehler = box.querySelector('.zaehler'), pos = 0, startX = null;

  function zeige(i) {
    pos = (i + links.length) % links.length;
    bild.src = links[pos].getAttribute('href');
    bild.alt = links[pos].querySelector('img').alt;
    zaehler.textContent = (pos + 1) + ' / ' + links.length;
  }
  function oeffne(i) { zeige(i); box.classList.add('offen'); document.body.style.overflow = 'hidden'; box.querySelector('.zu').focus(); }
  function schliesse() { box.classList.remove('offen'); document.body.style.overflow = ''; links[pos].focus(); }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); oeffne(i); });
  });
  box.querySelector('.zu').addEventListener('click', schliesse);
  box.querySelector('.vor').addEventListener('click', function () { zeige(pos + 1); });
  box.querySelector('.zur').addEventListener('click', function () { zeige(pos - 1); });
  box.addEventListener('click', function (e) { if (e.target === box) schliesse(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('offen')) return;
    if (e.key === 'Escape') schliesse();
    if (e.key === 'ArrowRight') zeige(pos + 1);
    if (e.key === 'ArrowLeft') zeige(pos - 1);
  });
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var d = e.changedTouches[0].clientX - startX;
    if (Math.abs(d) > 50) zeige(pos + (d < 0 ? 1 : -1));
    startX = null;
  });
})();
