import stampit from 'stampit';
import {lcm} from 'mathjs';
import {SmartModelPrivate} from '../models/private';

const privates = SmartModelPrivate.create();

export const Beat = stampit()
    .init(function({rh = 0, lh = 0}) {
        privates.init(this);

        this.set_rh(rh);
        this.set_lh(lh);

        privates.set(this, 'tickIndices', (noteCount) => {
            const interval = this.get_tickCount() / noteCount;
            const indicies = [];
            let index = 0;

            while (index < this.get_tickCount()) {
                indicies.push(index);
                index += interval;
            }
            return indicies;
        });
    })
    .methods({
        get_rh() {return privates.getProp(this, 'rh')},
        set_rh(val) {privates.setSmartProp(this, 'rh', val, () => {
            this.reset_tickCount();
            this.reset_rhTickIndices();
            this.reset_lhTickIndices();
        })},

        get_lh() {return privates.getProp(this, 'lh')},
        set_lh(val) {privates.setSmartProp(this, 'lh', val, () => {
            this.reset_tickCount();
            this.reset_rhTickIndices();
            this.reset_lhTickIndices();
        })},

        get_tickCount() {return privates.getSmartProp(this, 'tickCount', () => {
            return lcm(this.get_rh(), this.get_lh());
        })},
        reset_tickCount() {privates.reset(this, 'tickCount')},

        get_rhTickIndices() {return privates.getSmartProp(this, 'rhTickIndices', () => {
            const func = privates.get(this, 'tickIndices');
            return func(this.get_rh());
        })},
        reset_rhTickIndices() {privates.reset(this, 'rhTickIndices')},

        get_lhTickIndices() {return privates.getSmartProp(this, 'lhTickIndices', () => {
            const func = privates.get(this, 'tickIndices');
            return func(this.get_lh());
        })},
        reset_lhTickIndices() {privates.reset(this, 'lhTickIndices')},
    });
