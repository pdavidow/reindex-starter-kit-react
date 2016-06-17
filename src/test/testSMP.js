import test from 'tape';
import stampit from 'stampit';
import {SmartModelPrivate} from '../models/private';

const privates = SmartModelPrivate.create();

test('simple get/set', (assert) => {
    const Q = stampit()
        .init(function() {
            privates.init(this);
        })
        .methods({
            getX() {return privates.getSmartProp(this, 'x', ()=>3)},
            setX(val) {privates.setProp(this, 'x', val)},
        });
    const q = Q();
    q.setX(1);

    const actual = q.getX();
    const expected = 1;
    assert.equal(actual, expected, 'should get setting');
    assert.end();
});

test('reset', (assert) => {
    const Q = stampit()
        .init(function() {
            privates.init(this);
        })
        .methods({
            getX() {return privates.getSmartProp(this, 'x', ()=>3)},
            setX(val) {privates.setProp(this, 'x', val)},
            resetX() {privates.reset(this, 'x')},
        });
    const q = Q();
    q.setX(1);
    q.resetX();

    const actual = q.getX();
    const expected = 3;
    assert.equal(actual, expected, 'should make setting after reset');

    assert.end();
});

test('lazy init with hard-coded initialzer', (assert) => {
    const Q = stampit()
        .init(function() {
            privates.init(this);
        })
        .methods({
            getX() {return privates.getSmartProp(this, 'x', ()=>3)},
        });
    const q = Q();

    const actual = q.getX();
    const expected = 3;
    assert.equal(actual, expected, 'should lazy init');

    assert.end();
});

test('lazy init with function initialzer', (assert) => {
    const Q = stampit()
        .init(function({p = 0}) {
            this.p = p;
            privates.init(this);
        })
        .methods({
            getX() {return privates.getSmartProp(this, 'x', ()=>this.initX())},
            initX() {
                const val = this.p;
                return val * val;
            }
        });
    const q = Q({p:3});

    const actual = q.getX();
    const expected = 9;
    assert.equal(actual, expected, 'should lazy init');

    assert.end();
});

test('lazy init, only reinit upon reset', (assert) => {
    const Q = stampit()
        .init(function() {
            this.count = 0;
            privates.init(this);
        })
        .methods({
            getX() {return privates.getSmartProp(this, 'x', ()=>this.initX())},
            resetX() {privates.reset(this, 'x')},
            initX() {
                this.count++;
                return 3;
            }
        });
    const q = Q();

    let actual = q.count;
    let expected = 0;
    assert.equal(actual, expected, 'should be 0');

    q.getX();

    actual = q.count;
    expected = 1;
    assert.equal(actual, expected, 'should be 1');

    q.resetX();

    actual = q.count;
    expected = 1;
    assert.equal(actual, expected, 'should be 1');

    q.getX();

    actual = q.count;
    expected = 2;
    assert.equal(actual, expected, 'should be 2');

    q.getX();

    actual = q.count;
    expected = 2;
    assert.equal(actual, expected, 'should be 2');

    assert.end();
});

test('setter may reset other state', (assert) => {
    const Q = stampit()
        .init(function() {
            privates.init(this);
        })
        .methods({
            getX() {return privates.getProp(this, 'x')},
            setX(val) {privates.setSmartProp(this, 'x', val, () => this.resetY())},

            getY() {return privates.getSmartProp(this, 'y', () => this.getX())},
            resetY() {privates.reset(this, 'y')},
        });
    const q = Q();

    q.setX(1);
    q.getY();

    q.setX(2);

    let actual = q.getY();
    let expected = 2;
    assert.equal(actual, expected, 'should be 2');

    q.setX(3);

    actual = q.getY();
    expected = 3;
    assert.equal(actual, expected, 'should be 3');

    assert.end();
});

