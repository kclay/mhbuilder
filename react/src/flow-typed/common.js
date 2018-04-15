// @flow
type Build = {
    head: Gear,
    charm: Gear,
    chest: Gear,
    hands: Gear,
    legs: Gear,
    waist: Gear

}

const GearName = {
    Head: 'head',
    Charm: 'charm',
    Chest: 'chest',
    Hands: 'hands',
    Legs: 'legs',
    Waist: 'waist'
};
type GearType = $Keys<typeof GearName>

const Rank = {
    High: 'high',
    Low: 'low'
};
type RankType = $Keys<typeof Rank>
type Gear = {
    id: number,
    name: string,
    type: GearType,
    rank: RankType
    attributes: GearAttributes;
}

type GearAttributes = {}
type ArmorAttributes = GearAttributes & {
    defense?: number;
    fire?: number;
    water?: number;
    ice?: number;
    dragon?: number;
    slots?: Slots;
}
type Slots = {
    1?: boolean,
    2?: boolean,
    3?: boolean
}
const Slot = {
    One: 1,
    Two: 2,
    Three: 3
};

type SlotType = $Keys<typeof Slot>

type Armor = Gear & {
    attributes: ArmorAttributes
    skills: ArmorSkills[]
}

type ArmorSkills = {
    id: number,
    slug: string,
    skill: number,
    level: number,
    description: string,
}
type BuildSkill = {
    name: string,
    image: '',
    points: number,
    max: number

}