import type { Building } from '../types'

export const campusData: Building[] = [
    {
        id: 'library',
        name: '中央図書館',
        category: '学術施設',
        description: '総蔵書数100万冊を誇る本学のシンボル的な施設。最新のデジタルアーカイブやグループ学習スペース、24時間利用可能な自習室を備えています。',
        imageColor: 'bg-transparent',
        links: [
            { label: '図書館Webサイト', url: '#' },
            { label: '蔵書検索システム', url: '#' },
            { label: '利用案内PDF', url: '#' },
        ],
        features: ['24時間自習室', 'グループ学習スペース', 'デジタルアーカイブ', 'カフェテリア'],
    },
    {
        id: 'hall',
        name: '大講義室',
        category: '学術施設',
        description: '最大500名収容の大講義室。最新の音響設備とプロジェクションシステムを備え、国際学会や特別講義などに利用されます。',
        imageColor: 'bg-transparent',
        links: [
            { label: '施設利用申請', url: '#' },
            { label: '設備仕様書', url: '#' },
        ],
        features: ['500名収容', '多言語同時通訳', '4Kプロジェクター', '録画配信システム'],
    },
    {
        id: 'lab',
        name: '研究棟A',
        category: '研究施設',
        description: '先端科学研究の拠点となる施設。クリーンルーム、電子顕微鏡室、高性能計算機を備え、学部生から研究者まで幅広く利用できます。',
        imageColor: 'bg-transparent',
        links: [
            { label: '研究紹介ページ', url: '#' },
            { label: '施設利用ガイドライン', url: '#' },
            { label: '研究成果報告書', url: '#' },
        ],
        features: ['クリーンルーム', '電子顕微鏡', '高性能計算機', '共同研究室'],
    },
    {
        id: 'gym',
        name: '体育館',
        category: 'スポーツ施設',
        description: 'バスケットボールコート2面分の広さを持つ総合体育館。トレーニングルーム、プール、ダンススタジオも併設されています。',
        imageColor: 'bg-transparent',
        links: [
            { label: '利用時間表', url: '#' },
            { label: 'トレーニングメニュー', url: '#' },
            { label: 'イベントカレンダー', url: '#' },
        ],
        features: ['バスケットコート2面', 'トレーニングルーム', '室内プール', 'ダンススタジオ'],
    },
    {
        id: 'cafe',
        name: '学生食堂',
        category: '福利施設',
        description: '学生の憩いの場。日替わり定食からカフェメニューまで豊富なラインナップ。Wi-Fi完備でリラックスしながら課題に取り組めます。',
        imageColor: 'bg-transparent',
        links: [],
        features: ['Wi-Fi完備', 'テラス席', 'コンセント有'],
    },
    {
        id: 'admin',
        name: '事務棟',
        category: '管理施設',
        description: '大学の運営拠点。教務課、学生課、就職支援課などが入っています。各種手続きや相談はこちらで受け付けています。',
        imageColor: 'bg-transparent',
        links: [],
        features: ['証明書発行機', '相談窓口', 'ATM'],
    },
    {
        id: 'dorm',
        name: '学生寮',
        category: '生活施設',
        description: 'キャンパス内にある学生寮。個室タイプとシェアタイプがあり、留学生との交流も盛んです。',
        imageColor: 'bg-transparent',
        links: [],
        features: ['オートロック', '共用キッチン', 'ランドリー', '交流ラウンジ'],
    },
    {
        id: 'park',
        name: '中央公園',
        category: '緑地',
        description: 'キャンパスの中央に位置する広大な公園。四季折々の花々が楽しめ、学生や教職員の憩いの場となっています。',
        imageColor: 'bg-transparent',
        links: [],
        features: ['芝生広場', 'ベンチ', '噴水'],
    },
]

// IDから建物データを取得するマップ
export const buildingsById: Record<string, Building> = campusData.reduce((acc, building) => {
    acc[building.id] = building
    return acc
}, {} as Record<string, Building>)

// デフォルトの建物データ (未選択時など)
export const defaultBuilding: Building = {
    id: 'default',
    name: '建物情報',
    category: '情報',
    description: '建物を選択すると、ここに詳細情報が表示されます。',
    imageColor: 'bg-transparent',
    links: [],
    features: [],
}

// UE5のLocationIDから表示名へのマッピング
// IDが一致しない場合のフォールバック用
export const locationNameMap: Record<string, string> = {
    ...campusData.reduce((acc, b) => {
        acc[b.id] = b.name
        // 前置詞などをつけた表示名が必要な場合はここで調整するか、
        // UI側で「〜前」などをつける。今回はstoreのロジックに合わせる
        return acc
    }, {} as Record<string, string>),
}

// Storeのロジックを再現するためのヘルパー
export const getLocationDisplayName = (locationId: string): string => {
    const building = buildingsById[locationId]
    if (building) {
        // 既存ロジックに合わせて「〜前」などをつける場合はここで分岐可能だが、
        // いったんシンプルに建物名を返すか、特定のサフィックスをつける
        return building.name + (building.category === '緑地' ? '' : '前')
    }
    return locationId
}
