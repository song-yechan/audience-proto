import { Button, Icon } from '@airbridge/component'
import { GNB_HEIGHT } from '../../constants/layout'

export function GlobalNavigationBar() {
  return (
    <nav
      className="tw:sticky tw:top-0 tw:left-0 tw:z-20 tw:w-full tw:max-w-screen tw:flex tw:items-center tw:justify-between tw:pr-10 tw:pl-20 tw:border-b tw:border-gray-300 tw:bg-white"
      style={{ height: GNB_HEIGHT }}
    >
      {/* Left Side */}
      <div className="tw:flex tw:items-center">
        {/* Organization Selector */}
        <Button appearance="ghost" color="gray" size="sm" className="tw:gap-x-4!">
          <Icon size={18} className="tw:text-gray-700">groups</Icon>
          <span className="tw:leading-[1]">My Organization</span>
        </Button>

        {/* App/View Selector */}
        <Button appearance="ghost" color="gray" size="sm" className="tw:gap-x-4!">
          <Icon size={18} className="tw:text-gray-700">widgets</Icon>
          <span className="tw:leading-[1]">Actuals</span>
          <Icon size={16} className="tw:text-gray-500">expand_more</Icon>
        </Button>
      </div>

      {/* Right Side */}
      <div className="tw:flex tw:items-center tw:justify-end tw:gap-x-4">
        {/* Support */}
        <Button appearance="ghost" color="gray" size="sm">
          <Icon size={16}>help</Icon>
          <span className="tw:leading-[1]">Support</span>
        </Button>

        {/* Update */}
        <Button appearance="ghost" color="gray" size="sm">
          <Icon size={16}>update</Icon>
          <span className="tw:leading-[1]">Update</span>
        </Button>

        {/* Language */}
        <Button appearance="ghost" color="gray" size="sm">
          <Icon size={16}>language</Icon>
          <span className="tw:leading-[1]">EN</span>
        </Button>

        {/* Quick Search */}
        <Button appearance="ghost" color="gray" size="sm" className="tw:gap-x-4!">
          <Icon size={16}>search</Icon>
          <span className="tw:leading-[1]">Quick Search</span>
          <span className="tw:flex tw:items-center tw:gap-1">
            <kbd className="tw:text-12 tw:px-4 tw:py-1 tw:bg-gray-100 tw:rounded-3 tw:text-gray-600">⌘</kbd>
            <kbd className="tw:text-12 tw:px-4 tw:py-1 tw:bg-gray-100 tw:rounded-3 tw:text-gray-600">K</kbd>
          </span>
        </Button>

        {/* Divider */}
        <div className="tw:bg-gray-150 tw:h-20 tw:min-w-1" />

        {/* User */}
        <Button appearance="ghost" color="gray" size="sm">
          <Icon size={16} className="tw:text-gray-700">person</Icon>
          <span className="tw:leading-[1]">user</span>
        </Button>
      </div>
    </nav>
  )
}
