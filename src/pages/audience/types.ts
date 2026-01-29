// Audience Builder Types

export type PerformType = 'performed' | 'didnt'

export type Operator = 'eq' | 'gte' | 'gt' | 'lte' | 'lt'

export type WhenOption = 'during_last' | 'after' | 'before' | 'between'

export interface Condition {
  id: string
  type: PerformType
  event: string
  operator: Operator
  n: string
  when: WhenOption
  days: string
  includeToday: boolean
  isAutoAdded?: boolean
}

export interface ConditionGroup {
  id: string
  conditions: Condition[]
}

export interface Identifier {
  id: string
  label: string
  hasInfo: boolean
}

export interface WarningState {
  type: 'negative' | 'no_base'
  message: string
}

// Constants
export const OPERATORS: { value: Operator; label: string }[] = [
  { value: 'eq', label: 'equals' },
  { value: 'gte', label: 'more than or equals' },
  { value: 'gt', label: 'more than' },
  { value: 'lte', label: 'less than or equals' },
  { value: 'lt', label: 'less than' },
]

export const WHEN_OPTIONS: { value: WhenOption; label: string }[] = [
  { value: 'during_last', label: 'during last' },
  { value: 'after', label: 'after' },
  { value: 'before', label: 'before' },
  { value: 'between', label: 'between' },
]

export const IDENTIFIERS: Identifier[] = [
  { id: 'abid', label: 'Airbridge Device ID', hasInfo: true },
  { id: 'gaid', label: 'GAID', hasInfo: false },
  { id: 'appset', label: 'App Set ID', hasInfo: false },
  { id: 'idfa', label: 'IDFA', hasInfo: false },
  { id: 'idfv', label: 'IDFV', hasInfo: false },
  { id: 'userid', label: 'User ID', hasInfo: true },
  { id: 'hashed_userid', label: 'Hashed User ID', hasInfo: true },
  { id: 'hashed_email', label: 'Hashed User Email', hasInfo: true },
  { id: 'hashed_phone', label: 'Hashed User Phone', hasInfo: true },
]

export const EVENTS: Record<string, string[]> = {
  'App Standard': ['Any Event', 'Install (App)', 'Open (App)', 'Deeplink Open (App)', 'Uninstall (App)'],
  Custom: ['Purchase', 'Sign Up', 'Add to Cart', 'Search', 'View Product'],
}

export function createEmptyCondition(type: PerformType = 'performed'): Condition {
  return {
    id: `cond-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    event: '',
    operator: 'gte',
    n: '1',
    when: 'during_last',
    days: '30',
    includeToday: false,
  }
}

export function createEmptyGroup(type: PerformType = 'performed'): ConditionGroup {
  return {
    id: `group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    conditions: [createEmptyCondition(type)],
  }
}
