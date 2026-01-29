import { useAppStore } from '../store/useAppStore'

const Background = () => {
  const { timeOfDay } = useAppStore()

  const gradients = {
    day: 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)',
    evening: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)',
    night: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)',
  }

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div
         className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{ background: gradients[timeOfDay] }}
      />
      
      {/* 時間帯に応じた装飾 */}
      {timeOfDay === 'day' && (
        <>
           <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}
      {timeOfDay === 'evening' && (
        <>
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}
      {timeOfDay === 'night' && (
        <>
           <div className="absolute top-10 right-1/3 w-4 h-4 bg-white rounded-full pointer-events-none" />
           <div className="absolute top-20 right-1/4 w-2 h-2 bg-white rounded-full pointer-events-none" />
           <div className="absolute top-40 left-1/3 w-3 h-3 bg-white rounded-full pointer-events-none" />
           <div className="absolute bottom-40 right-1/2 w-2 h-2 bg-white rounded-full pointer-events-none" />
           <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-white rounded-full pointer-events-none" />
        </>
      )}

      {/* グリッドパターン */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
    </div>
  )
}

export default Background