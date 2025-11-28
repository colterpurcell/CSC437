import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { LoginFormElement } from "../auth/login-form.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("login-view")
class LoginViewElement extends LitElement {
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
        <span>Sign In</span>
      </nav-element>

      <section-header title="Sign In" icon="users"></section-header>

      <form class="auth-form" @submit=${(e: Event) => e.preventDefault()}>
        <div class="stack">
          <login-form api="/api/auth/login" redirect=${this.next}>
            <label>
              <span>Username</span>
              <input name="username" placeholder="username" />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" placeholder="••••••" />
            </label>
            <button type="button" slot="button">Sign In</button>
          </login-form>
        </div>
      </form>
    `;
  }
}

export default LoginViewElement;

// Ensure custom element is defined for login-form (registered via define in main.ts)
void LoginFormElement;
