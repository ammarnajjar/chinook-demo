import { LitElement, html, css } from 'lit'
import { getEmployees, createEmployee, deleteEmployee, Employee } from './employees-service'

export class EmployeesList extends LitElement {
  employees: Employee[] = []
  lastCreatedId: number | null = null

  static styles = css`
    table { border-collapse: collapse; width: 100% }
    th, td { border: 1px solid #ddd; padding: 8px }
    th { background: #f4f4f4 }
    button { margin-right: 6px }
    form { margin-top: 12px }
    input { padding: 6px; margin-right: 6px }
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
        <thead>
          <tr><th>ID</th><th>First</th><th>Last</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${this.employees.map(e => html`<tr>
            <td>${e.EmployeeId}</td>
            <td>${e.FirstName}</td>
            <td>${e.LastName}</td>
            <td>
              <button @click=${() => this.handleDelete(e.EmployeeId)}>Delete</button>
            </td>
          </tr>`)}
        </tbody>
      </table>

      <form @submit=${this.handleAdd}>
        <input name="first" placeholder="First name" />
        <input name="last" placeholder="Last name" />
        <button type="submit">Add</button>
      </form>

      ${this.lastCreatedId ? html`<div>Created employee with ID ${this.lastCreatedId}</div>` : ''}
    `
  }
}

customElements.define('employees-list', EmployeesList)
