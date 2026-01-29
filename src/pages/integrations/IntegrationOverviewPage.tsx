import { useState } from 'react'
import { Button, Text, Tag, Icon, Heading } from '@airbridge/component'

// ============================================
// Constants (from actual implementation)
// ============================================
const LAYOUT = {
  CONTAINER_WIDTH: 1378,
  CARD_MIN_WIDTH: 520,
} as const

// ============================================
// Types
// ============================================
type Channel = {
  id: string
  name: string
  logoUrl: string
  functions: string[]
}

// ============================================
// Mock Data
// ============================================
const MOCK_SOURCES: { adChannels: Channel[] } = {
  adChannels: [
    {
      id: 'facebook.business',
      name: '메타 애즈',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/facebook.business.svg',
      functions: ['채널 연동(Android, iOS)', '비용', 'SKAN'],
    },
    {
      id: 'google.adwords',
      name: '구글 애즈',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/google.adwords.svg',
      functions: ['채널 연동(Android, iOS)', '비용', 'SKAN'],
    },
    {
      id: 'apple.searchads',
      name: '애플 서치 애드',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/apple.searchads.svg',
      functions: ['비용', '캠페인 API'],
    },
    {
      id: 'tiktok',
      name: '틱톡 포 비즈니스',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/tiktok.svg',
      functions: ['채널 연동(Android, iOS)', '비용'],
    },
  ],
}

const MOCK_DESTINATIONS: {
  adChannels: Channel[]
  thirdParties: Channel[]
  epcEnabled: boolean
} = {
  adChannels: [
    {
      id: 'facebook.business',
      name: '메타 애즈',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/facebook.business.svg',
      functions: ['전환 API'],
    },
    {
      id: 'tiktok',
      name: '틱톡 포 비즈니스',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/tiktok.svg',
      functions: ['포스트백'],
    },
    {
      id: 'moloco',
      name: '몰로코',
      logoUrl: 'https://static.airbridge.io/images/paidAd_logo/ko/moloco.svg',
      functions: ['포스트백'],
    },
  ],
  thirdParties: [
    {
      id: 'amplitude_v2',
      name: 'Amplitude V2',
      logoUrl: 'https://static.airbridge.io/images/third-party-logos/amplitude_v2.svg',
      functions: ['포스트백'],
    },
    {
      id: 'braze',
      name: 'Braze',
      logoUrl: 'https://static.airbridge.io/images/third-party-logos/braze_new.svg',
      functions: ['포스트백'],
    },
  ],
  epcEnabled: true,
}

// ============================================
// Sub-components
// ============================================

// Card Header (데이터 수집 / 데이터 전송)
// Actual: Heading size 20, weight bold, mb 16px, column-gap 4px
const CardHeader = ({ title }: { title: string }) => (
  <div className="tw:flex tw:items-center tw:gap-4 tw:mb-16">
    <Heading as="h2" size={20} weight="bold">{title}</Heading>
    <Icon size={18} className="tw:text-gray-700 tw:cursor-pointer">help</Icon>
  </div>
)

// Section Header (광고 채널, 서드파티, EPC)
// Actual: Text size 16, weight medium, padding 8px 10px, column-gap 4px, mb 4px
const SectionHeader = ({ title, count }: { title: string; count?: number }) => (
  <div className="tw:flex tw:items-center tw:gap-4 tw:mb-4 tw:px-10 tw:py-8">
    <Text size={16} weight="medium">{title}</Text>
    {count !== undefined && (
      <Tag color="gray" size="small" appearance="filled">
        {count}
      </Tag>
    )}
  </div>
)

// Section Card - Gray container that wraps channel rows
const SectionCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`tw:rounded-12 tw:py-16 tw:px-12 ${className || ''}`}
    style={{
      minWidth: LAYOUT.CARD_MIN_WIDTH,
      backgroundColor: '#F5F6F8', // color.background.tinted.normal
    }}
  >
    {children}
  </div>
)

