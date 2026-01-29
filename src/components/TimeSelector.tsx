import { useAppStore } from '../store/useAppStore'
import type { TimeOfDay } from '../types'

const TimeSelector = () => {
  const { timeOfDay, setTimeOfDay } = useAppStore()

  const times: { value: TimeOfDay; label: string; icon: string }[] = [
    { value: 'day', label: '昼', icon: '☀️' },
    { value: 'evening', label: '夕方', icon: '🌆' },
    { value: 'night', label: '夜', icon: '🌙' },
  ]

  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/40 shadow-xl rounded-lg p-1 z-30">
      {times.map((time) => (
        <button
          key={time.value}
          className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors z-40 pointer-events-auto ${timeOfDay === time.value ? 'bg-white/20 text-black shadow-sm' : 'text-black/70 hover:bg-white/10'}`}
          onClick={() => {
            console.log('TimeSelector clicked:', time.value)
            setTimeOfDay(time.value)
          }}
        >
          <span>{time.icon}</span>
          <span className="text-base font-medium">{time.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TimeSelector