import type { Condition, ConditionGroup, Operator, WarningState } from './types'

/**
 * PRD 기반 조건 해석 문장 생성
 * performed: 원본 연산자 그대로
 * didn't perform: NOT 연산 적용
 */
export function getInterpretation(
  type: 'performed' | 'didnt',
  operator: Operator,
  n: string,
  event: string
): string | null {
  if (!event || n === '' || n === null) return null

  const num = parseInt(n, 10)
  if (isNaN(num)) return null

  if (type === 'performed') {
    switch (operator) {
      case 'gte':
        return num === 1
          ? `${event}을(를) 1회 이상 한 유저`
          : `${event}을(를) ${num}회 이상 한 유저`
      case 'gt':
        return `${event}을(를) ${num}회 초과로 한 유저`
      case 'lte':
        return `${event}을(를) ${num}회 이하로 한 유저`
      case 'lt':
        return `${event}을(를) ${num}회 미만으로 한 유저`
      case 'eq':
        return `${event}을(를) 정확히 ${num}회 한 유저`
      default:
        return null
    }
  } else {
    // didn't perform - NOT 연산 적용
    switch (operator) {
      case 'gte': // NOT(≥N) = <N
        return num === 1
          ? `${event}을(를) 한 번도 안 한 유저`
          : `${event}을(를) ${num}회 미만으로 한 유저`
      case 'gt': // NOT(>N) = ≤N
        return `${event}을(를) ${num}회 이하로 한 유저`
      case 'lte': // NOT(≤N) = >N
        return `${event}을(를) ${num + 1}회 이상 한 유저`
      case 'lt': // NOT(<N) = ≥N
        return `${event}을(를) ${num}회 이상 한 유저`
      case 'eq': // NOT(=N) = ≠N
        return `${event}이(가) ${num}회가 아닌 유저 (0회 또는 ${num + 1}회+)`
      default:
        return null
    }
  }
}

/**
 * 모수가 필요한 케이스 체크
 * performed 조건이 없고, didn't perform만 있는 경우 자동 조건 추가 필요
 */
export function needsBaseCondition(groups: ConditionGroup[]): Condition | null {
  // performed 조건이 하나라도 있으면 모수 조건 불필요
  const hasPerformed = groups.some((g) =>
    g.conditions.some((c) => c.type === 'performed' && c.event && parseInt(c.n, 10) >= 1)
  )

  if (hasPerformed) return null

  // 모수가 필요한 didn't perform 조건 찾기
  for (const group of groups) {
    for (const cond of group.conditions) {
      if (!cond.event) continue

      // didn't + more than or equals 1
      if (cond.type === 'didnt' && cond.operator === 'gte' && parseInt(cond.n, 10) === 1) {
        return cond
      }
      // didn't + more than 0
      if (cond.type === 'didnt' && cond.operator === 'gt' && parseInt(cond.n, 10) === 0) {
        return cond
      }
    }
  }

  return null
}

/**
 * 0명 경고 케이스 체크
 * - 음수 조건: didn't + gte 0, performed + lt 0
 * - 모수 없는 조건: performed + eq 0, performed + lte 0, performed + lt 1
 */
export function checkZeroCaseWarning(groups: ConditionGroup[]): WarningState | null {
  for (const group of groups) {
    for (const cond of group.conditions) {
      if (!cond.event) continue
      const num = parseInt(cond.n, 10)

      // 음수 조건: didn't + more than or equals 0 → NOT(≥0) = <0 (음수)
      if (cond.type === 'didnt' && cond.operator === 'gte' && num === 0) {
        return {
          type: 'negative',
          message: '음수 조건은 설정할 수 없습니다. 조건을 다시 설정해주세요.',
        }
      }

      // 음수 조건: performed + less than 0
      if (cond.type === 'performed' && cond.operator === 'lt' && num === 0) {
        return {
          type: 'negative',
          message: '음수 조건은 설정할 수 없습니다. 조건을 다시 설정해주세요.',
        }
      }

      // 모수 없음: performed + equals 0
      if (cond.type === 'performed' && cond.operator === 'eq' && num === 0) {
        return {
          type: 'no_base',
          message: '이벤트를 0회 수행한 유저는 모수가 없어 검색할 수 없습니다.',
        }
      }

      // 모수 없음: performed + less than or equals 0
      if (cond.type === 'performed' && cond.operator === 'lte' && num === 0) {
        return {
          type: 'no_base',
          message: '이벤트를 0회 이하로 수행한 유저는 모수가 없어 검색할 수 없습니다.',
        }
      }

      // 모수 없음: performed + less than 1
      if (cond.type === 'performed' && cond.operator === 'lt' && num === 1) {
        return {
          type: 'no_base',
          message: '이벤트를 1회 미만(0회) 수행한 유저는 모수가 없어 검색할 수 없습니다.',
        }
      }
    }
  }

  return null
}

/**
 * 자동 추가 조건 생성
 */
export function createAutoAddedCondition(referenceCondition: Condition): Condition {
  return {
    id: 'auto-base',
    type: 'performed',
    event: 'Any Event',
    operator: 'gte',
    n: '1',
    when: referenceCondition.when,
    days: referenceCondition.days,
    includeToday: referenceCondition.includeToday,
    isAutoAdded: true,
  }
}

/**
 * 유효한 조건이 있는지 확인
 */
export function hasValidConditions(groups: ConditionGroup[]): boolean {
  return groups.length > 0 && groups.some((g) => g.conditions.some((c) => c.event && c.n !== ''))
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
