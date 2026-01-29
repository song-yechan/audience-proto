import { useState } from 'react'
import { Button, Text, Tag, Icon, Heading } from '@airbridge/component'

// Types
type QuestionStatus = 'SUCCESS' | 'RUNNING' | 'FAILURE'

type Question = {
  id: string
  question: string
  status: QuestionStatus
  requestedAt: string
  isRead: boolean
  answer?: string
}

// Mock data - Korean titles from actual implementation
const SUGGESTED_QUESTIONS = [
  { title: '구글 애즈 캠페인 운영 방법', content: '구글 애즈 캠페인을 효과적으로 운영하는 방법에 대해 알려주세요.' },
  { title: '광고 채널과 에어브릿지 간 수치 차이 이유', content: '광고 채널과 에어브릿지 간 수치 차이가 발생하는 이유에 대해 설명해주세요.' },
  { title: 'SKAN 준비 방법 및 데이터 조회 시 유의사항', content: 'SKAN을 준비하는 방법과 데이터 조회 시 유의사항에 대해 알려주세요.' },
  { title: '유저를 최적화된 경로로 보내는 방법', content: '유저를 최적화된 경로로 보내는 방법에 대해 알려주세요.' },
]

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'How do I set up event tracking in the SDK?',
    status: 'SUCCESS',
    requestedAt: new Date().toISOString(),
    isRead: false,
    answer: 'To set up event tracking, you need to...',
  },
  {
    id: '2',
    question: 'What is the difference between attributed and unattributed events?',
    status: 'RUNNING',
    requestedAt: new Date().toISOString(),
    isRead: true,
  },
  {
    id: '3',
    question: 'How can I export raw data from Airbridge?',
    status: 'SUCCESS',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    answer: 'You can export raw data by going to...',
  },
  {
    id: '4',
    question: 'What attribution models does Airbridge support?',
    status: 'FAILURE',
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
  },
]

// Sub-components
const SampleQuestionCard = ({
  title,
  disabled = false,
  onClick,
}: {
  title: string
  disabled?: boolean
  onClick?: () => void
}) => (
  <button
    type="button"
    aria-disabled={disabled}
    disabled={disabled}
    onClick={onClick}
    className="tw:w-full tw:h-full tw:p-12 tw:px-16 tw:rounded-12 tw:border tw:border-gray-200 tw:bg-white tw:text-left tw:grid tw:gap-8 tw:transition-all tw:duration-300 hover:tw:border-blue-400 hover:tw:bg-gray-50 aria-disabled:tw:bg-gray-100 aria-disabled:tw:cursor-not-allowed"
    style={{ boxShadow: '0px 0px 1px 0px rgba(67, 90, 111, 0), 0px 2px 2px 0px rgba(67, 90, 111, 0.02)' }}
  >
    <Text size={13} weight="medium" color={disabled ? 'disabled' : 'primary'}>
      {title}
    </Text>
    <div className="tw:flex tw:justify-end tw:self-end">
      <Icon size={14} className={disabled ? 'tw:text-gray-400' : 'tw:text-gray-500'}>
        notes
      </Icon>
    </div>
  </button>
)

const StatusBadge = ({ status }: { status: QuestionStatus }) => {
  const statusConfig = {
    SUCCESS: { icon: 'check_circle', color: 'green' as const, text: 'Completed' },
    RUNNING: { icon: 'pending', color: 'blue' as const, text: 'Processing...' },
    FAILURE: { icon: 'error', color: 'red' as const, text: 'Failed' },
  }
  const config = statusConfig[status]

  return (
    <div className="tw:flex tw:items-center tw:gap-4">
      <Icon size={14} className={`tw:text-${config.color}-500`}>
        {config.icon}
      </Icon>
      <Text size={12} color={config.color === 'green' ? 'success' : config.color === 'red' ? 'remove' : 'accent'}>
        {config.text}
      </Text>
    </div>
  )
}

