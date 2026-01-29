import { Text } from '@airbridge/component'
import type { ConditionGroup as ConditionGroupType, Condition } from '../types'
import { createEmptyCondition } from '../types'
import { ConditionBlock } from './ConditionBlock'

interface ConditionGroupProps {
  group: ConditionGroupType
  groupIndex?: number
  onUpdate: (group: ConditionGroupType) => void
  onRemove: () => void
  isFirst: boolean
}

export function ConditionGroup({
  group,
  onUpdate,
  onRemove,
  isFirst,
}: ConditionGroupProps) {
  const addCondition = (type: 'performed' | 'didnt') => {
    const newCondition = createEmptyCondition(type)
    onUpdate({
      ...group,
      conditions: [...group.conditions, newCondition],
    })
  }

  const updateCondition = (index: number, updated: Condition) => {
    const newConditions = [...group.conditions]
    newConditions[index] = updated
    onUpdate({ ...group, conditions: newConditions })
  }

  const removeCondition = (index: number) => {
    if (group.conditions.length === 1) {
      onRemove()
    } else {
      onUpdate({
        ...group,
        conditions: group.conditions.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div>
      {group.conditions.map((condition, condIndex) => (
        <div key={condition.id}>
          {condIndex > 0 && (
            <div className="tw:py-8 tw:pl-20">
              <Text size={14} color="secondary">
                ..or
              </Text>
            </div>
          )}
          <ConditionBlock
            condition={condition}
            onUpdate={(updated) => updateCondition(condIndex, updated)}
            onRemove={() => removeCondition(condIndex)}
            isFirst={isFirst && condIndex === 0}
            isAutoAdded={condition.isAutoAdded}
          />
        </div>
      ))}

      {/* Or 버튼들 */}
      <div className="tw:flex tw:gap-8 tw:mt-12 tw:pl-20">
        <button
          onClick={() => addCondition('performed')}
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
          onClick={() => addCondition('didnt')}
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
    </div>
  )
}
