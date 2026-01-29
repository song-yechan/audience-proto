import { useLocation } from 'react-router-dom'
import { Text, Icon } from '@airbridge/component'

export function PlaceholderPage() {
  const location = useLocation()
  const pageName = location.pathname.split('/').filter(Boolean).pop() || 'Page'
  const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1)

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full tw:min-h-400">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-16 tw:p-32 tw:bg-gray-50 tw:rounded-12 tw:border tw:border-gray-200">
        <Icon size={48} className="tw:text-gray-400">construction</Icon>
        <Text size={20} weight="medium" className="tw:text-gray-700">
          {formattedName}
        </Text>
        <Text size={14} className="tw:text-gray-500 tw:text-center">
          This page is not yet implemented.<br />
          Create a new page component in <code className="tw:bg-gray-100 tw:px-4 tw:py-2 tw:rounded-3">src/pages/{pageName}/</code>
        </Text>
      </div>
    </div>
  )
}
