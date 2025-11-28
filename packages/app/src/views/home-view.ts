import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("home-view")
class HomeViewElement extends LitElement {
  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
        grid-column: 1 / -1;
      }

      h1 {
        font-size: var(--font-size-2xl, 2rem);
        margin-bottom: var(--spacing-xl, 1.5rem);
        color: var(--color-text-primary);
        grid-column: 1 / -1;
      }

      section {
        grid-column: 1 / -1;
        margin-bottom: var(--spacing-xl);
      }
    `,
    iconStyles,
  ];

  render() {
    return html`
      <nav-element>
        <a href="/app">Adventure Guide</a>
      </nav-element>

      <section>
        <section-header title="National Parks" icon="park"></section-header>
        <card-element
          title="Explore Parks"
          description="Discover amazing national parks with detailed information, campsites, and points of interest."
          href="/app/parks"
          clickable
        >
          <svg slot="icon" class="icon icon-md" viewBox="0 0 100 100">
            <use href="/assets/icons/camping.svg#icon-forest"></use>
          </svg>
        </card-element>
      </section>

      <section>
        <section-header title="Hiking Paths" icon="path"></section-header>
        <card-element
          title="Explore Paths"
          description="Find the perfect hiking trails, bike routes, and scenic paths for your adventure."
          href="/app/paths"
          clickable
        >
          <svg slot="icon" class="icon icon-md" viewBox="0 0 100 100">
            <use href="/assets/icons/camping.svg#icon-path"></use>
          </svg>
        </card-element>
      </section>
      <section>
        <section-header title="Camper Types" icon="campervan"></section-header>
        <card-grid columns="repeat(auto-fit, minmax(300px, 1fr))">
          <card-element
            title="Camper"
            description="Traditional camping with car access and established campgrounds. Perfect for families and those who prefer comfort and convenience."
            href="/app/campers/camper"
            clickable
          >
            <svg slot="icon" class="icon icon-md" viewBox="0 0 100 100">
              <use href="/assets/icons/camping.svg#icon-campervan"></use>
            </svg>
          </card-element>

          <card-element
            title="Backpacker"
            description="Wilderness camping with minimal gear carried on foot. Experience remote locations and pristine nature away from crowds."
            href="/app/campers/backpacker"
            clickable
          >
            <svg slot="icon" class="icon icon-md" viewBox="0 0 100 100">
              <use href="/assets/icons/camping.svg#icon-backpack"></use>
            </svg>
          </card-element>

          <card-element
            title="Bikepacker"
            description="Combine cycling and camping for unique adventures. Travel light while covering more ground than traditional backpacking."
            href="/app/campers/bikepacker"
            clickable
          >
            <svg slot="icon" class="icon icon-md" viewBox="0 0 100 100">
              <use href="/assets/icons/camping.svg#icon-bike"></use>
            </svg>
          </card-element>
        </card-grid>
      </section>

      <section>
        <section-header
          title="Points of Interest"
          icon="map-pin"
        ></section-header>
        <card-element
          title="Discover POI"
          description="Explore amazing points of interest, landmarks, and hidden gems in national parks."
          href="/app/poi"
          clickable
        >
          <svg slot="icon" class="icon icon-md">
            <use href="/assets/icons/camping.svg#icon-campfire"></use>
          </svg>
        </card-element>
      </section>

      <section>
        <section-header title="Trips" icon="path"></section-header>
        <card-element
          title="Trip Itineraries"
          description="Browse curated trip plans and itineraries for your next adventure."
          href="/app/trips"
          clickable
        >
          <svg slot="icon" class="icon icon-md">
            <use href="/assets/icons/camping.svg#icon-path"></use>
          </svg>
        </card-element>
      </section>
    `;
  }
}

export default HomeViewElement;
