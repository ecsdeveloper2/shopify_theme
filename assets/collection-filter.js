document.addEventListener("DOMContentLoaded", () => {
  const facetForm = document.querySelector("facet-filters-form form");

  const handleFilterChange = () => {
    const url = new URL(facetForm.action);
    const formData = new FormData(facetForm);

    // Add selected params to URL
    for (const [key, value] of formData.entries()) {
      url.searchParams.append(key, value);
    }

    fetch(url.toString(), {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const newGrid = doc.querySelector("#ProductGridContainer");
        const newFilters = doc.querySelector("#ActiveFiltersBox");

        if (newGrid && newFilters) {
          document.querySelector("#ProductGridContainer").innerHTML =
            newGrid.innerHTML;
          document.querySelector("#ActiveFiltersBox").innerHTML =
            newFilters.innerHTML;
        }

        attachRemoveFilterEvents(); // Reattach events after DOM update
      });
  };

  // Listen to all inputs
  facetForm?.addEventListener("change", handleFilterChange);

  const attachRemoveFilterEvents = () => {
    document.querySelectorAll(".remove-filter").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parent = e.target.closest(".active-filter-item");
        const param = parent.getAttribute("data-param");
        const value = parent.getAttribute("data-value");

        // Find and uncheck the corresponding input
        const input = facetForm.querySelector(
          `[name="${param}"][value="${value}"]`
        );
        if (input) {
          input.checked = false;
          handleFilterChange();
        }
      });
    });
  };

  attachRemoveFilterEvents();
});