const QuestionListItem = ({
  question,
  onClick,
}: {
  question: Question
  onClick: () => void
}) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={`tw:w-full tw:flex tw:flex-col tw:items-start tw:px-20 tw:pt-16 tw:transition-all tw:duration-300 ${
        question.isRead ? 'tw:bg-white hover:tw:bg-gray-50' : 'tw:bg-blue-50 hover:tw:bg-blue-100'
      }`}
    >
      <div className="tw:flex tw:justify-between tw:gap-12 tw:w-full tw:mb-12">
        <Text size={14} className="tw:text-left tw:break-all">
          {question.question}
        </Text>
        {!question.isRead && (
          <div className="tw:w-7 tw:h-7 tw:min-w-7 tw:rounded-full tw:bg-blue-500" />
        )}
      </div>
      <div className="tw:flex tw:items-center tw:justify-between tw:w-full">
        <StatusBadge status={question.status} />
      </div>
      <div className="tw:w-full tw:h-1 tw:bg-gray-200 tw:mt-16" />
    </button>
  </li>
)

type AskAirbridgeModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function AskAirbridgeModal({ isOpen, onClose }: AskAirbridgeModalProps) {
  const [activeTab, setActiveTab] = useState<'ASK' | 'QUESTION_LIST'>('ASK')
  const [questionText, setQuestionText] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  const isSubmitDisabled = questionText.trim().length === 0

  const handleSampleQuestionClick = (content: string) => {
    setQuestionText(content)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.userAgent.includes('Mac OS')
    const isSubmitShortcut = (isMac && e.key === 'Enter' && e.metaKey) || (!isMac && e.key === 'Enter' && e.ctrlKey)

    if (isSubmitShortcut && !isSubmitDisabled) {
      e.preventDefault()
      alert('Question submitted: ' + questionText)
      setQuestionText('')
    }
  }

  // Categorize questions by date
  const today = new Date()
  const yesterday = new Date(today.getTime() - 86400000)

  const categorizedQuestions = {
    today: MOCK_QUESTIONS.filter(q => new Date(q.requestedAt).toDateString() === today.toDateString()),
    yesterday: MOCK_QUESTIONS.filter(q => new Date(q.requestedAt).toDateString() === yesterday.toDateString()),
    previous: MOCK_QUESTIONS.filter(q => {
      const date = new Date(q.requestedAt)
      return date.toDateString() !== today.toDateString() && date.toDateString() !== yesterday.toDateString()
    }),
  }

  const unreadCount = categorizedQuestions.today.filter(q => !q.isRead).length

  if (!isOpen) return null

  return (
    <>
      {/* Modal Panel */}
      <div
        className="tw:fixed tw:bottom-[25px] tw:right-[25px] tw:z-[999999] tw:w-[440px] tw:h-[calc(100vh-100px)] tw:max-h-[800px] tw:min-h-[110px] tw:flex tw:flex-col tw:bg-white tw:rounded-12 tw:border tw:border-gray-300 tw:overflow-hidden"
        style={{ boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.06)' }}
      >
        {/* Header */}
        <div className="tw:flex tw:items-center tw:justify-between tw:px-20 tw:pt-20 tw:pb-16 tw:bg-white">
          <div className="tw:flex tw:items-center tw:gap-8 tw:flex-1">
            <div
              className="tw:flex tw:justify-center tw:items-center tw:w-28 tw:h-28 tw:rounded-[3px]"
              style={{
                background: 'linear-gradient(90deg, #2f5bf7 0%, #2f87f7 100%)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
              }}
            >
              <img
                alt="Ask Airbridge Logo"
                src="https://static.airbridge.io/images/resources/ask-airbridge/ask_airbridge_logo.svg"
                width={20}
              />
            </div>
            <Heading size={16} weight="medium">Ask Airbridge</Heading>
            <Tag>Beta</Tag>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tw:p-4 tw:rounded-[3px] tw:text-gray-500 hover:tw:bg-gray-200"
          >
            <Icon size={18}>close</Icon>
          </button>
        </div>

        {/* Tabs */}
        <div className="tw:flex tw:px-20 tw:border-b tw:border-gray-300 tw:bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('ASK')}
            className={`tw:flex tw:items-center tw:gap-2 tw:px-6 tw:py-8 tw:mr-12 tw:text-14 tw:font-medium tw:relative ${
              activeTab === 'ASK' ? 'tw:text-blue-500' : 'tw:text-gray-500'
            }`}
          >
            Ask
            {activeTab === 'ASK' && (
              <div className="tw:absolute tw:bottom-[-1px] tw:left-0 tw:right-0 tw:h-px tw:bg-blue-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('QUESTION_LIST')}
            className={`tw:flex tw:items-center tw:gap-2 tw:px-6 tw:py-8 tw:mr-12 tw:text-14 tw:font-medium tw:relative ${
              activeTab === 'QUESTION_LIST' ? 'tw:text-blue-500' : 'tw:text-gray-500'
            }`}
          >
            Question List
            {unreadCount > 0 && (
              <Tag color="blue" size="small" appearance="filled" radius={4}>
                {unreadCount}
              </Tag>
            )}
            {activeTab === 'QUESTION_LIST' && (
              <div className="tw:absolute tw:bottom-[-1px] tw:left-0 tw:right-0 tw:h-px tw:bg-blue-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="tw:flex-1 tw:overflow-hidden tw:flex tw:flex-col tw:bg-white">
          {activeTab === 'ASK' ? (
            <div className="tw:flex tw:flex-col tw:flex-1 tw:px-20 tw:pb-[60px] tw:overflow-y-auto tw:relative">
              {/* Page Header */}
              <div className="tw:flex tw:flex-col tw:py-48">
                <Heading size={18} weight="medium" color="accent">Ask Airbridge</Heading>
                <Heading size={18} weight="medium">
                  안녕하세요. 무엇을 도와드릴까요?<br />
                  궁금한 점을 질문하면 바로 답변 드릴게요!
                </Heading>
              </div>

              {/* Question Form */}
              <form className="tw:flex tw:flex-col tw:flex-1">
                {/* Suggested Questions */}
                <div className="tw:flex tw:flex-col tw:gap-8 tw:mb-32 tw:relative">
                  <Heading as="h3" size={13} weight="medium">
                    자주 묻는 질문
                  </Heading>
                  <div className="tw:grid tw:grid-cols-2 tw:grid-rows-2 tw:gap-8 tw:z-[1]">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <SampleQuestionCard
                        key={q.title}
                        title={q.title}
                        onClick={() => handleSampleQuestionClick(q.content)}
                      />
                    ))}
                  </div>
                </div>

                <Heading as="h3" size={13} weight="medium" className="tw:mb-8">
                  질문 작성
                </Heading>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={"질문을 구체적으로 작성할수록 유용한 답변을 드릴 수 있습니다.\n답변을 완료하는 데 최대 1분 소요됩니다."}
                  className="tw:w-full tw:min-h-[110px] tw:max-h-[220px] tw:resize-none tw:py-8 tw:px-12 tw:mb-12 tw:rounded-6 tw:border tw:border-gray-300 tw:bg-white tw:text-14 tw:outline-none placeholder:tw:text-gray-400 focus:tw:border-blue-500"
                  style={{ boxShadow: '1px 1px 2px 0px rgba(0, 0, 0, 0.04) inset' }}
                />
                <Button
                  type="button"
                  appearance="filled"
                  color="blue"
                  size="md"
                  disabled={isSubmitDisabled}
                  onClick={() => {
                    alert('Question submitted: ' + questionText)
                    setQuestionText('')
                  }}
                  className="tw:mt-auto tw:w-full tw:justify-center"
                >
                  <Icon size={16}>send</Icon>
                  <span>답변 받기</span>
                  <Tag
                    appearance={isSubmitDisabled ? 'outlined' : 'filled'}
                    color={isSubmitDisabled ? 'gray' : 'blue'}
                    radius={4}
                    size="small"
                  >
                    Cmd
                  </Tag>
                  <Tag
                    appearance={isSubmitDisabled ? 'outlined' : 'filled'}
                    color={isSubmitDisabled ? 'gray' : 'blue'}
                    radius={4}
                    size="small"
                  >
                    Enter
                  </Tag>
                </Button>
              </form>

              {/* Survey Link */}
              <div className="tw:flex tw:justify-center tw:pt-24 tw:text-12">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScYnn4CZr_pGy-CPsVq6zCRuoeMYwcjmvFjyQy5rQHx76-tkw/viewform"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tw:text-gray-500 hover:tw:text-gray-700 hover:tw:underline"
                >
                  서비스 의견 보내기
                </a>
              </div>
            </div>
          ) : (
            <div className="tw:flex-1 tw:overflow-y-auto tw:pb-20">
              {MOCK_QUESTIONS.length === 0 ? (
                <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:h-full">
                  <Icon size={40} className="tw:text-gray-300 tw:mb-8">help_outline</Icon>
                  <Text size={14} color="disabled">No questions yet</Text>
                </div>
              ) : (
                <>
                  {categorizedQuestions.today.length > 0 && (
                    <div>
                      <Heading size={13} className="tw:px-20 tw:pt-24 tw:pb-8">Today</Heading>
                      <ol>
                        {categorizedQuestions.today.map((q) => (
                          <QuestionListItem
                            key={q.id}
                            question={q}
                            onClick={() => setSelectedQuestion(q)}
                          />
                        ))}
                      </ol>
                    </div>
                  )}
                  {categorizedQuestions.yesterday.length > 0 && (
                    <div>
                      <Heading size={13} className="tw:px-20 tw:pt-24 tw:pb-8">Yesterday</Heading>
                      <ol>
                        {categorizedQuestions.yesterday.map((q) => (
                          <QuestionListItem
                            key={q.id}
                            question={q}
                            onClick={() => setSelectedQuestion(q)}
                          />
                        ))}
                      </ol>
                    </div>
                  )}
                  {categorizedQuestions.previous.length > 0 && (
                    <div>
                      <Heading size={13} className="tw:px-20 tw:pt-24 tw:pb-8">Previous</Heading>
                      <ol>
                        {categorizedQuestions.previous.map((q) => (
                          <QuestionListItem
                            key={q.id}
                            question={q}
                            onClick={() => setSelectedQuestion(q)}
                          />
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question Detail Overlay */}
      {selectedQuestion && (
        <div
          className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-[60]"
          onClick={() => setSelectedQuestion(null)}
        >
          <div
            className="tw:bg-white tw:rounded-12 tw:w-[90%] tw:max-w-400 tw:max-h-[70vh] tw:overflow-hidden tw:flex tw:flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:px-20 tw:py-16 tw:border-b tw:border-gray-200">
              <Heading size={16} weight="semibold">Question Detail</Heading>
              <Button appearance="ghost" color="gray" size="sm" onClick={() => setSelectedQuestion(null)}>
                <Icon size={20}>close</Icon>
              </Button>
            </div>
            <div className="tw:p-20 tw:flex-1 tw:overflow-y-auto">
              <div className="tw:mb-16">
                <Text size={14} weight="medium" color="secondary" className="tw:mb-4">Question</Text>
                <Text size={14}>{selectedQuestion.question}</Text>
              </div>
              <div className="tw:mb-16">
                <Text size={14} weight="medium" color="secondary" className="tw:mb-4">Status</Text>
                <StatusBadge status={selectedQuestion.status} />
              </div>
              {selectedQuestion.answer && (
                <div>
                  <Text size={14} weight="medium" color="secondary" className="tw:mb-4">Answer</Text>
                  <Text size={14}>{selectedQuestion.answer}</Text>
                </div>
              )}
              {selectedQuestion.status === 'RUNNING' && (
                <div className="tw:flex tw:items-center tw:gap-8 tw:p-16 tw:bg-blue-50 tw:rounded-8">
                  <Icon size={16} className="tw:text-blue-500 tw:animate-spin">progress_activity</Icon>
                  <Text size={14} color="accent">Ask Airbridge is processing your question...</Text>
                </div>
              )}
              {selectedQuestion.status === 'FAILURE' && (
                <div className="tw:flex tw:items-center tw:gap-8 tw:p-16 tw:bg-red-50 tw:rounded-8">
                  <Icon size={16} className="tw:text-red-500">error</Icon>
                  <Text size={14} color="remove">Failed to generate an answer. Please try again.</Text>
                </div>
              )}
            </div>
            {selectedQuestion.status === 'FAILURE' && (
              <div className="tw:px-20 tw:py-16 tw:border-t tw:border-gray-200">
                <Button appearance="filled" color="blue" size="md" className="tw:w-full tw:justify-center">
                  <Icon size={16}>refresh</Icon>
                  <span>Regenerate Answer</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
