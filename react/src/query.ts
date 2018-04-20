import {isEqual} from 'lodash'

function objectify(a) {
    let rows = [];
    for (let key in a) {
        let o = {};
        o[key] = a[key];
        rows.push(o);
    }
    return rows;
}


// polyfill, since String.startsWith is part of ECMAScript 6,
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this['lastIndexOf'](searchString, position) === position;
        }
    });
}

// polyfill, since String.endsWith is part of ECMAScript 6,
if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        value: function (searchString, position) {
            let subjectString = this.toString();
            if (position === undefined || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            let lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

// should turn this function around so it works more like this
//
// let truth = Query(q).satisfies(obj)

let Query = {

    satisfies: function (row, constraints, getter) {
        return Query.lhs._rowsatisfies(row, constraints, getter);
    },

    Query: function (constraints, getter) {
        return function (row) {
            return Query.lhs._rowsatisfies(row, constraints, getter);
        }
    },

    join: function (left_rows, right_rows, left_key, right_key) {
        let leftKeyFn, rightKeyFn;
        if (typeof left_key == 'string') leftKeyFn = function (row) {
            return row[left_key];
        }
        else leftKeyFn = left_key;

        if (!right_key) rightKeyFn = leftKeyFn;
        if (typeof right_key == 'string') rightKeyFn = function (row) {
            return row[left_key];
        }
        else rightKeyFn = right_key;

        return left_rows;


    },
    query: function (rows, constraints, getter = null) {

        if (typeof getter == 'string') {
            let method = getter;

            getter = function (obj, key) {
                return obj[method](key);
            };
        }
        let filter = Query.Query(constraints, getter);
        return rows.filter(filter);
    },


    lhs: { // queries that are not yet referenced to a particular attribute, e.g. {$not: {likes: 0}}

        // test whether a row satisfies a constraints hash,
        _rowsatisfies: function (row, constraints, getter = undefined) {
            for (let key in constraints) {
                if (this[key]) {
                    if (!this[key](row, constraints[key], getter)) return false;
                }
                else {
                    let val = (getter ? getter(row, key) : row[key]);
                    let res = this.rhs._satisfies(val, constraints[key], key)
                    if (!res) return false;
                }
            }
            return true;
        },


        $not: function (row, constraint, getter) {
            return !this._rowsatisfies(row, constraint, getter);
        },

        $or: function (row, constraint, getter) {
            if (!Array.isArray(constraint)) {
                constraint = objectify(constraint);
            }
            for (let i = 0; i < constraint.length; i++) {
                if (this._rowsatisfies(row, constraint[i], getter)) return true;
            }
            return false;
        },

        $and: function (row, constraint, getter) {
            if (!Array.isArray(constraint)) {
                constraint = objectify(constraint);
            }

            for (let i = 0; i < constraint.length; i++) {
                if (!this._rowsatisfies(row, constraint[i], getter)) return false;
            }
            return true;
        },

        $nor: function (row, constraint, getter) {
            return !this.$or(row, constraint, getter)
        },

        $where: function (values, ref) {
            let fn = (typeof ref == 'string') ? new Function(ref) : ref;
            let res = fn.call(values)
            return res;
        },


        rhs: {  // queries that reference a particular attribute, e.g. {likes: {$gt: 10}}

            $cb: function (value, constraint, parentKey) {
                return constraint(value)
            },
            // test whether a single value matches a particular constraint
            _satisfies: function (value, constraint, parentKey = undefined) {

                if (constraint === value) return true;
                else if (constraint instanceof RegExp) return this.$regex(value, constraint);
                else if (Array.isArray(constraint)) return this.$in(value, constraint);
                else if (constraint && typeof constraint === 'object') {
                    if (constraint.$regex) return this.$regex(value, new RegExp(constraint.$regex, constraint.$options))
                    for (let key in constraint) {
                        if (!this[key]) return this.$eq(value, constraint, parentKey)
                        else if (!this[key](value, constraint[key], parentKey)) return false;
                    }
                    return true;
                }
                else if (Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++)
                        if (this.$eq(value[i], constraint)) return true;
                    return false;
                }
                else if (constraint === '' || constraint === null || constraint === undefined) return this.$null(value);
                else return this.$eq(value, constraint);

            },


            $eq: function (value, constraint = null, parentKey = null) {

                if (value === constraint) return true;
                else if (Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++)
                        if (this.$eq(value[i], constraint)) return true;
                    return false;
                }
                else if (constraint === null || constraint === undefined || constraint === '') {
                    return this.$null(value);
                }
                else if (value === null || value === '' || value === undefined) return false; //we know from above the constraint is not null
                else {
                    return value == constraint
                }


            },


            $exists: function (value, constraint, parentKey) {
                return (value != undefined) == (constraint && true);
            },

            $deepEquals: function (value, constraint) {
                return isEqual(value, constraint);

            },

            $not: function (values, constraint) {
                return !this._satisfies(values, constraint);

            },

            $ne: function (values, constraint) {
                return !this._satisfies(values, constraint);
            },

            $nor: function (values, constraint, parentKey) {
                return !this.$or(values, constraint, parentKey);
            },

            $and: function (values, constraint, parentKey) {

                if (!Array.isArray(constraint)) {
                    throw new Error("Logic $and takes array of constraint objects");
                }
                for (let i = 0; i < constraint.length; i++) {
                    let res = this._satisfies(values, constraint[i], parentKey);
                    if (!res) return false;
                }
                return true;
            },

            // Identical to $in, but allows for different semantics
            $or: function (values, constraint, parentKey) {

                if (!Array.isArray(values)) {
                    values = [values];
                }

                for (let v = 0; v < values.length; v++) {
                    for (let i = 0; i < constraint.length; i++) {
                        if (this._satisfies(values[v], constraint[i], parentKey)) {
                            return true;
                        }
                    }
                }

                return false;
            },

            /**
             * returns true if all of the values in the array are null
             * @param values
             * @returns {boolean}
             */
            $null: function (values) {
                let result;
                if (values === '' || values === null || values === undefined) {
                    return true;
                }
                else if (Array.isArray(values)) {
                    for (let v = 0; v < values.length; v++) {
                        if (!this.$null(values[v])) {
                            return false;
                        }
                    }
                    return true;
                }
                else return false;
            },


            /**
             * returns true if any of the values are keys of the constraint
             * @param values
             * @param constraint
             * @returns {boolean}
             */
            $in: function (values, constraint) {
                if (!Array.isArray(constraint)) throw new Error("$in requires an array operand");
                let result = false;
                if (!Array.isArray(values)) {
                    values = [values];
                }
                for (let v = 0; v < values.length; v++) {
                    let val = values[v];
                    for (let i = 0; i < constraint.length; i++) {
                        if (this._satisfies(val, constraint[i])) {
                            result = true;
                            break;
                        }
                    }
                    result = result || ( constraint.indexOf(val) >= 0);
                }

                return result;
            },

            $likeI: function (values, constraint) {
                return values.toLowerCase().indexOf(constraint) >= 0;
            },

            $like: function (values, constraint) {
                return values.indexOf(constraint) >= 0;
            },

            $startsWith: function (values, constraint) {
                if (!values) return false;
                return values.startsWith(constraint);
            },

            $endsWith: function (values, constraint) {
                if (!values) return false;
                return values.endsWith(constraint);
            },

            $elemMatch: function (values, constraint, parentKey) {
                if (!values) return false;
                for (let i = 0; i < values.length; i++) {
                    if (Query.lhs._rowsatisfies(values[i], constraint)) return true;
                }
                return false;
            },

            $contains: function (values, constraint) {
                return values.indexOf(constraint) >= 0;
            },

            $nin: function (values, constraint) {
                return !this.$in(values, constraint);
            },

            $regex: function (values, constraint) {
                let result = false;
                if (Array.isArray(values)) {
                    for (let i = 0; i < values.length; i++) {
                        if (constraint.test(values[i])) {
                            return true;
                        }
                    }
                }
                else return constraint.test(values);

            },

            $gte: function (values, ref) {
                return !this.$null(values) && values >= this.resolve(ref)
            },

            $gt: function (values, ref) {
                return !this.$null(values) && values > this.resolve(ref);
            },

            $lt: function (values, ref) {
                return !this.$null(values) && values < this.resolve(ref);
            },

            $lte: function (values, ref) {
                return !this.$null(values) && values <= this.resolve(ref);
            },

            $before: function (values, ref) {
                if (typeof ref === 'string') ref = Date.parse(ref);
                if (typeof values === 'string') values = Date.parse(values);
                return this.$lte(values, ref)
            },

            $after: function (values, ref) {
                if (typeof ref === 'string') ref = Date.parse(ref);
                if (typeof values === 'string') values = Date.parse(values);

                return this.$gte(values, ref)
            },

            $type: function (values, ref) {
                return typeof values == ref;
            },

            $all: function (values, ref) {
                throw new Error("$all not implemented")
            },

            $size: function (values, ref) {
                return (typeof values == 'object' && (values.length == ref || Object.keys(values).length == ref) );
            },

            $mod: function (values, ref) {
                return values % ref[0] == ref[1]
            },
            $equal: function () {
                return this.$eq(arguments);
            },
            $between: function (values, ref) {
                return this._satisfies(values, {$gt: ref[0], $lt: ref[1]})
            },
            resolve: function (ref) {
                if (typeof ref === 'object') {
                    if (ref["$date"]) return Date.parse(ref["$date"])
                }
                return ref;
            }
        }
    }
};

// Provide means to parse dot notation for deep Mongo queries, optional for performance
Query['undot'] = function (obj, key) {
    let keys = key.split('.'), sub = obj;
    for (let i = 0; i < keys.length; i++) {
        sub = sub[keys[i]]
    }
    return sub;
};

Query['lhs']['rhs']['$equal'] = <any> Query.lhs.rhs.$eq;
Query['lhs']['rhs']['$any'] = <any>Query.lhs.rhs.$or;
Query['lhs']['rhs']['$all'] = <any>Query.lhs.rhs.$and;

Query.satisfies = function (row, constraints, getter) {
    return this.lhs._rowsatisfies(row, constraints, getter);
};
Array.prototype['query'] = function (q) {
    return Query.query(this, q);
};

//This allows a query object with regex values to be serialized to JSON
//http://stackoverflow.com/questions/12075927/serialization-of-regexp
//However, it doesn't solve the problem of parsing them back to regex on input
RegExp.prototype['toJSON'] = RegExp.prototype.toString;

export default Query;

    
