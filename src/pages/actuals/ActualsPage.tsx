import { useState } from 'react'
import { Button, Text, Tag, Icon, Tooltip } from '@airbridge/component'

// ============================================
// Mock Data
// ============================================
const MOCK_METRICS = ['Installs', 'Revenue', 'Cost', 'ROAS']
const MOCK_DIMENSIONS = ['Date', 'Channel', 'Campaign']
const MOCK_FILTERS = [{ field: 'Country', values: ['KR', 'US', 'JP'] }]

const MOCK_DATA = [
  { date: '2024-01-01', channel: 'Google Ads', campaign: 'Winter Sale', installs: 1234, revenue: 5678, cost: 1200, roas: 4.73 },
  { date: '2024-01-01', channel: 'Meta Ads', campaign: 'Retargeting', installs: 987, revenue: 4321, cost: 890, roas: 4.85 },
  { date: '2024-01-02', channel: 'Apple Search Ads', campaign: 'Brand', installs: 567, revenue: 2345, cost: 450, roas: 5.21 },
  { date: '2024-01-02', channel: 'TikTok Ads', campaign: 'Awareness', installs: 890, revenue: 3456, cost: 780, roas: 4.43 },
  { date: '2024-01-03', channel: 'Organic', campaign: '-', installs: 2345, revenue: 8901, cost: 0, roas: 0 },
  { date: '2024-01-03', channel: 'Google Ads', campaign: 'Winter Sale', installs: 1567, revenue: 6234, cost: 1400, roas: 4.45 },
  { date: '2024-01-04', channel: 'Meta Ads', campaign: 'Lookalike', installs: 789, revenue: 3456, cost: 670, roas: 5.16 },
  { date: '2024-01-04', channel: 'Unity Ads', campaign: 'Gaming', installs: 456, revenue: 1890, cost: 340, roas: 5.56 },
]

const SUMMARY = {
  sum: { installs: 8835, revenue: 36281, cost: 5730, roas: 0 },
  avg: { installs: 1104, revenue: 4535, cost: 716, roas: 4.91 },
}

