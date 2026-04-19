/**
 * Remove o redimensionamento do Dropdown ao scrollar do Bootstrap com configurações personalizadas do popper.
 * @param {HTMLElement} toggleElement - O elemento de botão que aciona o dropdown.
 */
export function fixBootstrapDropdownScroll(toggleElement) {
  new bootstrap.Dropdown(toggleElement, {
    popperConfig: {
      modifiers: [
        {
          name: "eventListeners",
          options: { scroll: false, resize: false },
        },
      ],
    },
  });
}

/**
 * Limits the execution frequency of a function.
 * * @param {Function} func - The function to execute.
 * @param {number} delay - The delay in milliseconds.
 */
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};
