const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');
const debug = require('debug')('mhbuilder:db');
const IMAGE_PATH = 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/';
const fs = require('fs');
const path = require('path');
const extraArmorDBUrl = 'https://raw.githubusercontent.com/CarlosFdez/MHWorldData/master/data/armors/armor_data.json';
const get = async (endpoint) => {
    const url = `https://mhw-db.com/${endpoint}`;
    debug('get - %s', url);
    return request.get(url).then(body => JSON.parse(body));
};
const write = (json, name) => {
    const output = path.resolve(`${__dirname}/../public/assets/db/${name}.json`);
    debug('write %s - %s', json.length);
    const data = JSON.stringify(json, null, 2);
    if (data) {
        fs.writeFileSync(output, data)
    } else {
        console.error('Unable to save %s', output);
    }
};
const checkImage = async (uri) => {
    const url = IMAGE_PATH + uri;
    return await new Promise((resolve, reject) => {
        return request.head(url).then((resp) => {
            return resolve(url)
        }, () => resolve(false));
    })

};


const rename = (lookup, replace, lowercase = false) => {
    return (field) => {
        if (lookup.test(field)) {
            field = field.replace(lookup, replace);
            return lowercase ? field.toLowerCase() : field;
        }
        return field;
    }
};
const transformResists = rename(/resist/, '', true);
const transformAttributes = (transform) => {
    return (item) => {
        if (item.attributes) {
            item.attributes = _.reduce(item.attributes, (acc, value, key) => {
                return {...acc, [transform(key)]: value}
            }, {})

        }
        return item;
    }
};

const tryNumber = (value) => {
    return !isNaN(Number(value)) ? Number(value) : value;
};

const transformObject = (objectKey, transform, booleanValue = false) => {
    return (item) => {
        if (!item.attributes) return item;
        item.attributes = _.reduce(item.attributes, (acc, value, key) => {
            const updated = transform(key);
            const changed = key !== updated;
            if (changed) {
                return {
                    ...acc,
                    [objectKey]: {
                        ...acc[objectKey],
                        [updated]: booleanValue
                            ? true
                            : tryNumber(value)
                    }
                }
            }
            return {...acc, [key]: value}
        }, {});
        return item;
    };
};
const defaultArrayMerger = (acc, objectKey, valueKey, value) => {
    const currentValue = acc[objectKey] || [];
    return [...currentValue, {[valueKey]: value}]
};
const transformArray = (objectKey, transform, valueKey,
                        useTransform = false, merger = defaultArrayMerger) => {
    return (item) => {
        if (!item.attributes) return item;
        item.attributes = _.reduce(item.attributes, (acc, value, key) => {
            const updated = transform(key);
            const changed = key !== updated;
            const updatedValue = tryNumber(useTransform ? updated : value);
            if (changed) {
                return {...acc, [objectKey]: merger(acc, objectKey, valueKey || updated, updatedValue)}
            }
            return {...acc, [key]: value}
        }, {});
        return item;
    };
};

const elementArrayMerger = (acc, objectKey, valueKey, value) => {
    let currentValue = acc[objectKey] || [];
    const number = /([\d])$/;
    const matched = valueKey.match(number);
    const index = matched ? parseInt(matched[1]) - 1 : 0;
    let element = {};
    if (index < currentValue.length) {
        element = currentValue[index];
    } else {
        currentValue.splice(index, 1, element)
    }
    valueKey = valueKey.replace(number, '').toLowerCase();
    if (valueKey === 'hidden') {
        value = true;
    }
    element[valueKey] = value;
    return currentValue;
};

