document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll("quantity-input")
    .forEach(function (quantityWrapper) {
      const minusBtn = quantityWrapper.querySelector('button[name="minus"]');
      const plusBtn = quantityWrapper.querySelector('button[name="plus"]');
      const input = quantityWrapper.querySelector('input[type="number"]');

      const min = parseInt(input.getAttribute("min")) || 1;
      const max = parseInt(input.getAttribute("max")) || Infinity;
      const step = parseInt(input.getAttribute("step")) || 1;

      minusBtn.addEventListener("click", function () {
        let currentVal = parseInt(input.value);
        if (!isNaN(currentVal) && currentVal > min) {
          input.value = currentVal - step;
          input.dispatchEvent(new Event("change"));
        }
      });

      plusBtn.addEventListener("click", function () {
        let currentVal = parseInt(input.value);
        if (!isNaN(currentVal) && currentVal < max) {
          input.value = currentVal + step;
          input.dispatchEvent(new Event("change"));
        }
      });
    });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("ToggleDescription");
  const shortDesc = document.querySelector(".description-short");
  const fullDesc = document.querySelector(".description-full");

  if (toggleBtn && shortDesc && fullDesc) {
    toggleBtn.addEventListener("click", function () {
      const isExpanded = fullDesc.style.display === "block";

      fullDesc.style.display = isExpanded ? "none" : "block";
      shortDesc.style.display = isExpanded ? "block" : "none";
      toggleBtn.textContent = isExpanded ? "Read more" : "Read less";
    });
  }
});