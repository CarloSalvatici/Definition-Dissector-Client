import * as React from 'react'

function Footer() {
  return (
    <div className="footer bg-light text-center">
      <div className="footer-text align-middle block">
        <div className="my-1 ft-item">Definitions sourced from Oxford Dictionaries API</div>
        <div className="my-1 ft-item">Morphology recognition sourced from Google Cloud Natural Language Analyzing Syntax API</div>
        <div className="my-1 ft-item">Developed by Carlo Salvatici</div>
      </div>
    </div>
  )
}

Footer.displayName = "Footer"

export default Footer