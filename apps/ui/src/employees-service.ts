export interface Employee {
  EmployeeId?: number
  FirstName?: string
  LastName?: string
  [key: string]: any
}

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:4400'

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error('Request failed: ' + res.status)
  if (res.status === 204) return null as unknown as T
  return res.json() as Promise<T>
}

export const getEmployees = () => request<Employee[]>('/employees')
export const getEmployee = (id: number) => request<Employee>(`/employees/${id}`)
export const createEmployee = (data: Partial<Employee>) => request<Employee>('/employees', { method: 'POST', body: JSON.stringify(data) })
export const updateEmployee = (id: number, data: Partial<Employee>) => request<Employee>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteEmployee = (id: number) => request<null>(`/employees/${id}`, { method: 'DELETE' })
