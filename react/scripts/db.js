const request = require('request-promise');
const Promise = require('bluebird');
const _ = require('lodash');
const debug = require('debug')('mhbuilder:db');
const IMAGE_PATH = 'https://monsterhunterworld.wiki.fextralife.com/file/Monster-Hunter-World/';
const fs = require('fs');
const path = require('path');
const get = async (endpoint) => {
    const url = `https://mhw-db.com/${endpoint}`;
    debug('get - %s', url);
    return request.get(url).then(body => JSON.parse(body));
};
const write = (json, name) => {
    const output = path.resolve(`${__dirname}/../public/assets/db/${name}.json`);
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
const images = (armor = true) => {
    return async (item) => {
        const lookup = item.name.toLowerCase().replace(/ /g, '_');
        const base = lookup.replace('_alpha', '').replace('_beta', '');

        if (item.name === 'Diablos Mail Alpha') {
            const a = '';
        }
        const checks = armor ? [
            ['male', `${lookup}_male.png`],
            ['female', `${lookup}_female.png`],
            ['male', `${base}_male.png`],
            ['female', `${base}_female.png`],
            ['base', `${base}.png`]
        ] : [];
        item.images = await Promise.reduce(checks, (acc, check) => {
            const [name, image] = check;
            if (acc[name]) return acc;
            return checkImage(image)
                .then((url) => {
                    return url ? {...acc, [name]: url} : acc;
                })
        }, {});
        return item;
    }

};

const pull = async (name, fn) => {
    const data = await time(`pull(${name})`, fn);
    write(data, name);
}
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
const applyRunner = async (endpoint, fields,) => {
    const normalize = async (items) => {
        return await Promise.all(run(endpoint, items,
            {
                fields,
                transform: transformAttributes(transformResists),
                images: images()
            }
        ));


    };
    return await get(endpoint)
        .then(normalize);
}
const armor = async (uri = '') => {
    const fields = select('id', 'name', 'type', 'rank', 'rarity', 'attributes',
        'skills');

    return applyRunner('armor', fields)
};

const charms = async () => {

};
const decorations = () => {
    return get('decorations').then(decos => {
            return write(decos, 'decorations');
        }
    );
};
const skills = async () => {
    return get('skills').then(skills => {
        return write(skills, 'skills');
    })
};
const weapons = async () => {
    const fields = select('id', 'slug', 'name', 'type', 'rarity', 'attributes');
    return applyRunner('weapons', fields);
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

const sink = time("sync", async () => {
    return sync({
        armor,
        weapons,
        //decorations,
        //skills
    })
});
    






