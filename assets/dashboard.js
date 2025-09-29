(() => {
  const messageToggle = document.getElementById('messageToggle');
  const messagePanel = document.getElementById('messagePanel');
  const userToggle = document.getElementById('userToggle');
  const userMenu = document.getElementById('userMenu');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarNav = document.getElementById('sidebarNav');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileMediaQuery = window.matchMedia('(max-width: 900px)');

  function setSidebarVisibility(isVisible) {
    if (!sidebarNav) return;
    sidebarNav.classList.toggle('open', isVisible);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', isVisible.toString());
    }
    if (sidebarBackdrop) {
      if (isVisible) {
        sidebarBackdrop.hidden = false;
      } else {
        sidebarBackdrop.hidden = true;
      }
    }
    document.body.classList.toggle('menu-open', isVisible);
  }

  function closeSidebar({ focusToggle = false } = {}) {
    if (!sidebarNav) return;
    setSidebarVisibility(false);
    if (focusToggle && menuToggle && mobileMediaQuery.matches) {
      menuToggle.focus();
    }
  }

  function openSidebar() {
    if (!sidebarNav) return;
    setSidebarVisibility(true);
  }

  function resetSidebarForDesktop() {
    if (!sidebarNav) return;
    if (!mobileMediaQuery.matches) {
      closeSidebar();
    }
  }

  if (menuToggle && sidebarNav) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !sidebarNav.classList.contains('open');
      if (willOpen) {
        openSidebar();
        closeMessagePanel();
        closeUserMenu();
      } else {
        closeSidebar();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => closeSidebar({ focusToggle: true }));
  }

  if (sidebarNav) {
    sidebarNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMediaQuery.matches) {
          closeSidebar();
        }
      });
    });
  }

  if (mobileMediaQuery.addEventListener) {
    mobileMediaQuery.addEventListener('change', resetSidebarForDesktop);
  } else if (mobileMediaQuery.addListener) {
    mobileMediaQuery.addListener(resetSidebarForDesktop);
  }

  resetSidebarForDesktop();

  function closeMessagePanel() {
    if (messagePanel) {
      messagePanel.classList.remove('active');
      messagePanel.setAttribute('aria-hidden', 'true');
    }
    if (messageToggle) {
      messageToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function closeUserMenu() {
    if (userMenu) {
      userMenu.classList.remove('active');
      userMenu.setAttribute('aria-hidden', 'true');
    }
    if (userToggle) {
      userToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (messageToggle && messagePanel) {
    messageToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = messagePanel.classList.toggle('active');
      messagePanel.setAttribute('aria-hidden', (!isOpen).toString());
      messageToggle.setAttribute('aria-expanded', isOpen.toString());
      if (isOpen) {
        closeUserMenu();
      }
    });
  }

  if (userToggle && userMenu) {
    userToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = userMenu.classList.toggle('active');
      userToggle.setAttribute('aria-expanded', isOpen.toString());
      userMenu.setAttribute('aria-hidden', (!isOpen).toString());
      if (isOpen) {
        closeMessagePanel();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (messagePanel && messageToggle) {
      if (!messagePanel.contains(event.target) && !messageToggle.contains(event.target)) {
        closeMessagePanel();
      }
    }

    if (userMenu && userToggle) {
      if (!userMenu.contains(event.target) && !userToggle.contains(event.target)) {
        closeUserMenu();
      }
    }

    if (sidebarNav && menuToggle && sidebarNav.classList.contains('open')) {
      if (!sidebarNav.contains(event.target) && !menuToggle.contains(event.target)) {
        closeSidebar();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMessagePanel();
      closeUserMenu();
      closeSidebar({ focusToggle: true });
    }
  });

  const radarCanvas = document.getElementById('memberRadar');
  if (radarCanvas && window.Chart) {
    new Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: ['资源协同', '交付能力', '创新能力', '活动响应', '信用体系'],
        datasets: [
          {
            label: '会员评分',
            data: [4.8, 4.5, 4.2, 4.9, 4.7],
            backgroundColor: 'rgba(78, 45, 142, 0.2)',
            borderColor: 'rgba(78, 45, 142, 0.7)',
            pointBackgroundColor: '#4e2d8e',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 5,
            ticks: { display: false },
            grid: { color: 'rgba(78, 45, 142, 0.1)' },
            angleLines: { color: 'rgba(78, 45, 142, 0.1)' },
            pointLabels: { font: { size: 12 } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  const eventModal = document.getElementById('eventModal');
  const openEventModal = document.getElementById('openEventModal');
  const closeEventModal = document.getElementById('closeEventModal');
  const prevStepButton = document.getElementById('prevStep');
  const nextStepButton = document.getElementById('nextStep');
  const modalSteps = eventModal ? Array.from(eventModal.querySelectorAll('.modal-step')) : [];
  const stepDots = eventModal ? Array.from(eventModal.querySelectorAll('.step-dot')) : [];
  let currentStep = 0;

  function updateStep(newStep) {
    if (!eventModal) return;
    currentStep = Math.max(0, Math.min(modalSteps.length - 1, newStep));
    modalSteps.forEach((step, index) => step.classList.toggle('active', index === currentStep));
    stepDots.forEach((dot, index) => dot.classList.toggle('active', index === currentStep));
    if (prevStepButton) {
      prevStepButton.disabled = currentStep === 0;
    }
    if (nextStepButton) {
      nextStepButton.textContent = currentStep === modalSteps.length - 1 ? '提交申请' : '下一步';
    }
  }

  if (openEventModal && eventModal) {
    openEventModal.addEventListener('click', () => {
      eventModal.classList.add('active');
      updateStep(0);
    });
  }

  if (closeEventModal && eventModal) {
    closeEventModal.addEventListener('click', () => {
      eventModal.classList.remove('active');
    });
  }

  if (prevStepButton) {
    prevStepButton.addEventListener('click', () => updateStep(currentStep - 1));
  }

  if (nextStepButton) {
    nextStepButton.addEventListener('click', () => {
      if (currentStep === modalSteps.length - 1) {
        if (eventModal) {
          eventModal.classList.remove('active');
        }
        alert('活动申请已提交，我们会在 24 小时内与您联系。');
      } else {
        updateStep(currentStep + 1);
      }
    });
  }

  if (eventModal) {
    eventModal.addEventListener('click', (event) => {
      if (event.target === eventModal) {
        eventModal.classList.remove('active');
      }
    });
  }

  stepDots.forEach((dot, index) => {
    dot.addEventListener('click', () => updateStep(index));
  });

  const detailDrawer = document.getElementById('detailDrawer');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerSummary = document.getElementById('drawerSummary');
  const drawerTags = document.getElementById('drawerTags');
  const drawerList = document.getElementById('drawerList');
  const closeDrawer = document.getElementById('closeDrawer');

  function openDrawer({ name, summary, tags, points }) {
    if (!detailDrawer) return;
    if (drawerTitle) {
      drawerTitle.textContent = name || '画像详情';
    }
    if (drawerSummary) {
      drawerSummary.textContent = summary || '';
    }
    if (drawerTags) {
      drawerTags.innerHTML = '';
      (tags || []).forEach((tag) => {
        if (!tag) return;
        const span = document.createElement('span');
        span.className = 'chip';
        span.textContent = tag.trim();
        drawerTags.appendChild(span);
      });
    }
    if (drawerList) {
      drawerList.innerHTML = '';
      (points || []).forEach((point) => {
        if (!point) return;
        const li = document.createElement('li');
        li.textContent = point.trim();
        drawerList.appendChild(li);
      });
    }
    detailDrawer.classList.add('active');
    detailDrawer.setAttribute('aria-hidden', 'false');
  }

  document.querySelectorAll('.market-card .detail-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const dataset = event.currentTarget.dataset;
      openDrawer({
        name: dataset.name,
        summary: dataset.summary,
        tags: (dataset.tags || '').split(';'),
        points: (dataset.points || '').split(';'),
      });
    });
  });

  if (closeDrawer && detailDrawer) {
    closeDrawer.addEventListener('click', () => {
      detailDrawer.classList.remove('active');
      detailDrawer.setAttribute('aria-hidden', 'true');
    });
  }

  if (detailDrawer) {
    detailDrawer.addEventListener('click', (event) => {
      if (event.target === detailDrawer) {
        detailDrawer.classList.remove('active');
        detailDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMessagePanel();
      closeUserMenu();
      if (eventModal) {
        eventModal.classList.remove('active');
      }
      if (detailDrawer) {
        detailDrawer.classList.remove('active');
        detailDrawer.setAttribute('aria-hidden', 'true');
      }
    }
  });
})();
