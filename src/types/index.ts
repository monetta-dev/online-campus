export type TimeOfDay = 'day' | 'evening' | 'night'

// UE5上のLocationID (文字列だが、型として明示)
export type UE5LocationId = string

export interface BuildingLink {
    label: string
    url: string
}

export interface Building {
    id: string
    name: string
    category: string // '学術施設' | '研究施設' etc.
    description: string
    imageColor: string // Tailwind class e.g. 'bg-blue-500' or 'bg-transparent'
    links: BuildingLink[]
    features: string[]
    // UE5上のテレポート先ID (なければidを使用)
    teleportId?: string
}
