document.addEventListener("DOMContentLoaded", () => {
  function initFacetFilters() {
    const filterForms = document.querySelectorAll("facet-filters-form form");

    filterForms.forEach((form) => {
      form.addEventListener("change", () => {

        const url = new URL(window.location.href);
        const formData = new FormData(form);

        for (const [key, value] of formData) {
          url.searchParams.set(key, value);
        }

        fetch(url.toString(), {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const newProducts = doc.querySelector("#ProductGridContainer");

          if (newProducts) {
            document.querySelector("#ProductGridContainer").innerHTML =
              newProducts.innerHTML;

            // Reinitialize events
            initFacetFilters();
          }
        });

      });
    });
  }

  initFacetFilters();
});