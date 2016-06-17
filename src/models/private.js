import stampit from 'stampit';
import isUndefinedOrNull from 'validate.io-undefined-or-null';

export const Private = stampit()
    .init((options, { instance }) => {
        instance.map = new WeakMap();
    })
    .methods({
        init(owner) {
            const ownerMap = new Map();
            this.map.set(owner, ownerMap);
            return ownerMap;
        },
        for(owner) {
            return this.map.get(owner);
        },
        get(owner, key) {
            const ownerMap = this.for(owner);
            return ownerMap.has(key) ? ownerMap.get(key) : null;
        },
        set(owner, key, value) {
            this.for(owner).set(key, value);
            return value;
        }
    })
;

export const ModelPrivate = Private.methods({
    _initProps(owner) {
        this.set(owner, 'props', {});
    },
    getProp(owner, propName) {
        const props = this.get(owner, 'props');
        if (!isUndefinedOrNull(props)) return props[propName];

        this._initProps(owner);
        return this.getProp(owner, propName);

    },
    setProp(owner, propName, value) {
        const props = this.get(owner, 'props');
        if (!isUndefinedOrNull(props)) return props[propName] = value;

        this._initProps(owner);
        return this.setProp(owner, propName, value);
    },
    reset(owner, propName) {
        this.setProp(owner, propName, null);
    }
});

export const SmartModelPrivate = ModelPrivate.methods({
    getSmartProp(owner, propName, initFunc) {
        const prop = this.getProp(owner, propName);
        if (!isUndefinedOrNull(prop)) return prop;

        this.setProp(owner, propName, initFunc());
        return this.getSmartProp(owner, propName, initFunc);
    },
    setSmartProp(owner, propName, value, moreFunc) {
        const val = this.setProp(owner, propName, value);
        moreFunc();
        return val;
    },
});