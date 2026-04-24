// --- CUSTOM CURSOR (solo efecto visual, no oculta el cursor nativo) ---
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (cursor) {
        cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    }
    
    setTimeout(() => {
        followerX = mouseX;
        followerY = mouseY;
        if (cursorFollower) {
            cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        }
    }, 80);
});

// Ocultar efectos cuando el mouse sale de la ventana
document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorFollower) cursorFollower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorFollower) cursorFollower.style.opacity = '0.5';
});

// Efecto hover en elementos clickeables
const clickableElements = document.querySelectorAll('a, button, .project-card, .btn-primary, .cerrar-modal, nav a');
clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1.5)`;
        if (cursorFollower) {
            cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px) scale(1.3)`;
            cursorFollower.style.borderColor = 'var(--primary)';
            cursorFollower.style.backgroundColor = 'rgba(251, 54, 64, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px) scale(1)`;
        if (cursorFollower) {
            cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px) scale(1)`;
            cursorFollower.style.backgroundColor = 'transparent';
        }
    });
});

// --- OJOS QUE SIGUEN EL MOUSE ---
const eyes = document.querySelectorAll('.eye');
document.addEventListener('mousemove', (e) => {
    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeX = rect.left + rect.width / 2;
        const eyeY = rect.top + rect.height / 2;
        
        // Calcular ángulo entre el mouse y el centro del ojo
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        
        // Radio de movimiento de la pupila
        const distance = 12; 
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        const pupil = eye.querySelector('.pupil');
        if (pupil) {
            pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        }
    });
});

// --- MODAL CON ANIMACIONES ---
const modal = document.getElementById('modal-proyecto');
const detalleProyecto = document.getElementById('detalle-proyecto');
let isClosing = false;
let currentImgIndex = 0;
let currentImages = [];

function updateCarousel() {
    const images = document.querySelectorAll('.img-modal');
    images.forEach((img, index) => {
        img.classList.toggle('active', index === currentImgIndex);
    });
}

function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % currentImages.length;
    updateCarousel();
}

function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + currentImages.length) % currentImages.length;
    updateCarousel();
}

function abrirModal(proyectoId) {
    if (isClosing) return;
    
    detalleProyecto.innerHTML = '';
    currentImgIndex = 0;
    
    const proyectos = {
        'sistema-inventario': {
            titulo: 'Control de Pagos - Terrenos',
            imagenes: ['1.jpg', '4.jpg', '5.jpg'],
            descripcion: `
                <h2 style="color: var(--primary); margin-bottom: 20px;">Control de Pagos de Terrenos</h2>
                <p style="color: var(--text-dim); line-height: 1.8; margin-bottom: 20px;">
                    Este sistema nació para ayudar a llevar el orden de los abonos y saldos de un terreno de forma sencilla. Fue mi primer gran proyecto donde aprendí a conectar ideas con código real usando Django y a crear una página que fuera fácil de usar.
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
                    <span class="tag">Python</span>
                    <span class="tag">Django</span>
                    <span class="tag">Orden y Control</span>
                </div>
            `
        },
        'analizador-memoria': {
            titulo: 'Explorador de Memoria (RAM)',
            imagenes: ['LectorRam/1.png', 'LectorRam/2.jpg', 'LectorRam/3.jpg'],
            descripcion: `
                <h2 style="color: var(--primary); margin-bottom: 20px;">Explorador de Memoria RAM</h2>
                <p style="color: var(--text-dim); line-height: 1.8; margin-bottom: 20px;">
                    Me dio curiosidad saber qué guarda una computadora mientras está encendida, así que creé esta herramienta en C++. Sirve para "asomarse" a la memoria RAM y encontrar datos importantes como textos o direcciones, ayudando a entender mejor cómo viaja la información.
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
                    <span class="tag">C++</span>
                    <span class="tag">Curiosidad Técnica</span>
                    <span class="tag">Seguridad</span>
                </div>
            `
        }
    };
    
    const proyecto = proyectos[proyectoId];
    if (proyecto) {
        currentImages = proyecto.imagenes;
        
        // Crear Contenedor del Carrusel
        const carousel = document.createElement('div');
        carousel.className = 'carousel-container';
        
        // Crear Imágenes
        proyecto.imagenes.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = `imagenes/${imgSrc}`;
            img.alt = proyecto.titulo;
            img.className = `img-modal ${index === 0 ? 'active' : ''}`;
            carousel.appendChild(img);
        });
        
        // Botones de Navegación
        if (proyecto.imagenes.length > 1) {
            const btnPrev = document.createElement('button');
            btnPrev.innerHTML = '&#10094;';
            btnPrev.className = 'carousel-btn prev';
            btnPrev.onclick = (e) => { e.stopPropagation(); prevImage(); };
            
            const btnNext = document.createElement('button');
            btnNext.innerHTML = '&#10095;';
            btnNext.className = 'carousel-btn next';
            btnNext.onclick = (e) => { e.stopPropagation(); nextImage(); };
            
            carousel.appendChild(btnPrev);
            carousel.appendChild(btnNext);
        }
        
        const contenidoDiv = document.createElement('div');
        contenidoDiv.innerHTML = proyecto.descripcion;
        
        detalleProyecto.appendChild(carousel);
        detalleProyecto.appendChild(contenidoDiv);
    }
    
    modal.style.display = 'flex';
    modal.offsetHeight; // force reflow
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    if (isClosing) return;
    isClosing = true;
    
    modal.classList.add('closing');
    
    setTimeout(() => {
        modal.classList.remove('show');
        modal.classList.remove('closing');
        modal.style.display = 'none';
        isClosing = false;
        document.body.style.overflow = '';
    }, 300);
}

// Eventos del modal
const cerrarBtn = document.querySelector('.cerrar-modal');
if (cerrarBtn) cerrarBtn.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) cerrarModal();
});

// --- SCROLL REVEAL ---
function revealElements() {
    const elements = document.querySelectorAll('section, .project-card, .timeline-item, .contact-box');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('revealed');
        }
    });
}
window.addEventListener('load', revealElements);
window.addEventListener('scroll', revealElements);
window.addEventListener('resize', revealElements);

// --- TERMINAL INTERACTIVO (funcionalidad básica) ---
const terminalInput = document.getElementById('terminal-input');
const terminalHistory = document.getElementById('terminal-history');
const typedTextSpan = document.getElementById('typed-text');
let currentInput = '';
let commandHistory = [];
let historyIndex = -1;

// Observador para scroll automático pegajoso
const scrollObserver = new MutationObserver(() => {
    terminalHistory.scrollTop = terminalHistory.scrollHeight;
});
scrollObserver.observe(terminalHistory, { childList: true, subtree: true });

const commands = {
    help: 'Puedes probar con: help, quien_soy, habilidades, proyectos, contacto, clear',
    quien_soy: 'Soy Andrés, un apasionado por la tecnología que busca resolver problemas de forma creativa.',
    habilidades: 'Me muevo bien con Python, Django, Redes y cuidando que los sistemas sean seguros.',
    proyectos: 'Echa un vistazo a la sección "Cosas que he creado" un poco más abajo.',
    contacto: 'Escríbeme con confianza a cv_aim@hotmail.com',
    clear: 'CLEAR'
};

function addToHistory(command, output) {
    const historyLine = document.createElement('div');
    historyLine.className = 't-history-line';
    historyLine.innerHTML = `<span class="t-prompt">andres@fime:~$</span> <span class="typed-cmd">${command}</span>`;
    terminalHistory.appendChild(historyLine);
    
    if (output) {
        const outputLine = document.createElement('div');
        outputLine.className = 't-output-line';
        outputLine.innerHTML = output;
        terminalHistory.appendChild(outputLine);
    }
    
    // Auto-scroll al final
    terminalHistory.scrollTo({
        top: terminalHistory.scrollHeight,
        behavior: 'smooth'
    });
}

function processCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    let output = '';
    
    if (trimmed === '') return;
    
    if (commands[trimmed]) {
        if (trimmed === 'clear') {
            terminalHistory.innerHTML = '';
            return;
        }
        output = commands[trimmed];
    } else {
        output = `Comando no reconocido: ${cmd}. Escribe "help" para ver comandos disponibles.`;
    }
    
    addToHistory(cmd, output);
}

function simulateTyping(text, callback) {
    let i = 0;
    typedTextSpan.textContent = '';
    function type() {
        if (i < text.length) {
            typedTextSpan.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else if (callback) {
            callback();
        }
    }
    type();
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = currentInput;
        processCommand(cmd);
        currentInput = '';
        typedTextSpan.textContent = '';
        terminalInput.value = '';
    } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        typedTextSpan.textContent = currentInput;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
            typedTextSpan.textContent = currentInput;
            terminalInput.value = currentInput;
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            currentInput = commandHistory[commandHistory.length - 1 - historyIndex];
            typedTextSpan.textContent = currentInput;
            terminalInput.value = currentInput;
        } else if (historyIndex === 0) {
            historyIndex = -1;
            currentInput = '';
            typedTextSpan.textContent = '';
            terminalInput.value = '';
        }
    }
});

terminalInput.addEventListener('input', (e) => {
    currentInput = e.target.value;
    typedTextSpan.textContent = currentInput;
});

// Enfocar la terminal al hacer clic en la tarjeta
const terminalCard = document.getElementById('terminal-clickable');
if (terminalCard) {
    terminalCard.addEventListener('click', () => {
        terminalInput.focus();
    });
}

// Mensaje de bienvenida
window.addEventListener('load', () => {
    const welcome = `
        <div class="welcome-header">═══════════════════════════════════════</div>
        <div class="t-output-line">¡Hola! Bienvenido a mi rincón digital.</div>
        <div class="t-output-line">Escribe ${'<span class="welcome-hint">"help"</span>'} para ver qué puedes hacer aquí.</div>
        <div class="welcome-header">═══════════════════════════════════════</div>
    `;
    terminalHistory.innerHTML = welcome;
    terminalInput.focus();
});