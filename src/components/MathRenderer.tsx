import { BlockMath, InlineMath } from 'react-katex'

interface MathRendererProps {
  expression: string
  block?: boolean
}

function renderFallbackFraction(numer: string, denom: string, block = false) {
  const cls = block ? 'block-fraction' : 'inline-fraction'
  return (
    <span className={cls} aria-hidden="true">
      <span className="frac-num">{numer}</span>
      <span className="frac-bar" />
      <span className="frac-den">{denom}</span>
    </span>
  )
}

export function MathRenderer({ expression, block = false }: MathRendererProps) {
  try {
    // detect LaTeX \frac{a}{b}
    const latexMatch = expression.match(/\\frac\{([^}]+)\}\{([^}]+)\}/)
    if (latexMatch) {
      // try KaTeX render first, but also provide a clear HTML fallback
      return (
        <span className="math-inline">
          <InlineMath math={expression} />
        </span>
      )
    }

    // detect plain a/b
    const plainMatch = expression.match(/^(\s*\d+\s*)\/(\s*\d+\s*)$/)
    if (plainMatch) {
      const [, n, d] = plainMatch
      return renderFallbackFraction(n.trim(), d.trim(), block)
    }

    if (block) {
      return (
        <div className="math-block">
          <BlockMath math={expression} />
        </div>
      )
    }

    return (
      <span className="math-inline">
        <InlineMath math={expression} />
      </span>
    )
  } catch (e) {
    // KaTeX failed — render a safe fallback for simple fractions and plain text otherwise
    const fallback = expression.match(/\\?frac\{([^}]+)\}\{([^}]+)\}|(\d+)\s*\/\s*(\d+)/)
    if (fallback) {
      const numer = fallback[1] ?? fallback[3]
      const denom = fallback[2] ?? fallback[4]
      return renderFallbackFraction(numer ?? '', denom ?? '', block)
    }

    return <span>{expression}</span>
  }
}
