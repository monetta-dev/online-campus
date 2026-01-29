import { useAppStore } from '../store/useAppStore'

const LocationIndicator = () => {
  const { currentLocation } = useAppStore()

  return (
    <div className="bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-lg px-4 py-2 text-black z-30 font-medium tracking-wide">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{currentLocation}</span>
      </div>
    </div>
  )
}

export default LocationIndicator