import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const stages = [
  { number: '01', label: 'Planning', state: 'complete' },
  { number: '02', label: 'Design', state: 'complete' },
  { number: '03', label: 'Development', state: 'active' },
  { number: '04', label: 'Launch', state: 'upcoming' },
]

function App() {
  return (
    <main className="page">
      <div className="grid" aria-hidden="true" />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />

      <section className="card" aria-label="Production progress">
        <header className="topbar">
          <div className="brand">PROD<span>•</span>2</div>
          <div className="live"><i /> LIVE BUILD</div>
        </header>

        <div className="hero">
          <div className="loader" aria-hidden="true">
            <div className="loader-track" />
            <div className="loader-value" />
            <span>WIP</span>
          </div>

          <p className="eyebrow">Production loading</p>
          <h1>Something great<br /><em>is taking shape.</em></h1>
          <p className="message">
            This production experience is under active development. We&apos;re building,
            testing and polishing everything before the full launch.
          </p>
        </div>

        <div className="progress-head">
          <span>BUILD PROGRESS</span>
          <span className="active-text">IN DEVELOPMENT</span>
        </div>
        <div className="progress" aria-label="Build progress">
          <span />
        </div>

        <div className="stages">
          {stages.map((stage) => (
            <div className={`stage ${stage.state}`} key={stage.number}>
              <div className="stage-number">{stage.number}</div>
              <div className="stage-copy">
                <span>{stage.label}</span>
                <small>
                  {stage.state === 'complete' ? 'Completed' : stage.state === 'active' ? 'In progress' : 'Coming soon'}
                </small>
              </div>
              {stage.state === 'complete' && <b>✓</b>}
              {stage.state === 'active' && <b className="dot" />}
            </div>
          ))}
        </div>

        <footer>More coming soon <span>—</span> stay tuned.</footer>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
