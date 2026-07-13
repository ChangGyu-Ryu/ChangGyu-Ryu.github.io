const evidenceLinks = [...document.querySelectorAll('.evidence-index a')];
const caseRecords = evidenceLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const updateCurrentRecord = () => {
  const probe = Math.min(window.innerHeight * 0.38, 360);
  const atDocumentEnd = Math.ceil(window.scrollY + window.innerHeight)
    >= document.documentElement.scrollHeight - 2;
  const candidates = atDocumentEnd ? [...caseRecords].reverse() : caseRecords;
  const active = candidates.find((target) => {
    const bounds = target.getBoundingClientRect();
    if (atDocumentEnd) return bounds.top < window.innerHeight && bounds.bottom > 0;
    return bounds.top <= probe && bounds.bottom > probe;
  });

  evidenceLinks.forEach((link) => {
    const isActive = active && link.getAttribute('href') === `#${active.id}`;
    if (isActive) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
};

let locationUpdateQueued = false;
let locationUpdateTimer;

const updateLocations = () => {
  updateCurrentRecord();
  locationUpdateQueued = false;
};

const queueLocationUpdate = () => {
  window.clearTimeout(locationUpdateTimer);
  locationUpdateTimer = window.setTimeout(updateLocations, 140);
  if (locationUpdateQueued) return;
  locationUpdateQueued = true;
  window.requestAnimationFrame(updateLocations);
};

window.addEventListener('scroll', queueLocationUpdate, { passive: true });
window.addEventListener('resize', queueLocationUpdate);
window.requestAnimationFrame(updateLocations);
