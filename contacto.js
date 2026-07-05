/* ===============================
   CONTACTO - VALIDACIONES Y ENVÍO
================================ */

(function() {
  'use strict';

  // Variables del formulario
  let contactFormElement = null;
  let successMsgElement = null;
  let errorMsgElement = null;

  // Expresiones regulares para validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{8,15}$/;

  /**
   * Validar un campo individual
   */
  function validateField(field, errorElement, validationFn) {
    const value = field.value.trim();
    const isValid = validationFn(value);

    if (isValid) {
      errorElement.classList.remove('active');
      return true;
    } else {
      errorElement.classList.add('active');
      return false;
    }
  }

  /**
   * Validar todo el formulario
   */
  function validateForm() {
    const nombre = document.getElementById('contactNombre');
    const apellido = document.getElementById('contactApellido');
    const correo = document.getElementById('contactCorreo');
    const telefono = document.getElementById('contactTelefono');
    const comentario = document.getElementById('contactComentario');

    const errNombre = document.getElementById('errContactNombre');
    const errApellido = document.getElementById('errContactApellido');
    const errCorreo = document.getElementById('errContactCorreo');
    const errTelefono = document.getElementById('errContactTelefono');
    const errComentario = document.getElementById('errContactComentario');

    // Validar cada campo
    const isNombreValid = validateField(nombre, errNombre, val => val.length > 0);
    const isApellidoValid = validateField(apellido, errApellido, val => val.length > 0);
    const isCorreoValid = validateField(correo, errCorreo, val => emailRegex.test(val));
    const isTelefonoValid = validateField(telefono, errTelefono, val => phoneRegex.test(val));
    const isComentarioValid = validateField(comentario, errComentario, val => val.length > 0);

    return isNombreValid && isApellidoValid && isCorreoValid && isTelefonoValid && isComentarioValid;
  }

  /**
   * Mostrar mensaje de éxito
   */
  function showSuccessMessage() {
    if (!successMsgElement) return;

    successMsgElement.classList.add('active');

    setTimeout(() => {
      successMsgElement.classList.remove('active');
    }, 3000);
  }

  /**
   * Mostrar mensaje de error
   */
  function showErrorMessage() {
    if (!errorMsgElement) return;

    errorMsgElement.classList.add('active');

    setTimeout(() => {
      errorMsgElement.classList.remove('active');
    }, 3000);
  }

  /**
   * Resetear todos los errores
   */
  function resetErrors() {
    const errorElements = document.querySelectorAll('.contact-error-text');
    errorElements.forEach(el => el.classList.remove('active'));
  }

  /**
   * Manejar el envío del formulario
   */
  function handleSubmit(e) {
    e.preventDefault();

    // Reset errores previos
    resetErrors();

    // Validar formulario
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Obtener datos del formulario
    const formData = {
      nombre: document.getElementById('contactNombre').value.trim(),
      apellido: document.getElementById('contactApellido').value.trim(),
      correo: document.getElementById('contactCorreo').value.trim(),
      telefono: document.getElementById('contactTelefono').value.trim(),
      comentario: document.getElementById('contactComentario').value.trim()
    };

    // Simular envío AJAX
    // En producción, reemplaza esto con tu endpoint real
    simulateAjaxSubmit(formData)
      .then(() => {
        // Éxito: limpiar formulario y mostrar mensaje
        contactFormElement.reset();
        resetTextareaHeight();
        resetErrors();
        showSuccessMessage();
      })
      .catch(() => {
        // Error: mostrar mensaje de error
        showErrorMessage();
      });
  }

  /**
   * Simular envío AJAX
   * En producción, reemplaza con fetch() o XMLHttpRequest
   */
  function simulateAjaxSubmit(data) {
    return new Promise((resolve, reject) => {
      // Simular delay de red
      setTimeout(() => {
        // Simular éxito (95% del tiempo)
        if (Math.random() > 0.05) {
          resolve({ success: true });
        } else {
          reject({ error: 'Error de conexión' });
        }
      }, 800);
    });
  }

  /**
   * Auto-resize del textarea: arranca en una línea y crece con el contenido
   */
  const TEXTAREA_MAX_HEIGHT = 200; // px, sincronizado con max-height en contacto.css

  function autoResizeTextarea(textarea) {
    const previousHeight = textarea.offsetHeight;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
    textarea.style.overflowY = textarea.scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
    return textarea.offsetHeight !== previousHeight;
  }

  /**
   * Mantener visible el botón de enviar cuando el textarea crece
   * (el card .about-card es el contenedor scrolleable)
   */
  function scrollSubmitIntoView() {
    if (!contactFormElement) return;
    const submitBtn = contactFormElement.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Diferir al siguiente frame: el scroll nativo que revela el caret tras
    // insertar texto cancela cualquier scroll suave lanzado dentro del input
    requestAnimationFrame(() => {
      submitBtn.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  function resetTextareaHeight() {
    if (!contactFormElement) return;
    const textarea = contactFormElement.querySelector('textarea');
    if (textarea) {
      textarea.style.height = '';
      textarea.style.overflowY = '';
    }
  }

  /**
   * Inicializar el formulario de contacto
   */
  function initContactForm() {
    contactFormElement = document.getElementById('contactForm');
    successMsgElement = document.getElementById('contactSuccessMsg');
    errorMsgElement = document.getElementById('contactErrorMsg');

    if (!contactFormElement) {
      console.warn('Formulario de contacto no encontrado');
      return;
    }

    // Agregar event listener para el submit
    contactFormElement.addEventListener('submit', handleSubmit);

    // Auto-resize del comentario (guard: initContactForm se re-llama al abrir el overlay)
    const textarea = contactFormElement.querySelector('textarea');
    if (textarea && !textarea.dataset.autoResize) {
      textarea.dataset.autoResize = 'true';
      textarea.addEventListener('input', () => {
        const heightChanged = autoResizeTextarea(textarea);
        if (heightChanged) {
          scrollSubmitIntoView();
        }
      });
    }

    // Validación en tiempo real (opcional)
    const inputs = contactFormElement.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        const errorId = 'err' + this.id.charAt(0).toUpperCase() + this.id.slice(1);
        const errorElement = document.getElementById(errorId);

        if (errorElement) {
          const value = this.value.trim();

          // Determinar tipo de validación según el campo
          let isValid = false;
          if (this.type === 'email') {
            isValid = emailRegex.test(value);
          } else if (this.type === 'tel') {
            isValid = phoneRegex.test(value);
          } else {
            isValid = value.length > 0;
          }

          if (isValid) {
            errorElement.classList.remove('active');
          }
        }
      });
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

  // Reinicializar cuando se abre el overlay de contacto
  // (útil si el formulario se carga dinámicamente)
  window.reinitContactForm = initContactForm;

})();
