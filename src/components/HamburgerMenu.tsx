import { useState } from 'react'

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { icon: '🗺️', label: '全体マップ' },
    { icon: '📅', label: 'イベント表' },
    { icon: '❓', label: 'Q&A' },
    { icon: '⚙️', label: '設定' },
  ]

  return (
    <div className="relative z-40">
      <button
        className="bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-lg p-3 text-black hover:bg-white/30 transition-all z-50 pointer-events-auto"
        onClick={() => {
          console.log('HamburgerMenu toggle clicked')
          setIsOpen(!isOpen)
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white/20 backdrop-blur-sm border border-white/40 rounded-lg py-2 min-w-[200px] z-50 shadow-xl">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left text-black hover:bg-white/10 flex items-center gap-3 z-50 pointer-events-auto"
              onClick={() => {
                console.log(`Selected: ${item.label}`)
                setIsOpen(false)
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu