import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from '@airbridge/component'
import { GNB_HEIGHT, LNB_WIDTH } from '../../constants/layout'

interface SubMenu {
  title: string
  items: { label: string; path: string }[]
}

interface MenuItem {
  category: string
  icon: string
  subMenus: SubMenu[]
}

const MENU_ITEMS: MenuItem[] = [
  {
    category: 'Tracking Link',
    icon: 'link',
    subMenus: [
      {
        title: 'Link Operations',
        items: [
          { label: 'Link Generation', path: '/tracking-link/generation' },
          { label: 'Link Management', path: '/tracking-link/management' },
        ],
      },
      {
        title: 'Link Settings',
        items: [
          { label: 'Custom Domain', path: '/tracking-link/custom-domain' },
          { label: 'Deep Links', path: '/tracking-link/deep-links' },
        ],
      },
    ],
  },
  {
    category: 'Reports',
    icon: 'signal_cellular_alt',
    subMenus: [
      {
        title: 'Performance Analysis',
        items: [
          { label: 'Actuals Report', path: '/reports/actuals' },
          { label: 'Trend Report', path: '/reports/trend' },
          { label: 'Active Users Report', path: '/reports/active-users' },
        ],
      },
      {
        title: 'User Behavior Analysis',
        items: [
          { label: 'Funnel Report', path: '/reports/funnel' },
          { label: 'Retention Report', path: '/reports/retention' },
          { label: 'Revenue Report', path: '/reports/revenue' },
        ],
      },
    ],
  },
  {
    category: 'Integrations',
    icon: 'rule_settings',
    subMenus: [
      {
        title: 'Data Integration',
        items: [
          { label: 'Integration Overview', path: '/integrations/overview' },
          { label: 'Ad Channel Integration', path: '/integrations/ad-channel' },
          { label: 'Third-party Integration', path: '/integrations/third-party' },
        ],
      },
    ],
  },
  {
    category: 'Raw Data',
    icon: 'database',
    subMenus: [
      {
        title: 'Data Export',
        items: [
          { label: 'App Data Export', path: '/raw-data/export/app' },
          { label: 'Web Data Export', path: '/raw-data/export/web' },
        ],
      },
      {
        title: 'Real-time Logs',
        items: [
          { label: 'App Event Logs', path: '/raw-data/real-time/app' },
          { label: 'Web Event Logs', path: '/raw-data/real-time/web' },
        ],
      },
    ],
  },
  {
    category: 'Audience',
    icon: 'groups',
    subMenus: [
      {
        title: 'Audience Manager',
        items: [
          { label: '오디언스 목록', path: '/audience/list' },
          { label: '오디언스 생성', path: '/audience/create' },
        ],
      },
    ],
  },
  {
    category: 'Management',
    icon: 'tune',
    subMenus: [
      {
        title: 'Rule Settings',
        items: [
          { label: 'Attribution Rules', path: '/management/attribution-rules' },
          { label: 'SKAN Conversion', path: '/management/skan-conversion' },
        ],
      },
    ],
  },
  {
    category: 'Settings',
    icon: 'settings',
    subMenus: [
      {
        title: 'Airbridge App',
        items: [
          { label: 'App Settings', path: '/settings/app-settings' },
          { label: 'Token Management', path: '/settings/tokens' },
        ],
      },
      {
        title: 'Users',
        items: [
          { label: 'User Management', path: '/settings/user-management' },
          { label: 'Activity History', path: '/settings/activity-history' },
        ],
      },
    ],
  },
]

interface LocalNavigationBarProps {
  isFolded: boolean
}

