import { LitElement, html, css } from 'lit'
import './employees-list.ts'

export class EmployeesApp extends LitElement {
  static styles = css`
    :host { display: block; font-family: system-ui, Arial; padding: 16px; }
    h1 { font-size: 20px; margin: 0 0 12px 0 }
  `

  render() {
    return html`
      <h1>Employees</h1>
      <employees-list></employees-list>
    `
  }
}

customElements.define('employees-app', EmployeesApp)
