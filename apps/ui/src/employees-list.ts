import { css, html, LitElement } from 'lit'
import { createEmployee, deleteEmployee, Employee, getEmployees } from './employees-service'

export class EmployeesList extends LitElement {
  employees: Employee[] = []
  lastCreatedId: number | null = null

  static styles = css`
    table { border-collapse: separate; border-spacing: 0; width: 100%; }
    th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #eef2f7; vertical-align: middle }
    thead th { background: transparent; color: #475569; font-size: 20px; font-weight: 700 }

    /* Material-like button styles (scoped to this component) */
    .mat-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:8px 14px; font-weight:600; font-size:14px; line-height:1; border-radius:6px; border:0; cursor:pointer; transition: box-shadow .12s ease, transform .08s ease, opacity .08s ease; box-shadow: 0 2px 6px rgba(2,6,23,0.06); }
    .mat-btn:focus { outline: none; box-shadow: 0 0 0 4px rgba(59,130,246,0.12); }
    .mat-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(2,6,23,0.08); }
    .mat-btn[disabled], .mat-btn.disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none }

    /* Primary and danger share same structure, only colors differ */
    .mat-primary { background: linear-gradient(90deg,#2563eb,#06b6d4); color:#fff; }
    .mat-primary:hover { box-shadow: 0 8px 24px rgba(37,99,235,0.12); transform: translateY(-1px); }

    .mat-danger { background: linear-gradient(90deg,#ef4444,#dc2626); color:#fff; }
    .mat-danger:hover { box-shadow: 0 8px 24px rgba(239,68,68,0.12); transform: translateY(-1px); }

    .mat-flat { background: transparent; color: #0f172a; box-shadow: none; border:1px solid rgba(15,23,42,0.06); }

    /* Fixed width variant to keep Add/Delete visually identical */
    :host { --btn-fixed-width: 112px; }
    .mat-fixed { min-width: var(--btn-fixed-width); width: var(--btn-fixed-width); }
    @media (max-width:720px) { .mat-fixed { width: auto; min-width: 0; } }

    .form-row { display:flex; gap:8px; margin-top:12px; align-items:center; width:100%; box-sizing:border-box }
    .form-left { display:flex; gap:8px; flex:1 }
    .form-actions { display:flex; align-items:center; justify-content:flex-end; width:160px }
    .form-row input { flex:1 }
    /* Improved input visuals for form fields */
    /* Keep inputs responsive but prevent them from taking the entire grid column on wide screens */
    .form-grid input, .form-row input { width: min(320px, 100%); padding:10px 12px; border-radius:8px; border:1px solid #dbe7f5; background:#ffffff; box-shadow: 0 1px 2px rgba(2,6,23,0.04); font-size:14px; transition: box-shadow .12s ease, border-color .12s ease, transform .06s ease }
    .form-grid input::placeholder, .form-row input::placeholder { color:#94a3b8 }
    .form-grid input:focus, .form-row input:focus { outline:none; border-color:#60a5fa; box-shadow: 0 0 0 6px rgba(37,99,235,0.06); transform: translateY(-1px) }
    .form-grid { display:grid; grid-template-columns: 80px 1fr 1fr 160px; gap:8px; align-items:center; margin-top:12px; width:100%; box-sizing:border-box }
    /* Form actions centered, table actions left-aligned */
    .form-grid .actions { display:flex; align-items:center; justify-content:left; margin-left:10% }
    td > .actions, td .actions { display:flex; align-items:center; justify-content:flex-start }
    .form-grid .col-id { color:#94a3b8; font-size:13px }
    @media (max-width:720px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-grid .col-id { display:none }
      .form-grid .actions { justify-self:end }
    }
    .created { margin-top:12px; padding:10px; border-radius:8px; background:#f1f5ff; color:#3730a3 }
  `

  static get properties() {
    return { employees: { type: Array }, lastCreatedId: { type: Number } }
  }

  constructor() {
    super()
    this.employees = []
    this.load()
  }

  async load() {
    try {
      this.employees = await getEmployees()
      // trigger update
      this.requestUpdate()
    } catch (err) {
      console.error('Failed to load employees', err)
      this.employees = []
    }
  }

  async handleAdd(e: Event) {
    e.preventDefault()
    const f = e.target as HTMLFormElement
    const first = (f.elements.namedItem('first') as HTMLInputElement).value
    const last = (f.elements.namedItem('last') as HTMLInputElement).value
    if (!first || !last) return
    try {
      const created = await createEmployee({ FirstName: first, LastName: last })
      f.reset()
      this.lastCreatedId = created?.EmployeeId ?? null
      await this.load()
    } catch (err) {
      console.error('Failed to create employee', err)
    }
  }

  async handleDelete(id?: number) {
    if (!id) return
    try {
      await deleteEmployee(id)
      await this.load()
    } catch (err) {
      console.error('Failed to delete employee', err)
    }
  }

  render() {
    return html`
      <table>
        <colgroup>
          <col style="width:80px" />
          <col />
          <col />
          <col style="width:160px" />
        </colgroup>
        <thead>
          <tr><th>ID</th><th>First</th><th>Last</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${this.employees.map(e => html`<tr>
            <td>${e.EmployeeId}</td>
            <td>${e.FirstName}</td>
            <td>${e.LastName}</td>
            <td>
              <button type="button" class="mat-btn mat-danger mat-fixed" @click=${() => this.handleDelete(e.EmployeeId)}>Delete</button>
            </td>
          </tr>`)}
        </tbody>
      </table>

      <form @submit=${this.handleAdd} class="form-grid">
        <div class="col-id"></div>
        <div>
          <input name="first" placeholder="First name" />
        </div>
        <div>
          <input name="last" placeholder="Last name" />
        </div>
        <div class="actions">
          <button type="submit" class="mat-btn mat-primary mat-fixed">Add</button>
        </div>
      </form>

      ${this.lastCreatedId ? html`<div>Created employee with ID ${this.lastCreatedId}</div>` : ''}
    `
  }
}

customElements.define('employees-list', EmployeesList)
