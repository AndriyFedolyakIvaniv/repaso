import { MathRenderer } from './MathRenderer'
import type { TheorySection as TheorySectionType } from '../types/math'
import type { ReactNode } from 'react'

interface TheorySectionProps {
  section: TheorySectionType
}

// Detect LaTeX \frac{a}{b} or plain a/b and render math inline
function renderTextWithMath(text: string) {
  const parts: Array<string | ReactNode> = []
  // Patterns for fractions: \frac{a}{b}, a/b, \frac34 or \frac 3 4
  const regex = /(\\frac\{([^}]+)\}\{([^}]+)\})|(\d+)\s*\/\s*(\d+)|(\\frac)\s*(\d+)\s*(\d+)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const index = match.index
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index))
    }

    // convert any matched fraction into plain 'n/d' text for clarity
    if (match[1]) {
      const n = match[2]
      const d = match[3]
      parts.push(`${n}/${d}`)
    } else if (match[4] && match[5]) {
      const n = match[4]
      const d = match[5]
      parts.push(`${n}/${d}`)
    } else if (match[6] && match[7] && match[8]) {
      const n = match[7]
      const d = match[8]
      parts.push(`${n}/${d}`)
    } else {
      parts.push(match[0])
    }

    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : p))
}

export function TheorySection({ section }: TheorySectionProps) {
  return (
    <article className="theory-card">
      <div className="theory-card__head">
        <h3>{section.title}</h3>
        <p>{renderTextWithMath(section.summary)}</p>
      </div>

      <ul className="theory-bullets">
        {section.bullets.map((bullet) => (
          <li key={bullet}>{renderTextWithMath(bullet)}</li>
        ))}
      </ul>

      {section.formula ? (
        <div className="theory-formula">
          {(() => {
            // If formula is a simple fraction or contains plain a/b, show as plain 'n/d'
            const simple = section.formula.match(/\\frac\{([^}]+)\}\{([^}]+)\}|(\d+)\s*\/\s*(\d+)|(\\frac)\s*(\d+)\s*(\d+)/)
            if (simple) {
              // extract numbers
              const m = simple
              if (m[1] && m[2]) return <span className="plain-frac">{`${m[1]}/${m[2]}`}</span>
              if (m[3] && m[4]) return <span className="plain-frac">{`${m[3]}/${m[4]}`}</span>
              if (m[5] && m[6] && m[7]) return <span className="plain-frac">{`${m[6]}/${m[7]}`}</span>
            }

            return <MathRenderer expression={section.formula} block />
          })()}
        </div>
      ) : null}

      {section.example ? <p className="theory-example">Ejemplo: {renderTextWithMath(section.example)}</p> : null}
    </article>
  )
}
