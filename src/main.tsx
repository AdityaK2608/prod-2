import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function App() {
  return (
    <main className="page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <section className="card" aria-label="Production loading">
        <div className="status">
          <span className="pulse" />
          <span>PRODUCTION</span>
        </div>

        <div className="loader" aria-hidden="true">
          <div className="loader-ring" />
          <span>WIP</span>
        </div>

        <p className="eyebrow">Work in progress</p>
        <h1>Production loading.</h1>
        <p className="message">
          We&apos;re building something new. The production experience is currently
          under active development.
        </p>

        <div className="progress" aria-label="Production work in progress">
          <span />
        </div>

        <p className="footer">More coming soon.</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
