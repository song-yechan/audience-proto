import { useState, useEffect } from 'react'
import { Button, Text, Heading, Icon, Tooltip } from '@airbridge/component'
import type { ConditionGroup as ConditionGroupType, Condition, WarningState } from './types'
import { IDENTIFIERS, createEmptyGroup } from './types'
import { ConditionGroup, ConditionSummary, ConditionBlock } from './components'
import {
  needsBaseCondition,
  checkZeroCaseWarning,
  createAutoAddedCondition,
  hasValidConditions,
  formatDate,
} from './utils'

// Empty State Component
function EmptyConditionBuilder({
  onAddCondition,
}: {
  onAddCondition: (type: 'performed' | 'didnt') => void
}) {
  return (
    <div
      className="tw:p-24 tw:rounded-6 tw:text-center"
      style={{
        backgroundColor: '#fafbfc',
        border: '1px dashed #c3c9d0',
      }}
    >
      <Text size={14} color="secondary" className="tw:mb-16">
        Users who
      </Text>
      <div className="tw:flex tw:gap-8 tw:justify-center">
        <button
          onClick={() => onAddCondition('performed')}
          className="tw:flex tw:items-center tw:gap-4 tw:px-16 tw:py-8 tw:rounded-6 tw:text-14 tw:cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            border: '1px dashed #c3c9d0',
            color: '#2f87f7',
          }}
        >
          + performed event
        </button>
        <button
          onClick={() => onAddCondition('didnt')}
          className="tw:flex tw:items-center tw:gap-4 tw:px-16 tw:py-8 tw:rounded-6 tw:text-14 tw:cursor-pointer"
          style={{
            backgroundColor: 'transparent',
            border: '1px dashed #c3c9d0',
            color: '#2f87f7',
          }}
        >
          + didn't perform event
        </button>
      </div>
      <Text size={13} color="secondary" className="tw:mt-12">
        옵션 중 1개를 선택해서 오디언스로 생성할 유저의 조건을 정의해 주세요.
      </Text>
    </div>
  )
}