const slotsRankMerger = (acc, objectKey, valueKey, value) => {
    const currentValue = acc[objectKey] || [];
    const slots = [];
    for (let i = 0; i < value; i++) {
        slots.push({
            rank: Number(valueKey)
        })
    }
    return [...currentValue, ...slots]
}
const transformSlots = transformArray('slots', rename(/slotsRank/, ''), false, false, slotsRankMerger);
const transformSharpness = transformObject('sharpness', rename(/sharpness/, '', true));
const transformElement = transformArray('element', rename(/element/, '', true), false, false, elementArrayMerger);
const resolvedImages = {};
const transformDefense = (item) => {
    const found = extraArmorDB[item.name];
    if (found) {
        item.attributes['defense'] = {
            base: found.defense_base,
            max: found.defense_max,
            augmented: found.defense_augment_max
        }
    }
    return item;
};
const images = (armor = true) => {
    return async (item) => {
        const lookup = item.name.toLowerCase().replace(/ /g, '_');
        let base = lookup.replace('_alpha', '').replace('_beta', '');

        let checks = [];
        if (armor) {
            checks = [
                ['male', `${lookup}_male.png`],
                ['female', `${lookup}_female.png`],
                ['male', `${base}_male.png`],
                ['female', `${base}_female.png`],
                ['base', `${base}.png`]
            ]
        } else {
            const number = /_([\d])$/;
            const matched = base.match(number);
            let version = matched ? parseInt(matched[1]) : 0;
            checks = [];
            base = base.replace(number, '');
            while (version > 0) {
                checks.push(['base', `${base}_${'i'.repeat(version)}.png`]);
                version--;
            }
            checks.push(
                ['preview', `${base}_96x96.png`],
                ['base', `${base}.png`]
            )
        }


        const returnValue = (acc, image, name, url) => {
            if (url) {
                resolvedImages[image] = url;
            }
            return url ? {...acc, [name]: url} : acc;
        };

        item.images = await Promise.reduce(checks, (acc, check) => {
            const [name, image] = check;
            if (acc[name]) return acc;
            const url = resolvedImages[image];
            if (url) {
                return returnValue(acc, image, name, url);
            }
            return checkImage(image)
                .then((url) => {
                    return returnValue(acc, image, name, url);
                })
        }, {});
        return item;
    }

};

const pull = async (name, fn) => {
    const data = await time(`pull(${name})`, fn);
    write(data, name);
};
const select = (...fields) => {
    return (item) => {
        return _.pick(item, fields)
    }
};
/**
 *
 * @param name
 * @param items
 * @param steps
 * @returns {Iterable.<Promise>}
 */
const run = async (name, items, steps) => {
    return await time(`runner(${name})`, async () => {
        items = _.isArray(items) ? items : [items];
        return await Promise.reduce(_.keys(steps), async (acc, step) => {
            return await time(`runner(${name}) - step = ${step}`, async () => {
                return await Promise.map(acc, steps[step]);
            })

        }, items);
    })


};
const applyRunner = async (endpoint, fields, armor = true) => {
    const normalize = async (items) => {
        return await Promise.all(run(endpoint, items,
            {
                fields,
                transformAttributes: transformAttributes(transformResists),
                transformSlots,
                transformSharpness,
                transformElement,
                images: images(armor),
                transformDefense
            }
        ));


    };
    return await get(endpoint)
        .then(normalize);
};
const armor = async (uri = '') => {
    const fields = select('id', 'name', 'type', 'rank', 'rarity', 'attributes',
        'skills');

    return applyRunner('armor', fields)
};

const charms = async () => {
    const number = /([\d])$/;
    return get('charms').then(charms => {
        charms = charms.reduce((acc, charm) => {
            const name = charm.name.replace(number, '').trim();
            if (!acc[name]) {
                acc[name] = {
                    name: name,
                    id: charm.id,
                    ranks: []
                }
            }
            acc[name].ranks.push(charm);
            return acc;
        }, {});
        return Object.values(charms);
    })
};
const decorations = () => {
    return get('decorations');
};
const skills = async () => {
    return get('skills');
};
const weapons = async () => {
    const fields = select('id', 'slug', 'name', 'type', 'rarity', 'attributes');
    return applyRunner('weapons', fields, false);
};


const time = async (name, fn) => {
    const start = (new Date()).getTime();
    debug('%s started', name);
    const rtn = await fn();
    const end = (new Date()).getTime();
    debug('%s finished', (end - start) / 1000, name);
    return rtn;

};

const sync = async (mapping) => {
    return await Promise.mapSeries(_.keys(mapping), async (name) => {
        return await pull(name, mapping[name]);
    });
};

let extraArmorDB = {};
const sink = time("sync", async () => {
    request.get(extraArmorDBUrl)
        .then(body => {
            extraArmorDB = JSON.parse(body);
            return sync({
                armor,
                weapons,
                decorations,
                charms,
                skills
            })
        });

});
    






