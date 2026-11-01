
(function () {
  "use strict";

  function updateHeader() {
    // Apply consistent header styling to all pages.
    const style = document.createElement("style");

    style.textContent = `
      /* Force the logo to remain small */
      body > header .hubhill-shared-logo {
        display: block !important;
        width: 90px !important;
        min-width: 90px !important;
        max-width: 90px !important;
        height: auto !important;
        flex: 0 0 90px !important;
        overflow: visible !important;
        line-height: 0 !important;
      }

      body > header .hubhill-shared-logo img {
        display: block !important;
        position: static !important;
        width: 90px !important;
        min-width: 90px !important;
        max-width: 90px !important;
        height: auto !important;
        object-fit: contain !important;
        top: auto !important;
        left: auto !important;
      }

      body > header .header-inner {
        height: auto !important;
        min-height: 65px !important;
        padding: 5px 12px !important;
        align-items: center !important;
      }

      body > header .auth-links {
        margin-left: auto;
      }

      body > nav .nav-inner {
        max-width: 1100px;
        margin: auto;
        display: flex;
        flex-wrap: wrap;
      }

      body > nav .nav-inner a {
        display: block;
        padding: 12px 16px;
        color: white;
        font-weight: bold;
        text-decoration: none;
      }

      body > nav .nav-inner a:hover {
        background: #164673;
      }
    `;

    document.head.appendChild(style);

    // Replace the old logo with image.png.
    const header = document.querySelector("body > header");

    if (header) {
      const headerInner =
        header.querySelector(".header-inner") || header;

      const oldBrand = headerInner.querySelector(
        ".brand, .hubhill-logo, .logo-crop, .hubhill-shared-logo"
      );

      const logoLink = document.createElement("a");
      logoLink.href = "index.html";
      logoLink.className = "hubhill-shared-logo";

      const logoImage = document.createElement("img");
      logoImage.src = "image.png";
      logoImage.alt = "HubHill";

      logoLink.appendChild(logoImage);

      if (oldBrand) {
        oldBrand.replaceWith(logoLink);
      } else {
        headerInner.prepend(logoLink);
      }
    }

    // Keep all navigation links consistent.
    const nav = document.querySelector("body > nav");

    if (nav) {
      let navInner = nav.querySelector(".nav-inner");

      if (!navInner) {
        navInner = document.createElement("div");
        navInner.className = "nav-inner";
        nav.replaceChildren(navInner);
      }

      const links = [
        ["index.html", "Home"],
        ["index.html#featured", "Videos"],
        ["index.html#categories", "Categories"],
        ["channel.html", "My Channel"],
        ["upload.html", "Upload"],
        ["favorites.html", "My Favorites"],
        ["subscriptions.html", "My Subscriptions"]
      ];

      navInner.replaceChildren();

      links.forEach(([url, name]) => {
        const link = document.createElement("a");
        link.href = url;
        link.textContent = name;
        navInner.appendChild(link);
      });
    }

    // Browser tab icon is intentionally NOT changed.
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateHeader);
  } else {
    updateHeader();
  }
})();
