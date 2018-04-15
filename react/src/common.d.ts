/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
    id: string;
}

interface Build {
    head: Gear,
    charm: Gear,
    chest: Gear,
    hands: Gear,
    legs: Gear,
    waist: Gear

}

enum GearType {
    Head = 'head',
    Charm = 'charm',
    Chest = 'chest',
    Hands = 'hands',
    Legs = 'legs',
    Waist = 'waist'
}


enum Rank {
    High = 'high',
    Low = 'low'
}

type Gear = {
    id: number,
    name: string,
    type: GearType,
    rank: Rank
    attributes: GearAttributes;
}

type GearAttributes = {}

interface ArmorAttributes extends GearAttributes {
    defense?: number;
    fire?: number;
    water?: number;
    ice?: number;
    dragon?: number;
    slots?: Slots;
}

interface Slots {
    1?: boolean,
    2?: boolean,
    3?: boolean
}

enum Slot {
    One = 1,
    Two = 2,
    Three = 3
}


interface Armor extends Gear {
    attributes: ArmorAttributes
    skills: ArmorSkills[]
}

interface ArmorSkills {
    id: number,
    slug: string,
    skill: number,
    level: number,
    description: string,
}

interface BuildSkill {
    name: string,
    image: '',
    points: number,
    max: number

}