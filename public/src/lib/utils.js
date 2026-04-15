/**
 * Remove o redimensionamento do Dropdown ao scrollar do Bootstrap com configurações personalizadas do popper.
 * @param {HTMLElement} toggleElement - O elemento de botão que aciona o dropdown.
 */
function fixBootstrapDropdownScroll(toggleElement) {
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

export { fixBootstrapDropdownScroll };
