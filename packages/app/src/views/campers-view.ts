import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("campers-view")
class CampersViewElement extends LitElement {
  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
        grid-column: 1 / -1;
      }
    `,
    iconStyles,
  ];

  render() {
    return html`
      <nav-element>
        <a href="/app">Adventure Guide</a> →
        <span>Campers</span>
      </nav-element>

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
          <svg slot="icon" class="icon icon-md">
            <use href="/assets/icons/camping.svg#icon-backpack"></use>
          </svg>
        </card-element>

        <card-element
          title="Bikepacker"
          description="Combine cycling and camping for unique adventures. Travel light while covering more ground than traditional backpacking."
          href="/app/campers/bikepacker"
          clickable
        >
          <svg slot="icon" class="icon icon-md">
            <use href="/assets/icons/camping.svg#icon-bike"></use>
          </svg>
        </card-element>
      </card-grid>
    `;
  }
}

export default CampersViewElement;
