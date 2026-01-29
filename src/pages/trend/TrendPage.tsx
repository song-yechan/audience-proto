import { useState } from 'react'
import { Button, Text, Tag, Icon, Tooltip } from '@airbridge/component'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts'

// ============================================
// Mock Data
// ============================================
const MOCK_METRICS = ['Installs (App)']
const MOCK_DIMENSIONS = ['Channel']

const MOCK_CHART_DATA = [
  { date: '01/01', 'Google Ads': 1234, 'Meta Ads': 987, 'Organic': 567 },
  { date: '01/02', 'Google Ads': 1456, 'Meta Ads': 1123, 'Organic': 612 },
  { date: '01/03', 'Google Ads': 1289, 'Meta Ads': 1045, 'Organic': 589 },
  { date: '01/04', 'Google Ads': 1567, 'Meta Ads': 1234, 'Organic': 678 },
  { date: '01/05', 'Google Ads': 1678, 'Meta Ads': 1345, 'Organic': 723 },
  { date: '01/06', 'Google Ads': 1456, 'Meta Ads': 1189, 'Organic': 656 },
  { date: '01/07', 'Google Ads': 1789, 'Meta Ads': 1456, 'Organic': 789 },
]

const MOCK_TABLE_DATA = [
  { metric: 'Installs (App)', channel: 'Google Ads', sum: 10469, '01/01': 1234, '01/02': 1456, '01/03': 1289, '01/04': 1567, '01/05': 1678, '01/06': 1456, '01/07': 1789 },
  { metric: 'Installs (App)', channel: 'Meta Ads', sum: 8379, '01/01': 987, '01/02': 1123, '01/03': 1045, '01/04': 1234, '01/05': 1345, '01/06': 1189, '01/07': 1456 },
  { metric: 'Installs (App)', channel: 'Organic', sum: 4614, '01/01': 567, '01/02': 612, '01/03': 589, '01/04': 678, '01/05': 723, '01/06': 656, '01/07': 789 },
]

const DATE_COLUMNS = ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07']
const CHART_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']

