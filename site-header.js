
/*
  HubHill Shared Header and Navigation
  Used by:
  index.html
  watch.html
  channel.html
  favorites.html
  subscriptions.html
  upload.html
*/

(function () {
  "use strict";

  const STYLE_ID = "hubhill-shared-header-style";

  const styles = `
    .hubhill-shared-header {
      background: #fff;
      border-bottom: 1px solid #aaa;
    }

    .hubhill-shared-header .header-inner {
      max-width: 1100px;
      min-height: 92px;
      height: auto;
      margin: auto;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .hubhill-shared-logo {
      display: block;
      width: 205px;
      max-width: 45vw;
      height: auto;
      line-height: 0;
      flex-shrink: 0;
    }

    .hubhill-shared-logo img {
      position: static !important;
      display: block;
      width: 100% !important;
      height: auto !important;
      max-width: 100% !important;
      object-fit: contain !important;
      top: auto !important;
      left: auto !important;
    }

    .hubhill-shared-header .auth-links {
      margin-left: auto;
    }

    .hubhill-shared-nav {
      background: linear-gradient(#397dbb, #20558d);
      border-bottom: 2px solid #153e6b;
    }

    .hubhill-shared-nav .nav-inner {
      max-width: 1100px;
      margin: auto;
      display: flex;
      flex-wrap: wrap;
    }

    .hubhill-shared-nav a {
      display: block;
      padding: 12px 16px;
      color: white;
      font-weight: bold;
      border-right: 1px solid #174b7e;
      text-decoration: none;
    }

    .hubhill-shared-nav a:hover {
      background: #164673;
      text-decoration: none;
    }

    @media (max-width: 650px) {
      .hubhill-shared-header .header-inner {
        justify-content: center;
      }

      .hubhill-shared-header .auth-links {
        margin-left: 0;
      }

      .hubhill-shared-nav a {
        padding: 10px 11px;
      }
    }
  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = styles;
    document.head.appendChild(style);
  }

  function createLink(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = text;
    return link;
  }

  function installHeader() {
    installStyles();

    const oldHeader = document.querySelector("body > header");

    if (oldHeader) {
      oldHeader.classList.add("hubhill-shared-header");

      const headerInner =
        oldHeader.querySelector(".header-inner") || oldHeader;

      const oldBrand =
        headerInner.querySelector(".brand, .hubhill-logo, .logo-crop");

      const logoLink = document.createElement("a");
      logoLink.href = "index.html";
      logoLink.className = "hubhill-shared-logo";
      logoLink.setAttribute("aria-label", "HubHill Home");

      const image = document.createElement("img");
      image.src = "image.png";
      image.alt = "HubHill - Your World. Your Watch.";

      logoLink.appendChild(image);

      if (oldBrand) {
        oldBrand.replaceWith(logoLink);
      } else {
        headerInner.prepend(logoLink);
      }
    }

    const oldNav = document.querySelector("body > nav");

    if (oldNav) {
      oldNav.classList.add("hubhill-shared-nav");

      let navInner = oldNav.querySelector(".nav-inner");

      if (!navInner) {
        navInner = document.createElement("div");
        navInner.className = "nav-inner";
        oldNav.replaceChildren(navInner);
      }

      navInner.replaceChildren(
        createLink("index.html", "Home"),
        createLink("index.html#featured", "Videos"),
        createLink("index.html#categories", "Categories"),
        createLink("channel.html", "My Channel"),
        createLink("upload.html", "Upload"),
        createLink("favorites.html", "My Favorites"),
        createLink("subscriptions.html", "My Subscriptions")
      );
    }

    const favicon = document.querySelector('link[rel="icon"]');

    if (favicon) {
      favicon.href = "image.png";
      favicon.type = "image/png";
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = "image.png";
      link.type = "image/png";
      document.head.appendChild(link);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installHeader);
  } else {
    installHeader();
  }
})();
