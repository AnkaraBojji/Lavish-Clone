document.addEventListener('DOMContentLoaded', () => {

    // ── 1. NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // ── 2. MENU FILTER ──
    const menuTags = document.querySelectorAll('.menu-tag');
    const menuCards = document.querySelectorAll('.menu-card');

    if (menuTags.length && menuCards.length) {
        menuCards.forEach(card => {
            card.style.removeProperty('display');
        });

        menuTags.forEach(tag => {
            tag.addEventListener('click', () => {
                menuTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                const filter = tag.getAttribute('data-filter');

                menuCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.style.removeProperty('display');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ── 3. SCROLL REVEAL ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ── 4. GALLERY LIGHTBOX ──
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length) {
        const lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
            <img src="" alt="Gallery image" />
            <button class="lightbox-next" aria-label="Next">&#8250;</button>
        `;
        document.body.appendChild(lb);

        let cur = 0;
        const imgs = Array.from(galleryItems).map(i => i.src);
        const lbImg = lb.querySelector('img');

        const openLb = idx => { cur = idx; lbImg.src = imgs[cur]; lb.classList.add('active'); document.body.style.overflow = 'hidden'; };
        const closeLb = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
        const showPrev = () => { cur = (cur - 1 + imgs.length) % imgs.length; lbImg.src = imgs[cur]; };
        const showNext = () => { cur = (cur + 1) % imgs.length; lbImg.src = imgs[cur]; };

        galleryItems.forEach((img, i) => {
            img.parentElement.parentElement.addEventListener('click', () => openLb(i));
        });
        lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
        lb.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        lb.querySelector('.lightbox-next').addEventListener('click', showNext);
        lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('active')) return;
            if (e.key === 'Escape') closeLb();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    // ── 5. ACTIVE NAV LINK ──
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === page) {
            link.style.color = 'var(--gold)';
        }
    });

    // ── 6. CLOSE MOBILE NAV ON OUTSIDE CLICK ──
    document.addEventListener('click', e => {
        const links = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (links && links.classList.contains('show-mobile') &&
            !links.contains(e.target) && !hamburger.contains(e.target)) {
            links.classList.remove('show-mobile');
        }
    });
});

// ── FORMSPREE ENDPOINT ──
const FORMSPREE_URL = 'https://formspree.io/f/xkopokvl';

// ── TOAST NOTIFICATION ──
function showToast(msg, isError = false) {
    let toast = document.getElementById('lavish-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'lavish-toast';
        toast.style.cssText = `
            position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(80px);
            background:#1a1812;border:1px solid rgba(201,168,76,0.4);color:#f5f0e8;
            padding:14px 26px;font-family:'Jost',sans-serif;font-size:0.85rem;
            z-index:99999;transition:transform 0.4s ease,opacity 0.4s;opacity:0;
            display:flex;align-items:center;gap:10px;letter-spacing:0.5px;
        `;
        document.body.appendChild(toast);
    }
    const icon = isError ? '✗' : '✓';
    const color = isError ? '#e05555' : '#C9A84C';
    toast.innerHTML = `<span style="color:${color};font-size:1.1rem;">${icon}</span> ${msg}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(80px)';
    }, 4000);
}

// ── FORM DATA COLLECTOR ──
function collectFormData(container) {
    return {
        name: container.querySelector('input[type="text"]')?.value.trim() || '',
        phone: container.querySelector('input[type="tel"]')?.value.trim() || '',
        persons: container.querySelector('select')?.value || '',
        date: container.querySelector('input[type="date"]')?.value || '',
        time: container.querySelector('input[type="time"]')?.value || '',
        requirements: container.querySelector('textarea')?.value.trim() || '',
    };
}

// ── FORM VALIDATOR ──
function validateForm(data, container) {
    let valid = true;
    const fields = ['text', 'tel', 'date', 'time'];
    fields.forEach(type => {
        const el = container.querySelector(`input[type="${type}"]`);
        if (!el) return;
        el.style.borderColor = '';
        if (!el.value.trim()) {
            el.style.borderColor = 'rgba(200,80,80,0.7)';
            valid = false;
        }
    });
    // check select
    const select = container.querySelector('select');
    if (select && !select.value) {
        select.style.borderColor = 'rgba(200,80,80,0.7)';
        valid = false;
    }
    return valid;
}

// ── RESET FORM ──
function resetForm(container) {
    container.querySelectorAll('input:not([type="submit"]), textarea').forEach(f => {
        f.value = '';
        f.style.borderColor = '';
    });
    const select = container.querySelector('select');
    if (select) { select.selectedIndex = 0; select.style.borderColor = ''; }
}

// ── SUBMIT TO FORMSPREE ──
async function submitToFormspree(data, btn) {
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok && result.ok) {
            return true;
        } else {
            console.error('Formspree error:', result);
            return false;
        }
    } catch (err) {
        console.error('Network error:', err);
        return false;
    } finally {
        btn.textContent = original;
        btn.disabled = false;
    }
}

// ── BOOKING HANDLER (contact page form) ──
window.handleBooking = async () => {
    const form = document.querySelector('.booking-section .booking-form, .booking .booking-form');
    if (!form) return;

    const data = collectFormData(form);
    if (!validateForm(data, form)) {
        showToast('Please fill in all required fields.', true);
        return;
    }

    const btn = form.querySelector('.btn-book');
    const success = await submitToFormspree(data, btn);

    if (success) {
        showToast('Reservation received! We will call you to confirm.');
        resetForm(form);
    } else {
        showToast('Something went wrong. Please call 033 858 8350.', true);
    }
};

// ── MODAL BOOKING HANDLER ──
window.handleModalBooking = async () => {
    const modal = document.querySelector('.modal');
    if (!modal) return;

    const data = collectFormData(modal);
    if (!validateForm(data, modal)) {
        showToast('Please fill in all required fields.', true);
        return;
    }

    const btn = modal.querySelector('.btn-book');
    const success = await submitToFormspree(data, btn);

    if (success) {
        window.closeModal();
        setTimeout(() => showToast('Reservation received! We will contact you shortly.'), 400);
        resetForm(modal);
    } else {
        showToast('Something went wrong. Please call 033 858 8350.', true);
    }
};

// ── MODAL CONTROLS ──
window.openModal = () => {
    document.getElementById('reservationModal').classList.add('active');
    document.body.style.overflow = 'hidden';
};
window.closeModal = () => {
    document.getElementById('reservationModal').classList.remove('active');
    document.body.style.overflow = '';
};
window.closeModalOutside = e => {
    if (e.target === document.getElementById('reservationModal')) window.closeModal();
};

// ── MOBILE NAV ──
window.toggleMobile = () => {
    const l = document.querySelector('.nav-links');
    if (l) l.classList.toggle('show-mobile');
};