export function TrendPage() {
  const [isConfigFolded, setIsConfigFolded] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([0, 1, 2]))
  const [visibleSeries, setVisibleSeries] = useState<Record<string, boolean>>({
    'Google Ads': true,
    'Meta Ads': true,
    'Organic': true,
  })

  const toggleSeries = (name: string) => {
    setVisibleSeries(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const toggleAllRows = () => {
    if (selectedRows.size === MOCK_TABLE_DATA.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(MOCK_TABLE_DATA.map((_, i) => i)))
    }
  }

  const toggleRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const seriesKeys = Object.keys(visibleSeries)

  return (
    <div className="tw:pb-60">
      {/* ============================================== */}
      {/* Report Header */}
      {/* ============================================== */}
      <section className="tw:flex tw:items-center tw:gap-6 tw:mb-16">
        <Text size={16} weight="medium" className="tw:text-gray-900">
          Trend Report
        </Text>
        <div className="tw:w-px tw:h-16 tw:bg-gray-200" />
        <div className="tw:flex tw:items-center tw:gap-2">
          {/* Saved Report Dropdown */}
          <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:rounded-6 hover:tw:bg-gray-50">
            <Text size={14} weight="medium" className="tw:whitespace-nowrap">Saved Reports</Text>
            <Icon size={16} className="tw:text-gray-500">keyboard_arrow_down</Icon>
          </button>
        </div>
        {/* Airbridge AI Tag */}
        <Tag size="normal" color="gray" className="tw:ml-auto">
          <Icon size={12}>auto_awesome</Icon>
          Airbridge AI
        </Tag>
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
          <Icon size={22} className="tw:absolute tw:right-0 tw:top-1/2 tw:-translate-y-1/2 tw:text-gray-400">
            edit
          </Icon>
        </div>

        {/* Right - Action Buttons */}
        <div className="tw:flex tw:items-center tw:gap-6">
          {/* Refresh Button (icon only) */}
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button appearance="outline" color="gray" size="sm">
                <Icon size={13}>refresh</Icon>
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content appearance="dark" placement="top">
              Refresh
            </Tooltip.Content>
          </Tooltip>

          {/* Copy Config Split Button */}
          <div className="tw:flex tw:items-center">
            <Button appearance="outline" color="gray" size="sm" className="tw:rounded-r-0 tw:border-r-0">
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
                  <p className="tw:max-w-[25%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Date Range</span>
                    <span>2026-01-01 ~ 2026-01-07</span>
                  </p>
                  <p className="tw:text-gray-600 tw:whitespace-nowrap tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Granularity</span>
                    <span>Daily</span>
                  </p>
                  <p className="tw:max-w-[25%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:mr-16 tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Metrics</span>
                    <span className="tw:mr-4">(1/8)</span>
                    {MOCK_METRICS.join(', ')}
                  </p>
                  <p className="tw:max-w-[25%] tw:text-gray-600 tw:whitespace-nowrap tw:overflow-hidden tw:text-ellipsis tw:leading-tight">
                    <span className="tw:text-gray-900 tw:font-medium tw:mr-1">Group By</span>
                    <span className="tw:mr-4">(1/4)</span>
                    {MOCK_DIMENSIONS.join(', ')}
                  </p>
                </div>
              ) : (
                /* Expanded Edit View */
                <div className="tw:flex tw:flex-col">
                  {/* AI Assistant Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">AI Assistant</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:items-center">
                      {/* UCA Switch Button - gradient style matching actual implementation */}
                      <button
                        aria-checked={aiAssistantEnabled}
                        role="switch"
                        onClick={() => setAiAssistantEnabled(!aiAssistantEnabled)}
                        className="tw:flex tw:items-center tw:gap-6 tw:h-28 tw:px-10 tw:py-4 tw:rounded-6 tw:text-14 tw:font-medium tw:transition-all"
                        style={{
                          background: aiAssistantEnabled
                            ? 'linear-gradient(92.61deg, #1e6eff 50%, #5f98ff 100%)'
                            : 'linear-gradient(92.61deg, #f3faff 50%, #f3faff 100%)',
                          color: aiAssistantEnabled ? '#fff' : '#1e6eff',
                          border: '1px solid',
                          borderColor: aiAssistantEnabled ? '#1d69f2' : '#eef5fa',
                        }}
                      >
                        <Icon size={16}>auto_awesome</Icon>
                        <span className="tw:whitespace-nowrap">Unattributed Conversion</span>
                        {/* Toggle Switch (28x14px) */}
                        <div
                          className="tw:flex tw:items-center tw:rounded-full tw:transition-colors"
                          style={{
                            width: 28,
                            height: 14,
                            padding: '0 2.63px',
                            backgroundColor: aiAssistantEnabled ? '#1a4a8f' : '#93c5fd',
                          }}
                        >
                          <div
                            className="tw:rounded-full tw:bg-white tw:transition-transform"
                            style={{
                              width: 8.75,
                              height: 8.75,
                              boxShadow: '0.875px 1.75px 4px 0px rgba(0, 0, 0, 0.2)',
                              transform: aiAssistantEnabled ? 'translateX(13.63px)' : 'translateX(0)',
                            }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Date Range Section (includes Granularity dropdown) */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Date Range</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:items-center tw:gap-8">
                      {/* Granularity Dropdown */}
                      <Button appearance="outline" color="gray" size="sm">
                        <span>Daily</span>
                        <Icon size={16}>expand_more</Icon>
                      </Button>
                      {/* Date Range Picker */}
                      <Button appearance="outline" color="gray" size="sm">
                        <Icon size={13}>date_range</Icon>
                        <span className="tw:text-gray-500">Between</span>
                        <span>2026-01-01</span>
                        <span className="tw:text-gray-400">~</span>
                        <span>2026-01-07</span>
                      </Button>
                      {/* Timezone Selector */}
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
                        <span className="tw:text-gray-400 tw:text-13">/8</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:flex-wrap tw:items-center tw:gap-6">
                      {MOCK_METRICS.map(metric => (
                        /* NewChip - draggable style */
                        <div
                          key={metric}
                          className="tw:inline-flex tw:items-center tw:h-28 tw:min-w-34 tw:bg-gray-100 tw:rounded-6 tw:overflow-hidden hover:tw:bg-gray-200 tw:cursor-pointer"
                          style={{ padding: '0 4px' }}
                          draggable
                        >
                          {/* Section */}
                          <div
                            className="tw:flex tw:items-center tw:h-full tw:text-14"
                            style={{ padding: '0 10px 0 4px', columnGap: 4 }}
                          >
                            <Icon size={13} className="tw:text-gray-500 tw:cursor-move" style={{ marginRight: 4 }}>
                              drag_indicator
                            </Icon>
                            <span>{metric}</span>
                          </div>
                          {/* DeleteButton */}
                          <button
                            className="tw:flex tw:items-center tw:h-full tw:text-gray-500 hover:tw:text-red-500 hover:tw:bg-gray-200"
                            style={{ padding: '0 4px 0 2px' }}
                          >
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

                  {/* Group By Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center tw:mb-16">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Group By</span>
                        <span className="tw:text-gray-400 tw:text-13">{MOCK_DIMENSIONS.length}</span>
                        <span className="tw:text-gray-400 tw:text-13">/4</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:flex-wrap tw:items-center tw:gap-6">
                      {MOCK_DIMENSIONS.map(dim => (
                        /* NewChip - draggable style */
                        <div
                          key={dim}
                          className="tw:inline-flex tw:items-center tw:h-28 tw:min-w-34 tw:bg-gray-100 tw:rounded-6 tw:overflow-hidden hover:tw:bg-gray-200 tw:cursor-pointer"
                          style={{ padding: '0 4px' }}
                          draggable
                        >
                          {/* Section */}
                          <div
                            className="tw:flex tw:items-center tw:h-full tw:text-14"
                            style={{ padding: '0 10px 0 4px', columnGap: 4 }}
                          >
                            <Icon size={13} className="tw:text-gray-500 tw:cursor-move" style={{ marginRight: 4 }}>
                              drag_indicator
                            </Icon>
                            <span>{dim}</span>
                          </div>
                          {/* DeleteButton */}
                          <button
                            className="tw:flex tw:items-center tw:h-full tw:text-gray-500 hover:tw:text-red-500 hover:tw:bg-gray-200"
                            style={{ padding: '0 4px 0 2px' }}
                          >
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

                  {/* Filters Section */}
                  <div className="tw:flex tw:flex-nowrap tw:items-center">
                    <div className="tw:flex-shrink-0 tw:w-120 tw:pr-10">
                      <p className="tw:flex tw:items-center tw:w-120 tw:h-28 tw:text-14 tw:leading-tight tw:whitespace-nowrap">
                        <span className="tw:text-gray-900 tw:font-medium tw:mr-4">Filters</span>
                        <span className="tw:text-gray-400 tw:text-13">0</span>
                      </p>
                    </div>
                    <div className="tw:flex-1 tw:relative tw:flex tw:items-center">
                      <button className="tw:flex tw:items-center tw:gap-4 tw:px-8 tw:py-4 tw:text-14 tw:text-gray-600 hover:tw:bg-gray-50 tw:rounded-6">
                        <Icon size={16}>add</Icon>
                        Add
                      </button>
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

      {/* ============================================== */}
      {/* Chart Panel */}
      {/* ============================================== */}
      <div className="tw:relative tw:mb-32 tw:border tw:border-gray-200 tw:rounded-12 tw:bg-white">
        {/* Chart Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:px-20 tw:py-16 tw:border-b tw:border-gray-100">
          <div>
            <Text size={14} weight="medium" className="tw:text-gray-900">
              Daily Installs by Channel
            </Text>
          </div>
          <div className="tw:flex tw:items-center tw:gap-4">
            <Button appearance="ghost" color="gray" size="sm">
              <Icon size={13}>filter_none</Icon>
              <span>Copy Chart</span>
            </Button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="tw:px-20 tw:py-16" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={showEmptyState ? [] : MOCK_CHART_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                horizontal={true}
                vertical={true}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#9CA3AF', fontSize: 12, marginBottom: 4 }}
                itemStyle={{ color: '#fff', fontSize: 12, padding: '2px 0' }}
              />
              {seriesKeys.map((key, index) => (
                visibleSeries[key] && (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="tw:flex tw:flex-wrap tw:gap-16 tw:px-20 tw:py-12 tw:border-t tw:border-gray-100">
          {seriesKeys.map((key, index) => (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={`tw:flex tw:items-center tw:gap-6 tw:text-13 tw:transition-opacity ${
                visibleSeries[key] ? 'tw:opacity-100' : 'tw:opacity-40'
              }`}
            >
              <span
                className="tw:w-12 tw:h-3 tw:rounded-full"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <span className="tw:text-gray-700">{key}</span>
            </button>
          ))}
        </div>

        {/* Empty State Overlay */}
        {showEmptyState && (
          <div
            className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:rounded-12"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Text size={14} className="tw:text-gray-500">No data available</Text>
          </div>
        )}
      </div>

      {/* ============================================== */}
      {/* Table Toolbar */}
      {/* ============================================== */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-12">
        <div className="tw:flex tw:items-center tw:gap-12">
          <div className="tw:relative tw:w-250">
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
          <Button appearance="outline" color="gray" size="sm">
            <Icon size={12}>filter_none</Icon>
            <span>Copy Table</span>
          </Button>
        </div>
      </div>

      {/* ============================================== */}
      {/* Data Table */}
      {/* ============================================== */}
      <div className="tw:border tw:border-gray-200 tw:rounded-6 tw:overflow-hidden">
        <div className="tw:overflow-x-auto">
          <table className="tw:w-full tw:min-w-800">
            <thead>
              <tr className="tw:bg-gray-50 tw:border-b tw:border-gray-200">
                {/* Checkbox Column */}
                <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:w-35">
                  <button
                    onClick={toggleAllRows}
                    className={`tw:w-16 tw:h-16 tw:rounded-3 tw:border-2 tw:flex tw:items-center tw:justify-center ${
                      selectedRows.size === MOCK_TABLE_DATA.length
                        ? 'tw:bg-blue-500 tw:border-blue-500'
                        : 'tw:border-gray-300'
                    }`}
                  >
                    {selectedRows.size === MOCK_TABLE_DATA.length && (
                      <Icon size={10} className="tw:text-white">check</Icon>
                    )}
                  </button>
                </th>

                {/* Metrics Column */}
                <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:w-160">
                  <div className="tw:flex tw:items-center tw:justify-between">
                    <div className="tw:flex tw:items-center tw:gap-4">
                      <Text size={12} weight="medium" className="tw:text-gray-700">Metrics</Text>
                      <Icon size={12} className="tw:text-gray-400">swap_vert</Icon>
                    </div>
                    <button className="tw:text-gray-400 hover:tw:text-gray-600">
                      <Icon size={14}>more_vert</Icon>
                    </button>
                  </div>
                </th>

                {/* Channel Column */}
                <th className="tw:p-12 tw:text-left tw:border-r tw:border-gray-100 tw:w-160">
                  <div className="tw:flex tw:items-center tw:justify-between">
                    <div className="tw:flex tw:items-center tw:gap-4">
                      <Text size={12} weight="medium" className="tw:text-gray-700">Channel</Text>
                      <Icon size={12} className="tw:text-gray-400">swap_vert</Icon>
                    </div>
                    <button className="tw:text-gray-400 hover:tw:text-gray-600">
                      <Icon size={14}>more_vert</Icon>
                    </button>
                  </div>
                </th>

                {/* Sum Column (before dates) */}
                <th className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100 tw:w-160">
                  <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                    <Text size={12} weight="medium" className="tw:text-gray-700">Sum</Text>
                    <Icon size={12} className="tw:text-blue-500">arrow_downward</Icon>
                  </div>
                </th>

                {/* Date Columns */}
                {DATE_COLUMNS.map((date) => (
                  <th key={date} className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100 tw:w-160">
                    <div className="tw:flex tw:items-center tw:justify-end tw:gap-4">
                      <Text size={12} weight="medium" className="tw:text-gray-700">{date}</Text>
                      <Icon size={12} className="tw:text-gray-400">swap_vert</Icon>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {showEmptyState ? (
                <tr>
                  <td colSpan={4 + DATE_COLUMNS.length} className="tw:p-48 tw:text-center">
                    <Text size={14} className="tw:text-gray-500">No statistics data available.</Text>
                  </td>
                </tr>
              ) : (
                MOCK_TABLE_DATA.map((row, i) => (
                  <tr
                    key={`${row.channel}-${i}`}
                    className={`tw:border-b tw:border-gray-100 hover:tw:bg-blue-50 tw:transition-colors tw:group ${
                      i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className={`tw:p-12 tw:border-r tw:border-gray-100 ${i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'} group-hover:tw:bg-blue-50`}>
                      <button
                        onClick={() => toggleRow(i)}
                        className={`tw:w-16 tw:h-16 tw:rounded-3 tw:border-2 tw:flex tw:items-center tw:justify-center ${
                          selectedRows.has(i)
                            ? 'tw:bg-blue-500 tw:border-blue-500'
                            : 'tw:border-gray-300'
                        }`}
                      >
                        {selectedRows.has(i) && (
                          <Icon size={10} className="tw:text-white">check</Icon>
                        )}
                      </button>
                    </td>

                    {/* Metrics */}
                    <td className={`tw:p-12 tw:border-r tw:border-gray-100 ${i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'} group-hover:tw:bg-blue-50`}>
                      <Text size={12} className="tw:text-gray-900">{row.metric}</Text>
                    </td>

                    {/* Channel */}
                    <td className={`tw:p-12 tw:border-r tw:border-gray-100 ${i % 2 === 1 ? 'tw:bg-gray-50/50' : 'tw:bg-white'} group-hover:tw:bg-blue-50`}>
                      <div className="tw:flex tw:items-center tw:gap-8">
                        <span
                          className="tw:w-8 tw:h-8 tw:rounded-full tw:flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <Text size={12} className="tw:text-gray-900">{row.channel}</Text>
                      </div>
                    </td>

                    {/* Sum */}
                    <td className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                      <Text size={12} className="tw:text-gray-900 tw:font-mono tw:font-medium">
                        {row.sum.toLocaleString()}
                      </Text>
                    </td>

                    {/* Date Values */}
                    {DATE_COLUMNS.map((date) => (
                      <td key={date} className="tw:p-12 tw:text-right tw:border-r tw:border-gray-100">
                        <Text size={12} className="tw:text-gray-900 tw:font-mono">
                          {(row[date as keyof typeof row] as number).toLocaleString()}
                        </Text>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="tw:flex tw:justify-between tw:items-center tw:mt-16">
        <div className="tw:flex tw:items-center tw:gap-16">
          <div className="tw:flex tw:items-center tw:gap-8">
            <Text size={13} className="tw:text-gray-500">Total Rows</Text>
            <Text size={13} weight="medium" className="tw:text-gray-900">
              {showEmptyState ? 0 : MOCK_TABLE_DATA.length}
            </Text>
          </div>
        </div>

        <div className="tw:flex tw:items-center tw:gap-4">
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={14}>first_page</Icon>
          </Button>
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={14}>chevron_left</Icon>
          </Button>
          <div className="tw:flex tw:items-center tw:gap-2 tw:mx-8">
            <button className="tw:w-28 tw:h-28 tw:flex tw:items-center tw:justify-center tw:rounded-4 tw:text-13 tw:font-medium tw:bg-blue-500 tw:text-white">
              1
            </button>
          </div>
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={14}>chevron_right</Icon>
          </Button>
          <Button appearance="outline" color="gray" size="sm" disabled>
            <Icon size={14}>last_page</Icon>
          </Button>
        </div>
      </div>

      {/* Debug Toggle (remove in production) */}
      <div className="tw:mt-32 tw:pt-16 tw:border-t tw:border-gray-200">
        <button
          onClick={() => setShowEmptyState(!showEmptyState)}
          className="tw:px-12 tw:py-6 tw:text-12 tw:bg-gray-100 tw:rounded-6 hover:tw:bg-gray-200"
        >
          Toggle Empty State: {showEmptyState ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  )
}
