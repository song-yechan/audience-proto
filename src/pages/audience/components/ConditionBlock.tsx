import { useState, useEffect, useRef } from 'react'
import { Text, Icon, Tag } from '@airbridge/component'
import type { Condition, Operator, WhenOption } from '../types'
import { OPERATORS, WHEN_OPTIONS, EVENTS } from '../types'

interface ConditionBlockProps {
  condition: Condition
  onUpdate: (condition: Condition) => void
  onRemove: () => void
  isFirst: boolean
  isAutoAdded?: boolean
}

// Dropdown Component
function Dropdown({
  isOpen,
  onClose,
  children,
  style,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const handleClick = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          onClose()
        }
      }
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="tw:absolute tw:top-full tw:left-0 tw:mt-4 tw:bg-white tw:rounded-6 tw:z-50 tw:overflow-hidden"
      style={{
        border: '0.625px solid #d7dce4',
        boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 4px 10px 0px',
        minWidth: 200,
        maxHeight: 400,
        overflowY: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// Event Dropdown Component
function EventDropdown({
  isOpen,
  onClose,
  onSelect,
  selectedEvent,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (event: string) => void
  selectedEvent: string
}) {
  if (!isOpen) return null

  return (
    <Dropdown isOpen={isOpen} onClose={onClose} style={{ width: 320 }}>
      {Object.entries(EVENTS).map(([category, items]) => (
        <div key={category}>
          <div
            className="tw:px-16 tw:py-8 tw:text-12 tw:font-medium tw:border-b tw:border-gray-200"
            style={{ backgroundColor: '#fafbfc', color: '#606468' }}
          >
            {category}
          </div>
          {items.map((item) => (
            <button
              key={item}
              onClick={() => {
                onSelect(item)
                onClose()
              }}
              className="tw:w-full tw:px-16 tw:py-10 tw:text-14 tw:text-left tw:border-0 tw:cursor-pointer hover:tw:bg-gray-100"
              style={{
                backgroundColor: selectedEvent === item ? '#ecf0f4' : '#fff',
                color: '#2b2d2f',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ))}
      <div
        className="tw:px-16 tw:py-12 tw:border-t tw:border-gray-200 tw:flex tw:items-center tw:gap-6 tw:text-13"
        style={{ backgroundColor: '#fafbfc', color: '#606468' }}
      >
        <Icon size={14} color="#a5abb2">
          info
        </Icon>
        데이터가 수집된 이벤트만 노출됩니다.
      </div>
    </Dropdown>
  )
}

export function ConditionBlock({
  condition,
  onUpdate,
  onRemove,
  isFirst,
  isAutoAdded = false,
}: ConditionBlockProps) {
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false)
  const [operatorDropdownOpen, setOperatorDropdownOpen] = useState(false)
  const [whenDropdownOpen, setWhenDropdownOpen] = useState(false)

  return (
    <div
      className="tw:p-20 tw:rounded-6 tw:relative"
      style={{
        backgroundColor: isAutoAdded ? '#f0f9ff' : '#fafbfc',
        border: isAutoAdded ? '1px solid #bae6fd' : '1px solid #e5e9ee',
      }}
    >
      {isAutoAdded && (
        <Tag
          size="small"
          color="blue"
          appearance="tinted"
          className="tw:absolute tw:top-8 tw:right-12"
        >
          자동 추가됨
        </Tag>
      )}

      {/* Row 1: Users who / type / event */}
      <div className="tw:flex tw:items-center tw:gap-8 tw:flex-wrap tw:mb-12">
        <Text size={14} color="secondary">
          Users who
        </Text>

        {/* Type Toggle */}
        <button
          onClick={() =>
            !isAutoAdded &&
            onUpdate({ ...condition, type: condition.type === 'performed' ? 'didnt' : 'performed' })
          }
          className="tw:px-8 tw:h-28 tw:rounded-6 tw:text-14 tw:border-0"
          style={{
            backgroundColor: '#ecf0f4',
            color: '#2b2d2f',
            cursor: isAutoAdded ? 'default' : 'pointer',
            opacity: isAutoAdded ? 0.7 : 1,
          }}
        >
          ..{condition.type === 'performed' ? 'performed' : "didn't perform"}
        </button>

        {/* Event Dropdown */}
        <div className="tw:relative">
          <button
            onClick={(e) => {
              if (!isAutoAdded) {
                e.stopPropagation()
                setEventDropdownOpen(!eventDropdownOpen)
              }
            }}
            className="tw:flex tw:items-center tw:gap-6 tw:px-8 tw:h-28 tw:rounded-6 tw:text-14"
            style={{
              backgroundColor: condition.event ? '#ecf0f4' : 'transparent',
              border: condition.event ? 'none' : '1px dashed #c3c9d0',
              color: condition.event ? '#2b2d2f' : '#2f87f7',
              cursor: isAutoAdded ? 'default' : 'pointer',
              opacity: isAutoAdded ? 0.7 : 1,
            }}
          >
            {condition.event || '이벤트 선택'}
            {!isAutoAdded && (
              <Icon size={12} color="#606468">
                expand_more
              </Icon>
            )}
          </button>
          {!isAutoAdded && (
            <EventDropdown
              isOpen={eventDropdownOpen}
              onClose={() => setEventDropdownOpen(false)}
              onSelect={(event) => onUpdate({ ...condition, event })}
              selectedEvent={condition.event}
            />
          )}
        </div>

        {condition.event && !isAutoAdded && (
          <button
            className="tw:px-12 tw:py-6 tw:rounded-6 tw:text-14 tw:cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              border: '1px dashed #c3c9d0',
              color: '#2f87f7',
            }}
          >
            + had property
          </button>
        )}

        {!isFirst && !isAutoAdded && (
          <button
            onClick={onRemove}
            className="tw:ml-auto tw:w-24 tw:h-24 tw:rounded-6 tw:border-0 tw:text-18 tw:cursor-pointer hover:tw:bg-gray-100"
            style={{ backgroundColor: 'transparent', color: '#a5abb2' }}
          >
            ×
          </button>
        )}
      </div>

      {condition.event && (
        <>
          {/* Row 2: with / operator / N / times */}
          <div className="tw:flex tw:items-center tw:gap-8 tw:mb-12">
            <Text size={14} color="secondary" style={{ width: 40 }}>
              with
            </Text>

            <div className="tw:relative">
              <button
                onClick={(e) => {
                  if (!isAutoAdded) {
                    e.stopPropagation()
                    setOperatorDropdownOpen(!operatorDropdownOpen)
                  }
                }}
                className="tw:flex tw:items-center tw:gap-6 tw:px-8 tw:h-28 tw:rounded-6 tw:text-14 tw:border-0"
                style={{
                  backgroundColor: '#ecf0f4',
                  color: '#2b2d2f',
                  cursor: isAutoAdded ? 'default' : 'pointer',
                  opacity: isAutoAdded ? 0.7 : 1,
                }}
              >
                {OPERATORS.find((o) => o.value === condition.operator)?.label}
                {!isAutoAdded && (
                  <Icon size={12} color="#606468">
                    expand_more
                  </Icon>
                )}
              </button>

              {!isAutoAdded && (
                <Dropdown
                  isOpen={operatorDropdownOpen}
                  onClose={() => setOperatorDropdownOpen(false)}
                >
                  {OPERATORS.map((op) => (
                    <button
                      key={op.value}
                      onClick={() => {
                        onUpdate({ ...condition, operator: op.value as Operator })
                        setOperatorDropdownOpen(false)
                      }}
                      className="tw:w-full tw:px-16 tw:py-10 tw:text-14 tw:text-left tw:border-0 tw:cursor-pointer"
                      style={{
                        backgroundColor: condition.operator === op.value ? '#ecf0f4' : '#fff',
                        color: '#2b2d2f',
                      }}
                    >
                      {op.label}
                    </button>
                  ))}
                </Dropdown>
              )}
            </div>

            <input
              type="number"
              value={condition.n}
              onChange={(e) => !isAutoAdded && onUpdate({ ...condition, n: e.target.value })}
              min="0"
              readOnly={isAutoAdded}
              className="tw:w-48 tw:h-28 tw:px-8 tw:rounded-6 tw:text-14 tw:text-center tw:outline-none"
              style={{
                border: '0.625px solid #d7dce4',
                color: '#2b2d2f',
                backgroundColor: isAutoAdded ? '#f0f9ff' : '#fff',
                opacity: isAutoAdded ? 0.7 : 1,
              }}
            />

            <Text size={14} color="secondary">
              time(s)
            </Text>
          </div>

          {/* Row 3: when / duration */}
          <div className="tw:flex tw:items-center tw:gap-8">
            <Text size={14} color="secondary" style={{ width: 40 }}>
              when
            </Text>

            <div className="tw:relative">
              <button
                onClick={(e) => {
                  if (!isAutoAdded) {
                    e.stopPropagation()
                    setWhenDropdownOpen(!whenDropdownOpen)
                  }
                }}
                className="tw:flex tw:items-center tw:gap-6 tw:px-8 tw:h-28 tw:rounded-6 tw:text-14 tw:border-0"
                style={{
                  backgroundColor: '#ecf0f4',
                  color: '#2b2d2f',
                  cursor: isAutoAdded ? 'default' : 'pointer',
                  opacity: isAutoAdded ? 0.7 : 1,
                }}
              >
                {WHEN_OPTIONS.find((w) => w.value === condition.when)?.label}
                {!isAutoAdded && (
                  <Icon size={12} color="#606468">
                    expand_more
                  </Icon>
                )}
              </button>

              {!isAutoAdded && (
                <Dropdown isOpen={whenDropdownOpen} onClose={() => setWhenDropdownOpen(false)}>
                  {WHEN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        onUpdate({ ...condition, when: opt.value as WhenOption })
                        setWhenDropdownOpen(false)
                      }}
                      className="tw:w-full tw:px-16 tw:py-10 tw:text-14 tw:text-left tw:border-0 tw:cursor-pointer"
                      style={{
                        backgroundColor: condition.when === opt.value ? '#ecf0f4' : '#fff',
                        color: '#2b2d2f',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </Dropdown>
              )}
            </div>

            <input
              type="number"
              value={condition.days}
              onChange={(e) => !isAutoAdded && onUpdate({ ...condition, days: e.target.value })}
              min="1"
              readOnly={isAutoAdded}
              className="tw:w-48 tw:h-28 tw:px-8 tw:rounded-6 tw:text-14 tw:text-center tw:outline-none"
              style={{
                border: '0.625px solid #d7dce4',
                color: '#2b2d2f',
                backgroundColor: isAutoAdded ? '#f0f9ff' : '#fff',
                opacity: isAutoAdded ? 0.7 : 1,
              }}
            />

            <Text size={14} color="secondary">
              day(s)
            </Text>

            {!isAutoAdded && (
              <label className="tw:flex tw:items-center tw:gap-6 tw:ml-8 tw:cursor-pointer tw:text-14 tw:text-gray-600">
                <input
                  type="checkbox"
                  checked={condition.includeToday}
                  onChange={(e) => onUpdate({ ...condition, includeToday: e.target.checked })}
                  className="tw:w-14 tw:h-14"
                  style={{ accentColor: '#2f87f7' }}
                />
                오늘 포함
              </label>
            )}
          </div>
        </>
      )}
    </div>
  )
}
