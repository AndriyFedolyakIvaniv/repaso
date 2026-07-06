import type { Topic, ViewMode, TopicId } from '../types/math'

interface TopicGridProps {
  topics: Topic[]
  selectedTopicId: TopicId
  onSelectTopic: (topicId: TopicId) => void
  onSelectView: (view: ViewMode) => void
}

export function TopicGrid({
  topics,
  selectedTopicId,
  onSelectTopic,
  onSelectView,
}: TopicGridProps) {
  return (
    <section className="topic-grid" aria-label="Temas de matemáticas">
      {topics.map((topic) => {
        const isSelected = topic.id === selectedTopicId

        return (
          <button
            key={topic.id}
            type="button"
            className={`topic-card ${isSelected ? 'is-selected' : ''}`}
            onClick={() => {
              onSelectTopic(topic.id)
              onSelectView('explicaciones')
            }}
          >
            <span className="topic-icon" aria-hidden="true">
              {topic.icon}
            </span>
            <span className="topic-body">
              <strong>{topic.title}</strong>
              <span>{topic.summary}</span>
            </span>
          </button>
        )
      })}
    </section>
  )
}
