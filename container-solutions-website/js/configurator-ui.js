// Container Solutions — configurator UI wiring
document.addEventListener('DOMContentLoaded', () => {
  const panel = document.querySelector('.config-panel');
  if (!panel) return;

  const state = { type: 'modular', size: '20ft', color: 'orange', addons: [] };

  const TYPE_LABELS = { modular: 'Modular Building Unit', offshore: 'Offshore Container (DNV 2.7-1)', conversion: 'Custom Conversion' };
  const SIZE_LABELS = { '10ft': '10ft Container', '20ft': '20ft Container', '40ft': '40ft Container', '40hc': '40ft High-Cube' };
  const COLOR_LABELS = { orange: 'Signal Orange', green: 'Container Green', slate: 'Slate Grey', sandstone: 'Sandstone', blue: 'Ocean Blue', red: 'Signal Red' };
  const ADDON_LABELS = { windows: 'Windows & Door Cut-Outs', ac: 'AC / HVAC Unit', staircase: 'Staircase & Platform', solar: 'Rooftop Solar Panel', stripe: 'Custom Branding Stripe' };

  function render3d() {
    if (window.CSConfigurator && window.CSConfigurator.update) {
      window.CSConfigurator.update(state);
    }
  }

  function renderSummary() {
    const specBox = document.querySelector('.cp-spec');
    if (specBox) {
      specBox.innerHTML = `<strong>${SIZE_LABELS[state.size]}</strong>${TYPE_LABELS[state.type]} &middot; ${COLOR_LABELS[state.color]}`;
    }
    const list = document.querySelector('.config-summary ul');
    if (list) {
      list.innerHTML = `
        <li><span>Type</span><strong>${TYPE_LABELS[state.type]}</strong></li>
        <li><span>Size</span><strong>${SIZE_LABELS[state.size]}</strong></li>
        <li><span>Color</span><strong>${COLOR_LABELS[state.color]}</strong></li>
        <li><span>Add-ons</span><strong>${state.addons.length ? state.addons.map(a => ADDON_LABELS[a]).join(', ') : 'None selected'}</strong></li>
      `;
    }
  }

  function wireGroup(selector, key, isMulti) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', () => {
        const value = el.getAttribute('data-value');
        if (isMulti) {
          const idx = state[key].indexOf(value);
          if (idx > -1) { state[key].splice(idx, 1); el.classList.remove('active'); }
          else { state[key].push(value); el.classList.add('active'); }
        } else {
          state[key] = value;
          document.querySelectorAll(selector).forEach(o => o.classList.remove('active'));
          el.classList.add('active');
        }
        render3d();
        renderSummary();
      });
    });
  }

  wireGroup('[data-group="type"]', 'type', false);
  wireGroup('[data-group="size"]', 'size', false);
  wireGroup('[data-group="color"]', 'color', false);
  wireGroup('[data-group="addon"]', 'addons', true);

  renderSummary();
  // give three.js a moment to initialize before first render call
  setTimeout(render3d, 50);

  const enquireBtn = document.querySelector('#configEnquire');
  if (enquireBtn) {
    enquireBtn.addEventListener('click', () => {
      const lines = [
        'I would like to enquire about the following container configuration:',
        '',
        `Type: ${TYPE_LABELS[state.type]}`,
        `Size: ${SIZE_LABELS[state.size]}`,
        `Color: ${COLOR_LABELS[state.color]}`,
        `Add-ons: ${state.addons.length ? state.addons.map(a => ADDON_LABELS[a]).join(', ') : 'None'}`,
        '',
        'Please contact me with pricing and lead time.'
      ].join('\n');
      window.location.href = `mailto:enquiry@containersolutions.com?subject=${encodeURIComponent('Container Configurator Enquiry')}&body=${encodeURIComponent(lines)}`;
    });
  }
});
