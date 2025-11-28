import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { LoginFormElement } from "../auth/login-form.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("register-view")
class RegisterViewElement extends LitElement {
  next: string = "/app";

  static styles = [themeTokens, ...pageStyles];

  connectedCallback(): void {
    super.connectedCallback();
    const url = new URL(window.location.href);
    const n = url.searchParams.get("next");
    if (n) this.next = n;
  }

  render() {
    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/app">Adventure Guide</a> →
        <span>Create Account</span>
      </nav-element>

      <section-header title="Create Account" icon="users"></section-header>

      <form class="auth-form" @submit=${(e: Event) => e.preventDefault()}>
        <div class="stack">
          <login-form api="/api/auth/register" redirect=${this.next}>
            <label>
              <span>Username</span>
              <input name="username" placeholder="username" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="••••••" />
            </label>
            <label>
              <span>Confirm Password</span>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••"
              />
            </label>
            <button type="button" slot="button">Create Account</button>
          </login-form>
        </div>
      </form>
    `;
  }
}

export default RegisterViewElement;

void LoginFormElement;
