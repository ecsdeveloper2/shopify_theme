class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener("click", this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div");
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      );

      this.setAttribute("loaded", true);
      const deferredElement = this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      );
      if (focus) deferredElement.focus();
      if (
        deferredElement.nodeName == "VIDEO" &&
        deferredElement.getAttribute("autoplay")
      ) {
        // force autoplay for safari
        deferredElement.play();
      }

      // Workaround for safari iframe bug
      const formerStyle = deferredElement.getAttribute("style");
      deferredElement.setAttribute("style", "display: block;");
      window.setTimeout(() => {
        deferredElement.setAttribute("style", formerStyle);
      }, 0);
    }
  }
}

customElements.define("deferred-media", DeferredMedia);
document.addEventListener("DOMContentLoaded", () => {
  const productForms = document.querySelectorAll(
    'form[data-type="add-to-cart-form"]'
  );

  productForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cartType =
        form.closest(".product-form-wrapper")?.dataset?.cartType || "drawer";
      const formData = new FormData(form);

    //   try {
    //     const response = await fetch("/cart/add.js", {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //       },
    //       body: formData,
    //     });

    //     const result = await response.json();

    //     if (cartType === "popup") {
    //       openCartPopup(result);
    //     } else {
    //       openCartDrawer(result);
    //     }
    //   } catch (error) {
    //     console.error("Add to cart failed:", error);
    //   }
    // });
  });
});
});
function openCartPopup(product) {
  const popup = document.querySelector("#cart-popup");
  popup.querySelector(".cart-popup-title").innerText = product.product_title;
  popup.querySelector(".cart-popup-image").src = product.image;
  popup.classList.add("active");
}

function openCartDrawer(product) {
  // Optionally fetch full cart contents
  fetch("/cart.js")
    .then((res) => res.json())
    .then((cart) => {
      const drawer = document.querySelector("#cart-drawer");
      drawer.classList.add("open");
      renderCartDrawerItems(cart);
    });
}

function renderCartDrawerItems(cart) {
  const container = document.querySelector("#cart-drawer .cart-items");
  container.innerHTML = ""; // Clear previous
  cart.items.forEach((item) => {
    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" />
        <div>
          <p>${item.product_title}</p>
          <p>Qty: ${item.quantity}</p>
        </div>
      </div>
    `;
  });
}
class ProductRecommendations extends HTMLElement {
  observer = undefined;

  constructor() {
    super();
  }

  connectedCallback() {
    this.initializeRecommendations(this.dataset.productId);
  }

  initializeRecommendations(productId) {
    this.observer?.unobserve(this);
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);
        this.loadRecommendations(productId);
      },
      { rootMargin: "0px 0px 400px 0px" }
    );
    this.observer.observe(this);
  }

  loadRecommendations(productId) {
    fetch(
      `${this.dataset.url}&product_id=${productId}&section_id=${this.dataset.sectionId}`
    )
      .then((response) => response.text())
      .then((text) => {
        const html = document.createElement("div");
        html.innerHTML = text;
        const recommendations = html.querySelector("product-recommendations");
        if (recommendations?.innerHTML.trim().length) {
          this.innerHTML = recommendations.innerHTML;
        }
        if (
          !this.querySelector("slideshow-component") &&
          this.classList.contains("complementary-products")
        ) {
          this.remove();
        }
        if (
          html.querySelector(".grid__item") ||
          this.querySelector(".card-product-item")
        ) {
          this.classList.add("product-recommendations--loaded");
        }
      })
      .catch((e) => {
        console.error("Product Recommendations Error:", e);
      });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  if (!customElements.get("product-recommendations")) {
    customElements.define("product-recommendations", ProductRecommendations);
  }
});

// Wishlist Script
document.addEventListener("DOMContentLoaded",()=>{
let w=JSON.parse(localStorage.getItem("wishlist"))||[];
const update=()=>{
  document.querySelectorAll(".wishlist-count-bubble").forEach(bw=>{
    const b=bw.querySelector("span");
    if(!b) return;
    if(w.length){
      bw.style.display="block";
      b.textContent=w.length;
    }else{
      bw.style.display="none";
    }
  });
};
update();

document.querySelectorAll(".wishlist-icon").forEach(i=>{
  if(w.includes(i.dataset.productHandle)){
    i.classList.add("active");
  }
});
document.addEventListener("click",e=>{
  const i=e.target.closest(".wishlist-icon");
  if(!i) return;
  const h=i.dataset.productHandle;
  w.includes(h)
  ? (w=w.filter(x=>x!==h), i.classList.remove("active"))
  : (w.push(h), i.classList.add("active"));
  localStorage.setItem("wishlist",JSON.stringify(w));
  update();
});
});