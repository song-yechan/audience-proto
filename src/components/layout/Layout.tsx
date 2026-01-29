import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Icon, Text, Tag } from '@airbridge/component'
import { GlobalNavigationBar } from './GlobalNavigationBar'
import { LocalNavigationBar } from './LocalNavigationBar'
import { AskAirbridgeModal } from '../ask-airbridge'
import { GNB_HEIGHT, LNB_WIDTH, CONTENT_PADDING } from '../../constants/layout'

export function Layout() {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false)
  const [isAskAirbridgeOpen, setIsAskAirbridgeOpen] = useState(false)
  const lnbWidth = isSidebarFolded ? LNB_WIDTH.FOLDED : LNB_WIDTH.EXPANDED

  return (
    <div className="tw:h-screen tw:overflow-hidden tw:flex tw:flex-col">
      {/* GNB */}
      <GlobalNavigationBar />

      {/* Main Area (LNB + Content) */}
      <main
        className="tw:flex tw:flex-1 tw:overflow-x-hidden tw:overflow-y-auto"
        style={{ '--lnb-width': `${lnbWidth}px` } as React.CSSProperties}
      >
        {/* LNB */}
        <LocalNavigationBar isFolded={isSidebarFolded} />

        {/* LNB Toggle Button */}
        <button
          className="tw:fixed tw:z-20 tw:w-16 tw:h-40 tw:flex tw:items-center tw:justify-center tw:bg-white tw:border tw:border-gray-200 tw:rounded-r-6 hover:tw:bg-gray-50 tw:transition-colors"
          style={{ left: lnbWidth - 1, top: GNB_HEIGHT + 100 }}
          onClick={() => setIsSidebarFolded(!isSidebarFolded)}
        >
          <Icon size={14} className="tw:text-gray-400">
            {isSidebarFolded ? 'chevron_right' : 'chevron_left'}
          </Icon>
        </button>

        {/* Content Area */}
        <section
          className="tw:relative tw:box-border tw:min-h-[calc(100vh-110px)] tw:max-w-[100vw] tw:h-full tw:w-full"
          style={{ paddingLeft: lnbWidth }}
        >
          {/* Dashboard__InnerContainer */}
          <div
            className="tw:h-full tw:overflow-x-auto"
            style={{
              paddingTop: CONTENT_PADDING.TOP,
              paddingLeft: CONTENT_PADDING.HORIZONTAL,
              paddingRight: CONTENT_PADDING.HORIZONTAL,
              paddingBottom: CONTENT_PADDING.BOTTOM,
            }}
          >
            <Outlet />
          </div>
        </section>
      </main>

      {/* Ask Airbridge Floating Button */}
      {!isAskAirbridgeOpen && (
        <button
          type="button"
          onClick={() => setIsAskAirbridgeOpen(true)}
          className="tw:fixed tw:bottom-24 tw:right-24 tw:z-40 tw:flex tw:items-center tw:gap-8 tw:px-16 tw:py-12 tw:bg-blue-500 tw:text-white tw:rounded-full tw:shadow-lg hover:tw:bg-blue-600 tw:transition-colors"
          style={{ boxShadow: '0 4px 14px rgba(30, 110, 255, 0.4)' }}
        >
          <Icon size={20} className="tw:text-white">auto_awesome</Icon>
          <Text size={14} weight="medium" className="tw:text-white">Ask Airbridge</Text>
          <Tag color="gray" size="small" appearance="outlined" radius={4}>
            Beta
          </Tag>
        </button>
      )}

      {/* Ask Airbridge Modal */}
      <AskAirbridgeModal
        isOpen={isAskAirbridgeOpen}
        onClose={() => setIsAskAirbridgeOpen(false)}
      />
    </div>
  )
}