// Channel Row - Individual row with white background
const ChannelRow = ({
  channel,
  isExpanded,
  onToggle,
  linkPath,
}: {
  channel: Channel
  isExpanded: boolean
  onToggle: () => void
  linkPath: string
}) => (
  <div
    className="tw:mb-8 last:tw:mb-0 tw:rounded-12 tw:overflow-hidden tw:bg-white"
    aria-expanded={isExpanded}
    data-state={isExpanded ? 'open' : 'closed'}
  >
    <div
      className="tw:flex tw:items-center tw:justify-between tw:p-12 tw:gap-8 tw:cursor-pointer tw:rounded-12 data-[state=open]:tw:rounded-b-0"
      data-state={isExpanded ? 'open' : 'closed'}
      onClick={onToggle}
    >
      {/* Left: Avatar + Name + Status Circle */}
      <a
        href={linkPath}
        className="tw:flex tw:items-center tw:gap-8 tw:px-4 tw:rounded-6 hover:tw:bg-gray-100 tw:transition-colors tw:duration-300 tw:shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="tw:flex tw:items-center tw:justify-center tw:rounded-full tw:overflow-hidden"
          style={{ width: 24, height: 24 }}
        >
          <img
            alt={channel.id}
            src={channel.logoUrl}
            style={{ width: 24, height: 24, objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = 'https://static.airbridge.io/images/partner/default.png'
            }}
          />
        </div>
        <Heading as="h3" size={16} weight="semibold">{channel.name}</Heading>
        <div className="tw:w-8 tw:h-8 tw:rounded-full tw:bg-green-500" />
      </a>

      {/* Right: Functions + Arrow */}
      <div className="tw:flex tw:items-center tw:gap-6">
        <Text
          size={14}
          weight="medium"
          color="secondary"
          className="tw:text-right"
          style={{ maxWidth: 258, wordBreak: 'keep-all' }}
        >
          {channel.functions.join(' / ')}
        </Text>
        <Icon
          size={24}
          color="#606468"
          className={`arrow-icon tw:transition-transform tw:duration-400 ${isExpanded ? 'tw:rotate-180' : 'tw:rotate-0'}`}
        >
          keyboard_arrow_down
        </Icon>
      </div>
    </div>

    {/* Expanded Content */}
    {isExpanded && (
      <div className="tw:px-12 tw:pb-12">
        <table className="tw:w-full tw:text-left">
          <thead>
            <tr>
              <th className="tw:py-8 tw:pr-16"><Text size={13} color="secondary">연동</Text></th>
              <th className="tw:py-8 tw:pr-16"><Text size={13} color="secondary">상태</Text></th>
              <th className="tw:py-8"><Text size={13} color="secondary">데이터</Text></th>
            </tr>
          </thead>
          <tbody>
            {channel.functions.map((func) => (
              <tr key={func}>
                <td className="tw:py-8 tw:pr-16"><Text size={14}>{func}</Text></td>
                <td className="tw:py-8 tw:pr-16">
                  <Icon size={18} color="#22C55E">check_circle</Icon>
                </td>
                <td className="tw:py-8">
                  <Icon size={18} color="#22C55E">check_circle</Icon>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

// EPC Row - Individual row with white background
const EPCRow = ({
  isExpanded,
  onToggle,
  isEnabled,
}: {
  isExpanded: boolean
  onToggle: () => void
  isEnabled: boolean
}) => (
  <div
    className="tw:rounded-12 tw:overflow-hidden tw:bg-white"
    aria-expanded={isExpanded}
    data-state={isExpanded ? 'open' : 'closed'}
  >
    <div
      className="tw:flex tw:items-center tw:justify-between tw:p-12 tw:gap-8 tw:cursor-pointer"
      onClick={onToggle}
    >
      <a
        href="/app/demokr/settings/app-settings/app-info#epc-toggle"
        className="tw:px-4 tw:rounded-6 hover:tw:bg-gray-100 tw:transition-colors tw:duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <Heading as="h3" size={16} weight="semibold">확장된 프라이버시 제어(EPC)</Heading>
      </a>
      <div className="tw:flex tw:items-center tw:gap-4 tw:shrink-0">
        <Tag color="neutral" size="normal" appearance="tinted">
          {isEnabled ? '일괄 적용' : '개별 적용'}
        </Tag>
        <Icon
          size={24}
          color="#606468"
          className={`arrow-icon tw:transition-transform tw:duration-400 ${isExpanded ? 'tw:rotate-180' : 'tw:rotate-0'}`}
        >
          keyboard_arrow_down
        </Icon>
      </div>
    </div>

    {/* Expanded Content */}
    {isExpanded && (
      <div className="tw:px-12 tw:pb-12">
        <Text size={14} color="secondary">
          iOS 14.5+ ATT 옵트아웃 사용자의 데이터 외부 공유 설정을 관리합니다.
        </Text>
      </div>
    )}
  </div>
)

// ============================================
// Main Component
// ============================================
export function IntegrationOverviewPage() {
  const [isAllExpanded, setIsAllExpanded] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpandedCards(new Set())
    } else {
      const allCardIds = [
        'epc-card',
        ...MOCK_SOURCES.adChannels.map((c) => `source-${c.id}`),
        ...MOCK_DESTINATIONS.adChannels.map((c) => `dest-ad-${c.id}`),
        ...MOCK_DESTINATIONS.thirdParties.map((c) => `dest-tp-${c.id}`),
      ]
      setExpandedCards(new Set(allCardIds))
    }
    setIsAllExpanded(!isAllExpanded)
  }

  return (
    <div className="tw:w-fit tw:pr-24">
      {/* Page Header */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-24">
        <div className="tw:flex tw:items-center tw:gap-16">
          <Heading as="h1" size={20} weight="bold">연동 현황</Heading>
          <a
            href="https://help.airbridge.io/ko/guides/integration-overview"
            target="_blank"
            rel="noreferrer noopener"
            className="tw:inline-flex tw:items-center tw:gap-4 tw:px-12 tw:py-6 tw:border tw:border-gray-200 tw:rounded-6 tw:text-gray-700 hover:tw:bg-gray-50"
          >
            <Icon size={16}>menu_book</Icon>
            <Text size={13}>가이드 보러가기</Text>
          </a>
        </div>
        <Button appearance="outline" color="gray" size="sm" onClick={toggleAll}>
          <Icon size={16}>{isAllExpanded ? 'close_fullscreen' : 'open_in_full'}</Icon>
          <span>{isAllExpanded ? '전체 접기' : '전체 펼치기'}</span>
        </Button>
      </div>

      {/* Main Content - Three Column Layout */}
      {/* Actual: width 1378px, column-gap 60px */}
      <section
        className="tw:relative tw:flex tw:gap-60"
        style={{ width: LAYOUT.CONTAINER_WIDTH }}
      >
        {/* Left Card: 데이터 수집 */}
        <div className="tw:flex-1">
          <CardHeader title="데이터 수집" />

          {/* 광고 채널 Section */}
          <SectionCard>
            <SectionHeader title="광고 채널" count={MOCK_SOURCES.adChannels.length} />
            {MOCK_SOURCES.adChannels.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                isExpanded={expandedCards.has(`source-${channel.id}`)}
                onToggle={() => toggleCard(`source-${channel.id}`)}
                linkPath={`/app/demokr/integrations/ad-channel/${channel.id.split('.')[0]}`}
              />
            ))}
          </SectionCard>
        </div>

        {/* Right Card: 데이터 전송 */}
        <div className="tw:flex-1">
          <CardHeader title="데이터 전송" />

          {/* EPC Section */}
          <SectionCard>
            <SectionHeader title="EPC" />
            <EPCRow
              isExpanded={expandedCards.has('epc-card')}
              onToggle={() => toggleCard('epc-card')}
              isEnabled={MOCK_DESTINATIONS.epcEnabled}
            />
          </SectionCard>

          {/* 광고 채널 Section */}
          <SectionCard className="tw:mt-16">
            <SectionHeader title="광고 채널" count={MOCK_DESTINATIONS.adChannels.length} />
            {MOCK_DESTINATIONS.adChannels.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                isExpanded={expandedCards.has(`dest-ad-${channel.id}`)}
                onToggle={() => toggleCard(`dest-ad-${channel.id}`)}
                linkPath={`/app/demokr/integrations/ad-channel/${channel.id.split('.')[0]}`}
              />
            ))}
          </SectionCard>

          {/* 서드파티 Section */}
          <SectionCard className="tw:mt-16">
            <SectionHeader title="서드파티" count={MOCK_DESTINATIONS.thirdParties.length} />
            {MOCK_DESTINATIONS.thirdParties.map((channel) => (
              <ChannelRow
                key={channel.id}
                channel={channel}
                isExpanded={expandedCards.has(`dest-tp-${channel.id}`)}
                onToggle={() => toggleCard(`dest-tp-${channel.id}`)}
                linkPath={`/app/demokr/integrations/third-party/${channel.id}`}
              />
            ))}
          </SectionCard>
        </div>
      </section>
    </div>
  )
}
