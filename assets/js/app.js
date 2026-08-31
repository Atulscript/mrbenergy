/**
 * MRB Energy Solutions — Interactive UI, SCADA Telemetry & Drawer Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');

  function openMenu() {
    if (drawer && backdrop) {
      backdrop.classList.remove('hidden');
      setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
    }
  }

  function closeMenu() {
    if (drawer && backdrop) {
      drawer.classList.add('translate-x-full');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // FAQ Accordions
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // Live Simulated SCADA Telemetry Simulator
  const scadaPower = document.getElementById('liveScadaPower');
  const scadaDaily = document.getElementById('liveScadaDaily');
  const scadaIrradiance = document.getElementById('liveScadaIrr');

  if (scadaPower || scadaDaily) {
    setInterval(() => {
      if (scadaPower) {
        const base = 142.5;
        const variance = (Math.random() * 4 - 2).toFixed(1);
        scadaPower.innerText = (base + parseFloat(variance)).toFixed(1) + ' kW';
      }
      if (scadaIrradiance) {
        const baseIrr = 875;
        const varIrr = Math.round(Math.random() * 20 - 10);
        scadaIrradiance.innerText = (baseIrr + varIrr) + ' W/m²';
      }
    }, 2500);
  }

  // Sector Filter on Case Studies
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseItems = document.querySelectorAll('.case-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      caseItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Quote Form Submission
  const quoteForm = document.getElementById('smeQuoteForm');
  const successState = document.getElementById('formSuccessState');
  const waConfirmBtn = document.getElementById('sendWaConfirmation');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value || 'Valued Client';
      const phone = document.getElementById('formPhone')?.value || '';
      const bill = document.getElementById('formBill')?.value || '';
      const state = document.getElementById('formState')?.value || '';

      quoteForm.classList.add('hidden');
      if (successState) successState.classList.remove('hidden');

      if (waConfirmBtn) {
        const text = `Hi MRB Energy Solutions Team,\n\nI submitted a request for a Free Solar Survey:\n- Name: ${name}\n- Phone: ${phone}\n- Location: ${state}\n- Monthly Power Bill: ${bill}\n\nPlease confirm my engineering appointment.`;
        waConfirmBtn.href = 'https://wa.me/919477004493?text=' + encodeURIComponent(text);
      }
    });
  }
});
