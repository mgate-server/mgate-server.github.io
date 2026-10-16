// MGate Platform Interactive Engine (Light Corporate Theme)
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  initMobileMenu();
  initSizingCalculator();
  initDnsGenerator();
  initDocsSearch();
  initDemoConfig();
});

// 1. Tabs Management
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabsContainer => {
    const tabButtons = tabsContainer.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');
        const parentScope = btn.closest('[data-tabs-scope]') || document;
        
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        parentScope.querySelectorAll('[data-tab-content]').forEach(pane => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });
      });
    });
  });
}

// 2. Copy to Clipboard
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSelector = btn.getAttribute('data-copy-target');
      let text = '';
      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) text = targetEl.innerText.trim();
      } else {
        text = btn.getAttribute('data-copy-text') || '';
      }

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const origHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Скопировано!
        `;
        btn.style.color = '#059669';
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.style.color = '';
        }, 2000);
      });
    });
  });
}

// 3. Mobile Menu
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }
}

// 4. Interactive Sizing Calculator
function initSizingCalculator() {
  const usersSlider = document.getElementById('calcUsers');
  const clamavCheck = document.getElementById('calcClamav');
  
  if (!usersSlider) return;

  const usersDisplay = document.getElementById('calcUsersDisplay');
  const cpuDisplay = document.getElementById('calcCpu');
  const ramDisplay = document.getElementById('calcRam');
  const diskDisplay = document.getElementById('calcDisk');
  const topoDisplay = document.getElementById('calcTopology');

  function update() {
    const users = parseInt(usersSlider.value, 10);
    const withClam = clamavCheck ? clamavCheck.checked : true;

    if (usersDisplay) {
      usersDisplay.textContent = users >= 1000 ? `${(users / 1000).toFixed(users % 1000 === 0 ? 0 : 1)}k ящиков` : `${users} ящиков`;
    }

    let cpu = '2 vCPU';
    let ram = withClam ? '4 GB' : '2 GB';
    let disk = '40 GB NVMe';
    let topo = 'Docker Compose (1 VPS)';

    if (users <= 100) {
      cpu = '2 vCPU';
      ram = withClam ? '4 GB' : '2 GB';
      disk = '40 GB NVMe';
      topo = 'Docker Compose (1 VPS)';
    } else if (users <= 500) {
      cpu = '4 vCPU';
      ram = withClam ? '8 GB' : '4 GB';
      disk = '120 GB NVMe';
      topo = 'Docker Compose (Production)';
    } else if (users <= 2500) {
      cpu = '8 vCPU';
      ram = withClam ? '16 GB' : '8 GB';
      disk = '500 GB NVMe / S3';
      topo = 'Kubernetes (Helm Cluster)';
    } else {
      cpu = '16+ vCPU';
      ram = withClam ? '32+ GB' : '16 GB';
      disk = '1+ TB NVMe / S3';
      topo = 'HA Enterprise Cluster (K8s)';
    }

    if (cpuDisplay) cpuDisplay.textContent = cpu;
    if (ramDisplay) ramDisplay.textContent = ram;
    if (diskDisplay) diskDisplay.textContent = disk;
    if (topoDisplay) topoDisplay.textContent = topo;
  }

  usersSlider.addEventListener('input', update);
  if (clamavCheck) clamavCheck.addEventListener('change', update);
  update();
}

// 5. Interactive DNS Generator
function initDnsGenerator() {
  const domainInput = document.getElementById('dnsDomainInput');
  const hostInput = document.getElementById('dnsHostInput');
  const ipInput = document.getElementById('dnsIpInput');

  if (!domainInput) return;

  function updateDns() {
    const domain = (domainInput.value || 'example.com').trim().toLowerCase();
    const mailHost = (hostInput ? hostInput.value : `mail.${domain}`).trim().toLowerCase();
    const ip = (ipInput ? ipInput.value : '203.0.113.10').trim();

    const mxVal = document.getElementById('dnsMxVal');
    const aVal = document.getElementById('dnsAVal');
    const spfVal = document.getElementById('dnsSpfVal');
    const dkimVal = document.getElementById('dnsDkimVal');
    const dmarcVal = document.getElementById('dnsDmarcVal');
    const autoVal = document.getElementById('dnsAutoVal');
    const stsVal = document.getElementById('dnsStsVal');
    const tlsRptVal = document.getElementById('dnsTlsRptVal');

    if (mxVal) mxVal.textContent = `10 ${mailHost}.`;
    if (aVal) aVal.textContent = ip;
    if (spfVal) spfVal.textContent = `"v=spf1 mx a:${mailHost} ~all"`;
    if (dkimVal) dkimVal.textContent = `"v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA... [автогенерация в панели]"`;
    if (dmarcVal) dmarcVal.textContent = `"v=DMARC1; p=quarantine; sp=quarantine; rua=mailto:postmaster@${domain}; pct=100"`;
    if (autoVal) autoVal.textContent = `${mailHost}.`;
    if (stsVal) stsVal.textContent = `"v=STSv1; id=20260901001"`;
    if (tlsRptVal) tlsRptVal.textContent = `"v=TLSRPTv1; rua=mailto:tls-reports@${domain}"`;
  }

  domainInput.addEventListener('input', () => {
    if (hostInput && hostInput.getAttribute('data-user-modified') !== 'true') {
      const d = domainInput.value.trim().toLowerCase() || 'example.com';
      hostInput.value = `mail.${d}`;
    }
    updateDns();
  });

  if (hostInput) {
    hostInput.addEventListener('input', () => {
      hostInput.setAttribute('data-user-modified', 'true');
      updateDns();
    });
  }

  if (ipInput) {
    ipInput.addEventListener('input', updateDns);
  }

  updateDns();
}

// 6. Docs Live Search Filter
function initDocsSearch() {
  const searchInput = document.getElementById('docsSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const links = document.querySelectorAll('.docs-nav-links a');
    const sections = document.querySelectorAll('.docs-content section');

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        link.style.display = 'block';
      } else {
        link.style.display = 'none';
      }
    });

    if (q.length > 2) {
      sections.forEach(sec => {
        const text = sec.innerText.toLowerCase();
        if (text.includes(q)) {
          sec.style.opacity = '1';
        } else {
          sec.style.opacity = '0.35';
        }
      });
    } else {
      sections.forEach(sec => {
        sec.style.opacity = '1';
      });
    }
  });
}

// 7. Live Demo Dynamic Configuration from /demo-config.json
const DEFAULT_DEMO_CONFIG = {
  free_url: "https://free.demo.mgate.pro",
  free_admin_email: "admin@free.demo.mgate.pro",
  free_admin_password: "adminpassword2026",
  free_user_email: "user1@free.mgate",
  free_user_password: "MailboxPassword2026!",

  pro_url: "https://pro.demo.mgate.pro",
  pro_admin_email: "admin@pro.demo.mgate.pro",
  pro_admin_password: "adminpassword2026",
  pro_user_email: "user1@corp.mgate",
  pro_user_password: "MailboxPassword2026!"
};

async function initDemoConfig() {
  let cfg = { ...DEFAULT_DEMO_CONFIG };
  try {
    const res = await fetch('/demo-config.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      for (const [k, v] of Object.entries(data)) {
        if (v && typeof v === 'string' && !v.startsWith('${')) {
          cfg[k] = v;
        }
      }
    }
  } catch (e) {
    // Keep default config
  }

  // Update text
  document.querySelectorAll('[data-demo-var]').forEach(el => {
    const v = el.getAttribute('data-demo-var');
    if (cfg[v]) el.textContent = cfg[v];
  });

  // Update links
  document.querySelectorAll('[data-demo-href]').forEach(el => {
    const v = el.getAttribute('data-demo-href');
    if (cfg[v]) el.setAttribute('href', cfg[v]);
  });

  // Update copy attributes
  document.querySelectorAll('[data-demo-copy]').forEach(el => {
    const v = el.getAttribute('data-demo-copy');
    if (cfg[v]) el.setAttribute('data-copy-text', cfg[v]);
  });
}
