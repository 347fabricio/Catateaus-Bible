export function header() {
  const header = document.querySelector("nav");
  header.addEventListener("mouseenter", () => {
    header.classList.remove("opacity-0");
    header.classList.add("opacity-100");
  });

  header.addEventListener("mouseleave", () => {
    header.classList.remove("opacity-100");
    header.classList.add("opacity-0");
  });
}
header();
