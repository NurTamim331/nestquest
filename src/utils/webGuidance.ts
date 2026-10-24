/**
 * Modern Web Guidance utilities:
 * 1. validate-input-after-interaction (:user-invalid fallback & aria-invalid sync)
 * 2. light-dismiss-a-dialog (<dialog closedby="any"> fallback for browsers without native closedBy)
 */

export const UserInvalidFallback = (() => {
  const dirtyState = new WeakMap<Element, { hasInteracted: boolean; hasBlurred: boolean }>();

  const updateState = (input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const isValid = input.checkValidity();

    input.classList.toggle('user-invalid-fallback', !isValid);
    input.classList.toggle('user-valid-fallback', isValid);

    if (!isValid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  const handleEvent = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (event.type === 'reset' && target instanceof HTMLFormElement) {
      const controls = Array.from(target.elements);
      for (const control of controls) {
        dirtyState.delete(control);
        control.classList.remove('user-invalid-fallback');
        control.classList.remove('user-valid-fallback');
        control.removeAttribute('aria-invalid');
      }
      return;
    }

    const input = target as HTMLInputElement;
    if (typeof input.checkValidity !== 'function') return;

    if (event.type === 'input' || event.type === 'change') {
      const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
      state.hasInteracted = true;
      dirtyState.set(input, state);
      if (state.hasBlurred) {
        updateState(input);
      }
    } else if (event.type === 'blur') {
      const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
      state.hasBlurred = true;
      dirtyState.set(input, state);
      if (state.hasInteracted) {
        updateState(input);
      }
    }
  };

  const syncAria = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return;
    if (typeof (el as HTMLInputElement).checkValidity !== 'function') return;
    try {
      if (typeof CSS !== 'undefined' && CSS.supports('selector(:user-invalid)')) {
        el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
      }
    } catch {
      // Ignore selector error on older engines
    }
  };

  let initialized = false;
  const init = (root: Document | HTMLElement = document) => {
    if (typeof window === 'undefined' || initialized) return;
    initialized = true;

    // Sync aria-invalid with native :user-invalid state
    root.addEventListener('blur', (e) => syncAria(e.target), true);
    root.addEventListener('input', (e) => {
      if (e.target instanceof HTMLElement && e.target.hasAttribute('aria-invalid')) {
        syncAria(e.target);
      }
    });

    if (typeof CSS !== 'undefined' && CSS.supports('selector(:user-invalid)')) return;

    root.addEventListener('blur', handleEvent, true);
    root.addEventListener('input', handleEvent);
    root.addEventListener('change', handleEvent);
    root.addEventListener('reset', handleEvent, true);
  };

  return { init };
})();

/**
 * Attaches the light-dismiss fallback to a <dialog> element for browsers without native `closedBy` support.
 */
export function attachDialogLightDismiss(dialog: HTMLDialogElement | null, onClose?: () => void) {
  if (!dialog || typeof window === 'undefined') return () => {};

  const handleClose = () => {
    if (onClose) onClose();
  };

  dialog.addEventListener('close', handleClose);

  const handleClick = (event: MouseEvent) => {
    if ('closedBy' in HTMLDialogElement.prototype) return;
    if (event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (isDialogContent) return;
    dialog.close();
  };

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', handleClick);
  }

  return () => {
    dialog.removeEventListener('close', handleClose);
    dialog.removeEventListener('click', handleClick);
  };
}
