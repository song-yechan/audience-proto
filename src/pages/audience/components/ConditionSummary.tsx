import { useState } from 'react'
import { Text, Tag } from '@airbridge/component'
import type { ConditionGroup, Condition } from '../types'
import { getInterpretation } from '../utils'

interface ConditionSummaryProps {
  groups: ConditionGroup[]
  autoAddedCondition: Condition | null
}

export function ConditionSummary({ groups, autoAddedCondition }: ConditionSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  // 자동 추가 조건 포함하여 표시
  const allGroups: ConditionGroup[] = autoAddedCondition
    ? [{ id: 'auto', conditions: [autoAddedCondition] }, ...groups]
    : groups

  const validGroups = allGroups.filter((g) => g.conditions.some((c) => c.event && c.n !== ''))

  if (validGroups.length === 0) {
    return (
      <div
        className="tw:p-16 tw:rounded-6 tw:text-13 tw:text-center"
        style={{
          backgroundColor: '#fafbfc',
          border: '1px solid #e5e9ee',
          color: '#606468',
        }}
      >
        조건을 정의하면 여기에 요약이 표시됩니다.
      </div>
    )
  }

  const displayGroups = expanded ? validGroups : validGroups.slice(0, 3)
  const hiddenCount = validGroups.length - 3

  return (
    <div>
      {displayGroups.map((group, idx) => (
        <div key={group.id}>
          {idx > 0 && (
            <div className="tw:text-center tw:py-8 tw:text-13" style={{ color: '#606468' }}>
              and also
            </div>
          )}
          <div
            className="tw:p-16 tw:rounded-6 tw:mb-8"
            style={{
              backgroundColor: group.id === 'auto' ? '#f0f9ff' : '#fafbfc',
              border: group.id === 'auto' ? '1px solid #bae6fd' : '1px solid #e5e9ee',
            }}
          >
            <div className="tw:flex tw:items-center tw:gap-8 tw:mb-8">
              <span
                className="tw:inline-block tw:w-24 tw:h-24 tw:leading-24 tw:text-center tw:rounded-6 tw:text-14 tw:font-semibold"
                style={{
                  backgroundColor: group.id === 'auto' ? '#e0f2fe' : '#ecf0f4',
                  color: group.id === 'auto' ? '#0284c7' : '#2b2d2f',
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              {group.id === 'auto' && (
                <Tag size="small" color="blue" appearance="tinted">
                  자동 추가
                </Tag>
              )}
            </div>
            {group.conditions.map((cond, cIdx) => {
              const interpretation = getInterpretation(cond.type, cond.operator, cond.n, cond.event)
              if (!interpretation) return null
              return (
                <div key={cond.id || cIdx}>
                  {cIdx > 0 && (
                    <Text size={12} color="secondary" className="tw:my-6">
                      또는
                    </Text>
                  )}
                  <Text size={14} className="tw:leading-normal" style={{ color: '#2b2d2f' }}>
                    {interpretation}
                  </Text>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {hiddenCount > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="tw:w-full tw:px-12 tw:py-8 tw:text-left tw:text-13 tw:cursor-pointer tw:border-0 tw:bg-transparent"
          style={{ color: '#2f87f7' }}
        >
          ▼ 외 {hiddenCount}개 조건 더보기
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(false)}
          className="tw:w-full tw:px-12 tw:py-8 tw:text-left tw:text-13 tw:cursor-pointer tw:border-0 tw:bg-transparent"
          style={{ color: '#2f87f7' }}
        >
          ▲ 접기
        </button>
      )}
    </div>
  )
}
