/* SystemJS module definition */
import * as Redux from 'redux';


declare var module: NodeModule;

interface NodeModule {
    id: string;
}

interface Build {
    head?: Armor,
    charm?: CharmRank,
    chest?: Armor,
    hands?: Armor,
    legs?: Armor,
    waist?: Armor,
    weapon?: Weapon

}


interface BuildState {
    loading: boolean;
    current: Build
}

interface RootState {
    build: BuildState
}

type Dispatch = Redux.Dispatch<RootState>

type GearType = 'head' | 'charm' | 'chest' | 'hands' | 'legs' | 'waist'
/*
enum GearType {
   Head = 'head',
   Charm = 'charm',
   Chest = 'chest',
   Hands = 'hands',
   Legs = 'legs',
   Waist = 'waist'
}  */
type Rank = 'high' | 'low'

/*
enum Rank {
  High = 'high',
  Low = 'low'
}
 */

interface MHItem {
    id: number;
    slug?: string;
    name: string;
    type?: ItemType;
    rank?: Rank;
    rarity?: string;
}

type WeaponType =
    'great-sword'
    | 'long-sword'
    | 'sword-and-shield'
    | 'dual-blades'
    | 'hammer'
    | 'hunting-horn'
    | 'lance'
    | 'gunlance'
    | 'switch-axe'
    | 'charge-blade'
    | 'insect-glaive'
    | 'light-bowgun'
    | 'heavy-bowgun'
    | 'bow'
type ItemType = GearType | WeaponType

interface GearAttributes {
    slots?: Slot[];
}

interface Gear extends MHItem {

    attributes: GearAttributes;
    skills?: GearSkill[]
}


interface WeaponElement {
    damage: number;
    type: string;
}

interface WeaponAttributes extends GearAttributes {
    attack: number,
    element?: WeaponElement
}

interface WeaponSharpness {
    red: number,
    orange: number,
    yellow: number,
    green?: number,
    blue?: number,
    white?: number;
}

interface Weapon extends Gear {
    attributes: WeaponAttributes
    sharpness: WeaponSharpness

}

interface WeaponAguments {
    type: string;
}

interface Decoration extends Gear {
    slot: number;
    skill: number
}

type CharmLike = Charm | CharmRank;
interface CharmRank extends Gear {
    id: number,
    slug: string,
    name: string,
    skills: SkillRank[]
}

interface Charm extends Gear {
    ranks: CharmRank[]
}


interface ArmorAttributes extends GearAttributes {
    defense: ArmorDefense;
    fire?: number;
    water?: number;
    ice?: number;
    dragon?: number;


}

interface ArmorDefense {
    base: number;
    max: number;
    augmented: number;
}


interface Slot {
    rank: number;
    decoration?: Decoration
}

/*
enum Slot {
    One = 1,
    Two = 2,
    Three = 3
} */


interface Armor extends Gear {
    attributes: ArmorAttributes

}

interface Skill extends MHItem {
    slug: string,
    description: string,
    ranks: SkillRank[]

}

interface SkillRank {
    id: number,
    skill: number,
    level: number,
    description: string,
    modifiers: SkillModifiers,
    skillName: string,
    slug: string,

}

interface SkillModifiers {
    [key: string]: string
}

interface GearSkill {
    id: number,
    slug?: string,
    skill: number,
    level: number,
    description?: string,
    skillName?: string;
}

interface BuildSkill {
    id: number;
    name: string,
    image: string,
    points: number,
    max: number,
    completed: boolean

}

