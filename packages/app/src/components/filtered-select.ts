import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

interface OptionItem {
  id: string;
  name: string;
}

@customElement("filtered-select")
export class FilteredSelect extends LitElement {
  static styles = css`
    label {
      display: grid;
      gap: var(--spacing-sm);
    }
    select {
      padding: var(--spacing-md);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      width: 100%;
    }
  `;

  @property({ type: String }) label = "Selection";
  @property({ type: String }) type: "path" | "poi" | "camp" | "" = "";
  @property({ type: Array }) paths: OptionItem[] = [];
  @property({ type: Array }) pois: OptionItem[] = [];
  @property({ type: Array }) campsites: OptionItem[] = [];
  @property({ type: String, attribute: "name" }) name = "activityRef";

  private onChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this.dispatchEvent(
      new CustomEvent("filtered-select:change", {
        detail: { type: this.type, value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const options: OptionItem[] =
      this.type === "path"
        ? this.paths
        : this.type === "poi"
        ? this.pois
        : this.type === "camp"
        ? this.campsites
        : [];

    return html`
      <label>
        <span>${this.label}</span>
        <select name="${this.name}" @change=${this.onChange}>
          <option value="">Select item…</option>
          ${options.map(
            (opt) => html`<option value=${opt.id}>${opt.name}</option>`
          )}
        </select>
      </label>
    `;
  }
}

export default FilteredSelect;