export function LocalNavigationBar({ isFolded }: LocalNavigationBarProps) {
  const location = useLocation()
  const [expandedCategory, setExpandedCategory] = useState<string | null>(() => {
    // Find which category contains the current path
    for (const menu of MENU_ITEMS) {
      for (const subMenu of menu.subMenus) {
        if (subMenu.items.some(item => location.pathname.startsWith(item.path))) {
          return menu.category
        }
      }
    }
    return 'Reports'
  })

  const isPathInCategory = (menu: MenuItem) => {
    return menu.subMenus.some(subMenu =>
      subMenu.items.some(item => location.pathname.startsWith(item.path))
    )
  }

  return (
    <aside
      className="tw:fixed tw:left-0 tw:z-10 tw:flex tw:flex-col tw:overflow-x-hidden tw:overflow-y-auto tw:bg-white tw:border-r tw:border-gray-200"
      style={{
        top: GNB_HEIGHT,
        width: isFolded ? LNB_WIDTH.FOLDED : LNB_WIDTH.EXPANDED,
        height: `calc(100vh - ${GNB_HEIGHT}px)`,
        paddingLeft: isFolded ? 12 : 20,
        paddingRight: isFolded ? 12 : 20,
      }}
    >
      {/* App Selector */}
      <div className="tw:sticky tw:top-0 tw:z-10 tw:pt-32 tw:pb-16 tw:bg-white">
        <button className="tw:flex tw:w-full tw:cursor-pointer tw:items-center tw:gap-x-6 tw:rounded-12 tw:p-6 tw:bg-white hover:tw:bg-gray-50">
          <img
            alt="myapp"
            className="tw:size-32 tw:min-w-32 tw:rounded-6"
            src="https://play-lh.googleusercontent.com/gJZYXTPS_9AJYJfzRj1tT8IRMQ7rerhhlYmXSVyt8bV_gouL3kW46d_zY6VLnreyMA=w240-h480-rw"
          />
          {!isFolded && (
            <>
              <span className="tw:text-gray-900 tw:line-clamp-2 tw:min-w-0 tw:flex-1 tw:text-left tw:text-14 tw:font-semibold tw:break-words">
                myapp
              </span>
              <Icon size={16} className="tw:text-gray-500">expand_more</Icon>
            </>
          )}
        </button>
      </div>

      {/* Spacer */}
      <div className="tw:min-h-16 tw:w-full" />

      {/* Menu Categories */}
      <nav className="tw:mb-20 tw:flex tw:w-full tw:flex-col tw:gap-y-6">
        {MENU_ITEMS.map((menu) => {
          const isActive = isPathInCategory(menu)
          const isExpanded = expandedCategory === menu.category

          return (
            <div key={menu.category} className="tw:group tw:w-full">
              {/* Category Header */}
              <button
                className={`tw:flex tw:w-full tw:items-center tw:gap-x-8 tw:px-8 tw:py-8 tw:rounded-8 tw:transition-colors ${
                  isActive ? 'tw:text-blue-600' : 'tw:text-gray-700'
                } hover:tw:bg-gray-50`}
                onClick={() => setExpandedCategory(isExpanded ? null : menu.category)}
              >
                <div className="tw:flex tw:items-center tw:justify-center tw:w-24 tw:h-24">
                  <Icon size={20} className={isActive ? 'tw:text-blue-600' : 'tw:text-gray-600'}>
                    {menu.icon}
                  </Icon>
                </div>
                {!isFolded && (
                  <>
                    <span className={`tw:flex-1 tw:text-left tw:text-14 tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap ${
                      isActive ? 'tw:font-semibold' : 'tw:font-medium'
                    }`}>
                      {menu.category}
                    </span>
                    <div
                      className={`tw:flex tw:items-center tw:justify-center tw:w-16 tw:h-16 tw:transition-opacity ${
                        isExpanded ? 'tw:opacity-100' : 'tw:opacity-0 group-hover:tw:opacity-100'
                      }`}
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <Icon size={16}>keyboard_arrow_down</Icon>
                    </div>
                  </>
                )}
              </button>

              {/* Sub Menus */}
              {!isFolded && isExpanded && (
                <div className="tw:mt-8 tw:ml-4 tw:flex tw:flex-col tw:gap-y-12 tw:pl-32">
                  {menu.subMenus.map((subMenu) => (
                    <div key={subMenu.title} className="tw:flex tw:w-full tw:flex-col tw:gap-y-2 tw:pb-16">
                      {/* Sub Menu Title */}
                      <span className="tw:px-8 tw:pb-6 tw:text-12 tw:font-medium" style={{ color: '#285096' }}>
                        {subMenu.title}
                      </span>
                      {/* Menu Items */}
                      <ul className="tw:flex tw:flex-col tw:gap-y-2">
                        {subMenu.items.map((item) => (
                          <li key={item.path}>
                            <NavLink
                              to={item.path}
                              className={({ isActive }) =>
                                `tw:flex tw:items-center tw:w-full tw:px-8 tw:py-4 tw:gap-4 tw:rounded-4 tw:text-14 tw:text-left tw:leading-normal tw:transition-all tw:duration-200 tw:whitespace-nowrap ${
                                  isActive
                                    ? 'tw:font-semibold tw:text-blue-600 tw:bg-blue-50'
                                    : 'tw:font-regular tw:text-gray-900 hover:tw:bg-gray-50'
                                }`
                              }
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
