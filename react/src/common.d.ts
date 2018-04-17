/* SystemJS module definition */
import * as Redux from 'redux';


declare var module: NodeModule;

interface NodeModule {
    id: string;
}

interface Build {
    head?: Armor,
    charm?: Gear,
    chest?: Armor,
    hands?: Armor,
    legs?: Armor,
    waist?: Armor

}


export interface BuildState {
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
    name: string;
}

interface Gear extends MHItem {
    type: GearType;
    rank?: Rank;
    attributes: GearAttributes;
    skills?: GearSkill[]
}

interface Charm extends Gear {
    name: string;
}

type GearAttributes = {
    slots?: Slot[];
}

interface ArmorAttributes extends GearAttributes {
    defense?: number;
    fire?: number;
    water?: number;
    ice?: number;
    dragon?: number;


}


interface Slot {
    rank: number;
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

interface Skill {
    id: number,
    slug: string,
    name: string,
    description: string,
    ranks: SkillRank[]
}

interface SkillRank {
    id: number,
    skill: number,
    level: number,
    description: string,
    modifiers: SkillModifiers,
    slug: string,

}

interface SkillModifiers {
    [key: string]: string
}

interface GearSkill {
    id: number,
    slug: string,
    skill: number,
    level: number,
    description: string,
    skillName: string;
}

interface BuildSkill {
    id: number;
    name: string,
    image: string,
    points: number,
    max: number,
    completed:boolean

}