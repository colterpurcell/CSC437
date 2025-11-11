// in proto/src/auth/login-form.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  formData: LoginFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(
      this.api &&
        this.formData.username &&
        this.formData.password &&
        (this.api.includes("register") ? this.formData.confirmPassword : true)
    );
  }

  override render() {
    return html`
      <slot></slot>
      <slot name="button">
        <button
          ?disabled=${!this.canSubmit}
          type="button"
          @click=${this.handleButtonClick}
        >
          ${this.api?.includes("register") ? "Sign Up" : "Login"}
        </button>
      </slot>
      <p class="error">${this.error}</p>
    `;
  }

  static styles = [
    css`
      :host {
        display: contents;
      }

      label {
        display: block;
        margin-bottom: var(--spacing-lg);
      }

      label span {
        display: block;
        margin-bottom: var(--spacing-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text);
      }

      label input {
        width: 100%;
        padding: var(--spacing-md);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        font-family: var(--font-family-primary);
        background-color: var(--color-background-page);
        color: var(--color-text);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
      }

      label input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
      }

      label input::placeholder {
        color: var(--color-text-muted);
      }

      button[type="submit"],
      button[type="button"] {
        background-color: var(--color-accent);
        color: var(--color-text-inverted);
        border: none;
        padding: var(--spacing-md) var(--spacing-xl);
        border-radius: var(--radius-md);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        font-family: var(--font-family-primary);
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
        margin-top: var(--spacing-lg);
      }

      button[type="submit"]:hover:not(:disabled),
      button[type="button"]:hover:not(:disabled) {
        background-color: var(--color-accent-hover);
        transform: translateY(-1px);
      }

      button[type="submit"]:disabled,
      button[type="button"]:disabled {
        background-color: var(--color-border);
        cursor: not-allowed;
        transform: none;
      }

      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        background-color: rgba(220, 53, 69, 0.1);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        margin-top: var(--spacing-lg);
        font-size: var(--font-size-sm);
      }
    `,
  ];

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
      case "confirmPassword":
        this.formData = { ...prevData, confirmPassword: value };
        break;
    }

    // Dispatch custom event to notify parent form about changes
    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(changeEvent);
  }

  handleButtonClick() {
    this.submitForm();
  }

  submitForm() {
    if (this.canSubmit) {
      console.log("Submitting form with data:", this.formData);
      console.log("API endpoint:", this.api);

      fetch(this?.api || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      })
        .then((res) => {
          console.log("Response status:", res.status);
          if (res.status !== 200 && res.status !== 201) {
            return res.json().then((err) => {
              console.log("Error response:", err);
              throw new Error(err.error || "Request failed");
            });
          }
          return res.json();
        })
        .then((json: object) => {
          console.log("Response JSON:", json);
          const { token } = json as { token: string };
          const customEvent = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: this.redirect }],
          });
          console.log("dispatching message", customEvent);
          console.log("redirect value:", this.redirect);
          console.log("event detail:", customEvent.detail);
          this.dispatchEvent(customEvent);
        })
        .catch((error: Error) => {
          console.log("Submit error:", error);
          this.error = error.message || error.toString();
        });
    } else {
      console.log("Cannot submit: missing required fields");
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Use event delegation to listen for input changes on slotted content
    this.addEventListener("input", this.handleChange.bind(this));
    this.addEventListener("slotchange", this.handleSlotChange.bind(this));
    // Handle slot changes to ensure we listen to dynamically added inputs
    this.handleSlotChange();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("input", this.handleChange.bind(this));
    this.removeEventListener("slotchange", this.handleSlotChange.bind(this));
  }

  handleSlotChange() {
    // Find all input elements in the slots and ensure they trigger events
    const inputs = this.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", this.handleChange.bind(this));
    });
  }
}