export function ActualsPage() {
  const [isConfigFolded, setIsConfigFolded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(25)
  const [showEmptyState] = useState(false) // Toggle to show empty state

  return (
    <div className="tw:pb-60">
      {/* ============================================== */}
      {/* Report Header */}
      {/* ============================================== */}
      <section className="tw:flex tw:items-center tw:gap-6 tw:mb-16">
        <Text size={16} weight="medium" className="tw:text-gray-900">
          Actuals Report
        </Text>
        <div className="tw:w-px tw:h-16 tw:bg-gray-200" />
        <div className="tw:flex tw:items-center tw:gap-2">
          {/* Bookmark Dropdown */}
          <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:rounded-6 hover:tw:bg-gray-50">
            <Icon size={16} className="tw:text-blue-500">star</Icon>
            <Text size={14} weight="medium">Bookmarks</Text>
            <Icon size={16} className="tw:text-gray-500">keyboard_arrow_down</Icon>
          </button>
          {/* Saved Report Dropdown */}
          <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:rounded-6 hover:tw:bg-gray-50">
            <Text size={14} weight="medium" className="tw:whitespace-nowrap">Saved Reports</Text>
            <Icon size={16} className="tw:text-gray-500">keyboard_arrow_down</Icon>
          </button>
        </div>
      </section>

      {/* ============================================== */}
      {/* Toolbar */}
      {/* ============================================== */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-12">
        {/* Left - Report Name Input */}
        <div className="tw:relative">
          <input
            type="text"
            placeholder="Enter report name"
            className="tw:w-200 tw:px-8 tw:py-6 tw:text-14 tw:border-0 tw:border-b tw:border-transparent tw:bg-transparent tw:outline-none hover:tw:border-gray-300 focus:tw:border-blue-500"
          />
          <Icon size={16} className="tw:absolute tw:right-0 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400">
            edit
          </Icon>
        </div>

        {/* Right - Action Buttons */}
        <div className="tw:flex tw:items-center tw:gap-6">
          {/* Copy Config Split Button */}
          <div className="tw:flex tw:items-center">
            <Button appearance="outline" color="gray" size="sm" disabled className="tw:rounded-r-0 tw:border-r-0">
              <Icon size={13}>filter_none</Icon>
              <span>Copy Config</span>
            </Button>
            <Button appearance="outline" color="gray" size="sm" className="tw:rounded-l-0 tw:px-6">
              <Icon size={13}>expand_more</Icon>
            </Button>
          </div>

          {/* CSV Download Split Button */}
          <div className="tw:flex tw:items-center">
            <Button appearance="outline" color="gray" size="sm" disabled className="tw:rounded-r-0 tw:border-r-0">
              <Icon size={15}>get_app</Icon>
              <span>CSV Download</span>
            </Button>
            <Button appearance="outline" color="gray" size="sm" className="tw:rounded-l-0 tw:px-6">
              <Icon size={13}>expand_more</Icon>
            </Button>
          </div>

          {/* Save Button */}
          <Button appearance="filled" color="green" size="sm" disabled>
            <Icon size={13}>save</Icon>
            <span>Save</span>
          </Button>
        </div>
      </div>

      {/* ============================================== */}
      {/* ConfigBox */}
      {/* ============================================== */}
      <div className="tw:mb-16">
        <div
          className="tw:relative tw:w-full tw:border tw:border-gray-200 tw:rounded-12 tw:text-left"
          style={{
            minWidth: 860,
            padding: isConfigFolded ? '8px 20px' : '20px 20px 16px',
          }}
        >
          <div className="tw:flex tw:flex-nowrap tw:flex-row">
            <div className="tw:flex-1 tw:min-w-0">
              {isConfigFolded ? (
                /* Folded Summary View */
                <div className="tw:flex tw:flex-nowrap tw:items-center tw:h-full tw:w-full tw:text-14">
                  <p className="tw:max-w-[35%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Date Range</span>
                    <span>2024-12-31 ~ 2025-01-06</span>
                  </p>
                  <p className="tw:max-w-[35%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Metrics</span>
                    <span className="tw:mr-4">(4/20)</span>
                    {MOCK_METRICS.map((m, i) => <span key={m}>{m}{i < MOCK_METRICS.length - 1 ? ', ' : ''}</span>)}
                  </p>
                  <p className="tw:max-w-[35%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Group By</span>
                    <span className="tw:mr-4">(3/10)</span>
                    {MOCK_DIMENSIONS.map((d, i) => <span key={d}>{d}{i < MOCK_DIMENSIONS.length - 1 ? ', ' : ''}</span>)}
                  </p>
                </div>
              ) : (
                /* Expanded Edit View */
                <div className="tw:flex tw:flex-col">
                  {/* Date Range Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Date Range</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:items-center tw:gap-8">
                      <Button appearance="outline" color="gray" size="sm">
                        <Icon size={13}>date_range</Icon>
                        <span className="tw:text-gray-500">Between</span>
                        <span>2024-12-31</span>
                        <span className="tw:text-gray-400">~</span>
                        <span>2025-01-06</span>
                      </Button>
                      <Button appearance="outline" color="gray" size="sm">
                        <span>Asia/Seoul UTC+09:00</span>
                        <Icon size={16}>expand_more</Icon>
                      </Button>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Metrics</span>
                        <span className="tw:text-gray-400 tw:text-13">{MOCK_METRICS.length}</span>
                        <span className="tw:text-gray-400 tw:text-13">/20</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:flex-wrap tw:items-center tw:gap-6">
                      {MOCK_METRICS.map(metric => (
                        <Tag key={metric} size="normal" className="tw:cursor-grab">
                          <Icon size={12} className="tw:text-gray-400 tw:mr-2">drag_indicator</Icon>
                          {metric}
                          <button className="tw:ml-4 tw:text-gray-400 hover:tw:text-gray-600">
                            <Icon size={12}>close</Icon>
                          </button>
                        </Tag>
                      ))}
                      <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:text-14 tw:text-gray-600 hover:tw:bg-gray-50 tw:rounded-6">
                        <Icon size={16}>add</Icon>
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Group By Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Group By</span>
                        <span className="tw:text-gray-400 tw:text-13">{MOCK_DIMENSIONS.length}</span>
                        <span className="tw:text-gray-400 tw:text-13">/10</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:flex-wrap tw:items-center tw:gap-6">
                      {MOCK_DIMENSIONS.map(dim => (
                        <Tag key={dim} size="normal" className="tw:cursor-grab">
                          <Icon size={12} className="tw:text-gray-400 tw:mr-2">drag_indicator</Icon>
                          {dim}
                          <button className="tw:ml-4 tw:text-gray-400 hover:tw:text-gray-600">
                            <Icon size={12}>close</Icon>
                          </button>
                        </Tag>
                      ))}
                      <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:text-14 tw:text-gray-600 hover:tw:bg-gray-50 tw:rounded-6">
                        <Icon size={16}>add</Icon>
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Filters Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Filters</span>
                        <span className="tw:text-gray-400 tw:text-13">{MOCK_FILTERS.length}</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:flex-col tw:items-start tw:gap-8">
                      {MOCK_FILTERS.map((filter, i) => (
                        <div key={i} className="tw:flex tw:items-center tw:gap-8">
                          <Tag size="normal">
                            <Icon size={12} className="tw:text-gray-400 tw:mr-2">drag_indicator</Icon>
                            {filter.field}
                          </Tag>
                          <Text size={12} className="tw:text-gray-500">is</Text>
                          <div className="tw:flex tw:gap-4">
                            {filter.values.map(v => (
                              <Tag key={v} size="normal" color="blue">
                                {v}
                                <button className="tw:ml-4 tw:text-blue-400 hover:tw:text-blue-600">
                                  <Icon size={12}>close</Icon>
                                </button>
                              </Tag>
                            ))}
                          </div>
                          <button className="tw:text-gray-400 hover:tw:text-gray-600">
                            <Icon size={14}>close</Icon>
                          </button>
                        </div>
                      ))}
                      <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:text-14 tw:text-gray-600 hover:tw:bg-gray-50 tw:rounded-6">
                        <Icon size={16}>add</Icon>
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Aggregation Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Aggregation</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:items-center">
                      <Button appearance="outline" color="gray" size="sm">
                        <span className="tw:text-gray-500">is based on</span>
                        <span>Event Date</span>
                        <Icon size={16}>expand_more</Icon>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wide Controls Button */}
            <div className={`tw:flex tw:flex-col tw:items-center ${isConfigFolded ? 'tw:justify-center' : 'tw:justify-start'} tw:ml-auto tw:min-w-fit`}>
              <Tooltip>
                <Tooltip.Trigger asChild>
                  <button className="tw:w-26 tw:h-26 tw:flex tw:items-center tw:justify-center tw:rounded-6 hover:tw:bg-gray-100">
                    <Icon size={18} className="tw:text-gray-500">tune</Icon>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content appearance="dark" placement="top">
                  Wide Controls
                </Tooltip.Content>
              </Tooltip>
            </div>
          </div>

          {/* Collapse/Expand Button */}
          <Tooltip>
            <Tooltip.Trigger asChild>
              <button
                className="tw:absolute tw:left-1/2 tw:-translate-x-1/2 tw:-bottom-8 tw:w-70 tw:h-16 tw:flex tw:items-center tw:justify-center tw:bg-white tw:border tw:border-gray-200 tw:rounded-full hover:tw:bg-gray-50 tw:transition-colors"
                onClick={() => setIsConfigFolded(!isConfigFolded)}
              >
                <Icon size={18} className="tw:text-gray-500">
                  {isConfigFolded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
                </Icon>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content appearance="dark" placement="bottom">
              {isConfigFolded ? 'Expand' : 'Collapse'}
            </Tooltip.Content>
          </Tooltip>
        </div>
      </div>

      {/* Notifications Area (empty for now) */}
      <div className="tw:flex tw:flex-col tw:gap-y-12" />

      {/* ============================================== */}
      {/* DataGrid Toolbar */}
      {/* ============================================== */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-12 tw:mt-24">
        <div className="tw:flex tw:items-center tw:gap-12">
          <div className="tw:relative tw:w-218">
            <input
              type="search"
              placeholder="Search"
              className="tw:w-full tw:h-32 tw:pl-32 tw:pr-8 tw:text-14 tw:border tw:border-gray-200 tw:rounded-6 tw:outline-none focus:tw:border-blue-500"
            />
            <Icon size={16} className="tw:absolute tw:left-10 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400">
              search
            </Icon>
          </div>
        </div>

        <div className="tw:flex tw:items-center tw:gap-6">
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={12}>refresh</Icon>
            <span>Refresh</span>
          </Button>
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={12}>filter_none</Icon>
            <span>Copy Table</span>
          </Button>
        </div>
      </div>

      {/* ============================================== */}
      {/* Content Area - Empty State or DataGrid */}
      {/* ============================================== */}
      {showEmptyState ? (
        /* Empty State */
        <div className="tw:border tw:border-gray-200 tw:rounded-6 tw:py-60 tw:flex tw:flex-col tw:items-center tw:justify-center">
          <img
            src="https://static.airbridge.io/images/resources/actual_blank_illust.png"
            alt="Empty state"
            className="tw:w-200 tw:mb-24"
          />
          <Text size={16} weight="medium" className="tw:text-gray-900 tw:mb-8">
            Analyze your campaign performance
          </Text>
          <Text size={14} className="tw:text-gray-600 tw:mb-16 tw:text-center">
            Configure various data fields to build your custom report
          </Text>
          <a
            href="https://help.airbridge.io/en/guides/actuals-report"
            target="_blank"
            rel="noopener noreferrer"
            className="tw:flex tw:items-center tw:gap-4 tw:text-14 tw:text-blue-600 hover:tw:underline"
          >
            <Icon size={16}>menu_book</Icon>
            View Guide
          </a>
        </div>
      ) : (
        /* DataGrid */
        <>
          <div className="tw:border tw:border-gray-200 tw:rounded-6 tw:overflow-hidden tw:mb-16">
            <div className="tw:overflow-x-auto">
              <table className="tw:w-full tw:min-w-800">
                <thead>
                  <tr className="tw:bg-gray-50 tw:border-b tw:border-gray-200">
                    <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:sticky tw:left-0 tw:bg-gray-50 tw:z-10 tw:w-120">
                      <div className="tw:flex tw:items-center tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Date</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:w-140">
                      <div className="tw:flex tw:items-center tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Channel</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:w-140">
                      <div className="tw:flex tw:items-center tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Campaign</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100 tw:w-120">
                      <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Installs</Text>
                        <div className="tw:flex tw:items-center">
                          <span className="tw:w-16 tw:h-16 tw:rounded-full tw:bg-blue-100 tw:text-blue-600 tw:text-10 tw:flex tw:items-center tw:justify-center tw:font-medium">1</span>
                          <Icon size={14} className="tw:text-blue-500">arrow_downward</Icon>
                        </div>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100 tw:w-120">
                      <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Revenue</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100 tw:w-120">
                      <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">Cost</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                    <th className="tw:p-12 tw:text-right tw:w-100">
                      <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                        <Text size={12} weight="medium" className="tw:text-gray-700">ROAS</Text>
                        <Icon size={14} className="tw:text-gray-400">unfold_more</Icon>
                      </div>
                    </th>
                  </tr>

                  {/* Summary Row - Sum */}
                  <tr className="tw:bg-gray-50 tw:border-b tw:border-gray-200">
                    <td className="tw:p-12 tw:border-r tw:border-gray-100 tw:sticky tw:left-0 tw:bg-gray-50 tw:z-10" colSpan={3}>
                      <Text size={12} weight="medium" className="tw:text-gray-600">Sum</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">{SUMMARY.sum.installs.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">${SUMMARY.sum.revenue.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">${SUMMARY.sum.cost.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right">
                      <Text size={12} className="tw:text-gray-400">-</Text>
                    </td>
                  </tr>

                  {/* Summary Row - Average */}
                  <tr className="tw:bg-gray-50 tw:border-b tw:border-gray-200">
                    <td className="tw:p-12 tw:border-r tw:border-gray-100 tw:sticky tw:left-0 tw:bg-gray-50 tw:z-10" colSpan={3}>
                      <Text size={12} weight="medium" className="tw:text-gray-600">Average</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">{SUMMARY.avg.installs.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">${SUMMARY.avg.revenue.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">${SUMMARY.avg.cost.toLocaleString()}</Text>
                    </td>
                    <td className="tw:p-12 tw:text-right">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono">{SUMMARY.avg.roas.toFixed(2)}</Text>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {MOCK_DATA.map((row, i) => (
                    <tr
                      key={i}
                      className={`tw:border-b tw:border-gray-100 hover:tw:bg-blue-50 tw:transition-colors tw:group ${i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'}`}
                    >
                      <td className={`tw:p-12 tw:border-r tw:border-gray-100 tw:sticky tw:left-0 tw:z-10 ${i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'} group-hover:tw:bg-blue-50`}>
                        <div className="tw:flex tw:items-center tw:gap-4">
                          <Text size={12} className="tw:text-gray-900">{row.date}</Text>
                          <div className="tw:hidden group-hover:tw:flex tw:gap-2">
                            <button className="tw:w-18 tw:h-18 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:bg-green-100 hover:tw:bg-green-200">
                              <Icon size={12} className="tw:text-green-600">add</Icon>
                            </button>
                            <button className="tw:w-18 tw:h-18 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:bg-red-100 hover:tw:bg-red-200">
                              <Icon size={12} className="tw:text-red-600">remove</Icon>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="tw:p-12 tw:border-r tw:border-gray-100">
                        <div className="tw:flex tw:items-center tw:gap-4">
                          <Text size={12} className="tw:text-gray-900">{row.channel}</Text>
                          <div className="tw:hidden group-hover:tw:flex tw:gap-2">
                            <button className="tw:w-18 tw:h-18 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:bg-green-100 hover:tw:bg-green-200">
                              <Icon size={12} className="tw:text-green-600">add</Icon>
                            </button>
                            <button className="tw:w-18 tw:h-18 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:bg-red-100 hover:tw:bg-red-200">
                              <Icon size={12} className="tw:text-red-600">remove</Icon>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="tw:p-12 tw:border-r tw:border-gray-100">
                        <Text size={12} className="tw:text-gray-900">{row.campaign}</Text>
                      </td>
                      <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                        <Text size={12} className="tw:text-gray-900 tw:font-mono">{row.installs.toLocaleString()}</Text>
                      </td>
                      <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                        <Text size={12} className="tw:text-gray-900 tw:font-mono">${row.revenue.toLocaleString()}</Text>
                      </td>
                      <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                        <Text size={12} className="tw:text-gray-900 tw:font-mono">${row.cost.toLocaleString()}</Text>
                      </td>
                      <td className="tw:p-12 tw:text-right">
                        <Text size={12} className="tw:text-gray-900 tw:font-mono">{row.roas > 0 ? row.roas.toFixed(2) : '-'}</Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="tw:flex tw:justify-between tw:items-center tw:mt-16">
            <div className="tw:flex tw:items-center tw:gap-16">
              <div className="tw:flex tw:items-center tw:gap-8">
                <Text size={13} className="tw:text-gray-500">Total Rows</Text>
                <Text size={13} weight="medium" className="tw:text-gray-900">1,234</Text>
              </div>
              <div className="tw:flex tw:items-center tw:gap-8">
                <Text size={13} className="tw:text-gray-500">Show Rows</Text>
                <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:border tw:border-gray-200 tw:rounded-4 hover:tw:bg-gray-50">
                  <Text size={13}>{rowsPerPage}</Text>
                  <Icon size={14} className="tw:text-gray-400">keyboard_arrow_down</Icon>
                </button>
              </div>
            </div>

            <div className="tw:flex tw:items-center tw:gap-4">
              <Button appearance="outline" color="gray" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                <Icon size={14}>first_page</Icon>
              </Button>
              <Button appearance="outline" color="gray" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <Icon size={14}>chevron_left</Icon>
              </Button>

              <div className="tw:flex tw:items-center tw:gap-2 tw:mx-8">
                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    className={`tw:w-28 tw:h-28 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:text-13 tw:font-medium tw:transition-colors ${
                      currentPage === page ? 'tw:bg-blue-500 tw:text-white' : 'tw:text-gray-600 hover:tw:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <Text size={13} className="tw:text-gray-400 tw:mx-4">...</Text>
                <button
                  className="tw:w-28 tw:h-28 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:text-13 tw:font-medium tw:text-gray-600 hover:tw:bg-gray-100"
                  onClick={() => setCurrentPage(50)}
                >
                  50
                </button>
              </div>

              <Button appearance="outline" color="gray" size="sm" onClick={() => setCurrentPage(p => Math.min(50, p + 1))}>
                <Icon size={14}>chevron_right</Icon>
              </Button>
              <Button appearance="outline" color="gray" size="sm" onClick={() => setCurrentPage(50)}>
                <Icon size={14}>last_page</Icon>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