export function AudienceBuilderPage() {
  const [groups, setGroups] = useState<ConditionGroupType[]>([])
  const [selectedIdentifiers, setSelectedIdentifiers] = useState<string[]>(['abid', 'gaid', 'appset'])
  const [estimatedUsers, setEstimatedUsers] = useState<number | null>(null)
  const [warning, setWarning] = useState<WarningState | null>(null)
  const [autoAddedCondition, setAutoAddedCondition] = useState<Condition | null>(null)
  const [lastCalculated, setLastCalculated] = useState(new Date())

  // 모수 체크 및 자동 추가
  useEffect(() => {
    if (groups.length === 0) {
      setAutoAddedCondition(null)
      setWarning(null)
      setEstimatedUsers(null)
      return
    }

    // 음수 조건 등 경고 체크
    const zeroWarning = checkZeroCaseWarning(groups)
    setWarning(zeroWarning)

    if (zeroWarning) {
      setEstimatedUsers(0)
      setAutoAddedCondition(null)
      setLastCalculated(new Date())
      return
    }

    // 모수 필요 여부 체크
    const needsBase = needsBaseCondition(groups)

    if (needsBase) {
      setAutoAddedCondition(createAutoAddedCondition(needsBase))
    } else {
      setAutoAddedCondition(null)
    }

    // 예상 유저 수 계산 (Mock)
    const hasValid = hasValidConditions(groups)

    if (hasValid) {
      setEstimatedUsers(Math.floor(Math.random() * 500000) + 10000)
    } else {
      setEstimatedUsers(null)
    }

    setLastCalculated(new Date())
  }, [groups])

  const addGroup = (type: 'performed' | 'didnt') => {
    setGroups([...groups, createEmptyGroup(type)])
  }

  const addFirstCondition = (type: 'performed' | 'didnt') => {
    setGroups([createEmptyGroup(type)])
  }

  const updateGroup = (index: number, updated: ConditionGroupType) => {
    const newGroups = [...groups]
    newGroups[index] = updated
    setGroups(newGroups)
  }

  const removeGroup = (index: number) => {
    if (groups.length > 1) {
      setGroups(groups.filter((_, i) => i !== index))
    } else {
      setGroups([])
    }
  }

  const isNextDisabled = !hasValidConditions(groups) || warning !== null

  return (
    <div
      className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-20"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className="tw:bg-white tw:rounded-12 tw:w-full tw:max-h-full tw:overflow-hidden tw:flex tw:flex-col"
        style={{
          maxWidth: 1280,
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 32px',
        }}
      >
        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:px-32 tw:py-24 tw:border-b tw:border-gray-200">
          <Heading as="h1" size={20} weight="semibold">
            오디언스 생성
          </Heading>
          <button className="tw:w-32 tw:h-32 tw:rounded-6 tw:border-0 tw:bg-transparent tw:text-24 tw:cursor-pointer tw:text-gray-600 hover:tw:bg-gray-100">
            ×
          </button>
        </div>

        {/* Step Indicator */}
        <div className="tw:flex tw:gap-24 tw:px-32 tw:pt-16 tw:border-b tw:border-gray-200">
          <button
            className="tw:bg-transparent tw:border-0 tw:py-8 tw:flex tw:items-center tw:gap-8 tw:text-14 tw:cursor-pointer"
            style={{
              color: '#1e6eff',
              borderBottom: '2px solid #1e6eff',
              marginBottom: -1,
            }}
          >
            <span
              className="tw:inline-flex tw:items-center tw:justify-center tw:w-20 tw:h-20 tw:rounded-full tw:text-12 tw:font-medium"
              style={{ backgroundColor: '#1e6eff', color: '#fff' }}
            >
              1
            </span>
            조건 정의
          </button>
          <button className="tw:bg-transparent tw:border-0 tw:py-8 tw:flex tw:items-center tw:gap-8 tw:text-14 tw:cursor-pointer tw:text-gray-600">
            <span
              className="tw:inline-flex tw:items-center tw:justify-center tw:w-20 tw:h-20 tw:rounded-full tw:text-12 tw:font-medium"
              style={{ backgroundColor: '#c3c9d0', color: '#fff' }}
            >
              2
            </span>
            생성 옵션
          </button>
        </div>

        {/* Main Content */}
        <div className="tw:flex-1 tw:overflow-y-auto">
          <div
            className="tw:grid tw:gap-32 tw:p-32"
            style={{ gridTemplateColumns: '1fr 400px' }}
          >
            {/* Left Panel - Condition Builder */}
            <div>
              <div className="tw:flex tw:items-center tw:gap-6 tw:mb-16">
                <Heading as="h2" size={16} weight="semibold">
                  조건 정의
                </Heading>
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    <button className="tw:border-0 tw:bg-transparent tw:cursor-pointer">
                      <Icon size={16} color="#a5abb2">
                        help
                      </Icon>
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content appearance="dark" placement="top">
                    조건을 정의하여 오디언스를 생성합니다.
                  </Tooltip.Content>
                </Tooltip>
              </div>

              {groups.length === 0 ? (
                <EmptyConditionBuilder onAddCondition={addFirstCondition} />
              ) : (
                <>
                  {/* Auto Added Condition */}
                  {autoAddedCondition && (
                    <>
                      <ConditionBlock
                        condition={autoAddedCondition}
                        onUpdate={() => {}}
                        onRemove={() => {}}
                        isFirst={true}
                        isAutoAdded={true}
                      />
                      <div className="tw:flex tw:items-center tw:py-12">
                        <span
                          className="tw:flex tw:items-center tw:gap-6 tw:px-12 tw:py-6 tw:rounded-6 tw:text-14"
                          style={{ backgroundColor: '#ecf0f4', color: '#2b2d2f' }}
                        >
                          and also
                        </span>
                      </div>
                    </>
                  )}

                  {/* Condition Groups */}
                  {groups.map((group, index) => (
                    <div key={group.id}>
                      {index > 0 && (
                        <div className="tw:flex tw:items-center tw:py-12">
                          <button
                            className="tw:flex tw:items-center tw:gap-6 tw:px-12 tw:py-6 tw:rounded-6 tw:text-14 tw:border-0 tw:cursor-pointer"
                            style={{ backgroundColor: '#ecf0f4', color: '#2b2d2f' }}
                          >
                            and also
                            <Icon size={12} color="#606468">
                              expand_more
                            </Icon>
                          </button>
                        </div>
                      )}
                      <ConditionGroup
                        group={group}
                        groupIndex={index}
                        onUpdate={(updated) => updateGroup(index, updated)}
                        onRemove={() => removeGroup(index)}
                        isFirst={!autoAddedCondition && index === 0}
                      />
                    </div>
                  ))}

                  {/* Add Group Buttons */}
                  <div className="tw:flex tw:gap-8 tw:mt-16">
                    <button
                      onClick={() => addGroup('performed')}
                      className="tw:flex tw:items-center tw:gap-4 tw:px-12 tw:py-6 tw:rounded-6 tw:text-14 tw:cursor-pointer"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px dashed #c3c9d0',
                        color: '#2f87f7',
                      }}
                    >
                      + performed event
                    </button>
                    <button
                      onClick={() => addGroup('didnt')}
                      className="tw:flex tw:items-center tw:gap-4 tw:px-12 tw:py-6 tw:rounded-6 tw:text-14 tw:cursor-pointer"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px dashed #c3c9d0',
                        color: '#2f87f7',
                      }}
                    >
                      + didn't perform event
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Panel - Summary */}
            <div className="tw:border-l tw:border-gray-200 tw:pl-32">
              {/* Identifier Selection */}
              <Heading as="h3" size={16} weight="semibold" className="tw:mb-12">
                식별자 종류 선택
              </Heading>
              <Text size={13} color="secondary" className="tw:mb-16 tw:leading-relaxed">
                CSV 파일 추출 시 오디언스로 확인할 식별자 종류를 1개 이상 선택해 주세요. 이때
                오디언스를 채널로 전송할 때는 GAID, IDFA만 사용되니 유의해 주세요.{' '}
                <a href="#" className="tw:text-blue-500 tw:underline">
                  유의사항
                </a>
              </Text>

              <div className="tw:flex tw:flex-col tw:gap-12">
                {IDENTIFIERS.map((item) => (
                  <label
                    key={item.id}
                    className="tw:flex tw:items-center tw:gap-8 tw:cursor-pointer tw:text-14"
                    style={{ color: '#2b2d2f' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIdentifiers.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIdentifiers([...selectedIdentifiers, item.id])
                        } else {
                          setSelectedIdentifiers(selectedIdentifiers.filter((id) => id !== item.id))
                        }
                      }}
                      className="tw:w-14 tw:h-14"
                      style={{ accentColor: '#2f87f7' }}
                    />
                    {item.label}
                    {item.hasInfo && (
                      <Icon size={14} color="#a5abb2">
                        help
                      </Icon>
                    )}
                  </label>
                ))}
              </div>

              {/* Hint */}
              <div
                className="tw:flex tw:items-center tw:gap-6 tw:mt-16 tw:p-12 tw:rounded-6 tw:text-13"
                style={{ backgroundColor: '#f5f7fa', color: '#606468' }}
              >
                <Icon size={14} color="#a5abb2">
                  info
                </Icon>
                선택한 옵션에 따라 예상 유저 수가 계산됩니다.
              </div>

              {/* Condition Summary */}
              <Heading as="h3" size={16} weight="semibold" className="tw:mt-24 tw:mb-16">
                조건 요약
              </Heading>
              <ConditionSummary groups={groups} autoAddedCondition={autoAddedCondition} />

              {/* Estimated Users */}
              <div
                className="tw:mt-24 tw:p-16 tw:rounded-6"
                style={{
                  backgroundColor: warning ? '#fef2f2' : '#fafbfc',
                  border: warning ? '1px solid #fecaca' : '1px solid #e5e9ee',
                }}
              >
                <div className="tw:flex tw:items-center tw:gap-6 tw:mb-12">
                  <Text size={14} weight="medium" color="secondary">
                    예상 유저 수
                  </Text>
                  <Tooltip>
                    <Tooltip.Trigger asChild>
                      <button className="tw:border-0 tw:bg-transparent tw:cursor-pointer">
                        <Icon size={14} color="#a5abb2">
                          help
                        </Icon>
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Content appearance="dark" placement="top">
                      설정한 조건에 해당하는 예상 유저 수입니다.
                    </Tooltip.Content>
                  </Tooltip>
                </div>

                {warning ? (
                  <div
                    className="tw:flex tw:items-start tw:gap-8 tw:p-12 tw:rounded-6 tw:mb-8"
                    style={{ backgroundColor: '#fef2f2' }}
                  >
                    <Icon size={16} color="#EF4444">
                      error
                    </Icon>
                    <Text size={13} className="tw:leading-relaxed" style={{ color: '#991b1b' }}>
                      {warning.message}
                    </Text>
                  </div>
                ) : (
                  <div
                    className="tw:text-32 tw:font-semibold tw:mb-8"
                    style={{ color: '#2b2d2f', lineHeight: 1.2 }}
                  >
                    {estimatedUsers !== null ? `≈${estimatedUsers.toLocaleString()}` : '-'}
                  </div>
                )}

                {!warning && estimatedUsers !== null && (
                  <Text size={12} color="secondary">
                    <span className="tw:mr-4" style={{ color: '#a5abb2' }}>
                      최근 계산 일시
                    </span>
                    {formatDate(lastCalculated)}
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="tw:flex tw:justify-end tw:px-32 tw:py-24 tw:border-t tw:border-gray-200">
          <Button
            appearance="filled"
            color="blue"
            size="md"
            disabled={isNextDisabled}
            className="tw:min-w-120"
          >
            <span>다음</span>
            <Icon size={16}>arrow_forward</Icon>
          </Button>
        </div>
      </div>
    </div>
  )
}
