import test from 'tape';
import _ from 'lodash';
import {Beat} from '../models/beat';

test('Beat tick count', (assert) => {
    const msg = 'Beat tick count should equal lowest common multiple of rh and lh';

    let actual = Beat({rh: 3, lh: 1}).get_tickCount();
    let expected = 3;
    assert.equal(actual, expected, msg);

    actual = Beat({rh: 3, lh: 4}).get_tickCount();
    expected = 12;
    assert.equal(actual, expected, msg);

    actual = Beat({rh: 8, lh: 6}).get_tickCount();
    expected = 24;
    assert.equal(actual, expected, msg);

    assert.end();
});

test('Beat rh ticks', (assert) => {
    const msg = 'Beat should know its rh tick indices';

    let actual = Beat({rh: 3, lh: 1}).get_rhTickIndices();
    let expected = [0,1,2];
    assert.ok(_.isEqual(actual, expected), msg);

    actual = Beat({rh: 3, lh: 4}).get_rhTickIndices();
    expected = [0,4,8];
    assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});

test('Beat lh ticks', (assert) => {
    const msg = 'Beat should know its lh tick indices';

    let actual = Beat({rh: 3, lh: 1}).get_lhTickIndices();
    let expected = [0];
    assert.ok(_.isEqual(actual, expected), msg);

     actual = Beat({rh: 3, lh: 4}).get_lhTickIndices();
     expected = [0,3,6,9];
     assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});


test('Changing rh should reset tickCount', (assert) => {
    const msg = 'Changing rh should reset tickCount';

    const beat = Beat({rh: 2, lh: 3});
    beat.get_tickCount();
    beat.set_rh(4);

    const actual = beat.get_tickCount();
    const expected = 12;

    assert.equal(actual, expected, msg);

    assert.end();
});

test('Changing lh should reset tickCount', (assert) => {
    const msg = 'Changing lh should reset tickCount';

    const beat = Beat({rh: 2, lh: 3});
    beat.get_tickCount();
    beat.set_lh(5);

    const actual = beat.get_tickCount();
    const expected = 10;

    assert.equal(actual, expected, msg);

    assert.end();
});

test('Changing rh should reset rhTickIndices', (assert) => {
    const msg = 'Changing rh should reset rhTickIndices';

    const beat = Beat({rh: 5, lh: 4});
    beat.get_rhTickIndices();
    beat.set_rh(3);

    const actual = beat.get_rhTickIndices();
    const expected = [0,4,8];

    assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});

test('Changing lh should reset rhTickIndices', (assert) => {
    const msg = 'Changing lh should reset rhTickIndices';

    const beat = Beat({rh: 3, lh: 5});
    beat.get_rhTickIndices();
    beat.set_lh(4);

    const actual = beat.get_rhTickIndices();
    const expected = [0,4,8];

    assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});

test('Changing rh should reset lhTickIndices', (assert) => {
    const msg = 'Changing rh should reset lhTickIndices';

    const beat = Beat({rh: 5, lh: 4});
    beat.get_lhTickIndices();
    beat.set_rh(3);

    const actual = beat.get_lhTickIndices();
    const expected = [0,3,6,9];

    assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});

test('Changing lh should reset lhTickIndices', (assert) => {
    const msg = 'Changing lh should reset lhTickIndices';

    const beat = Beat({rh: 3, lh: 5});
    beat.get_lhTickIndices();
    beat.set_lh(4);

    const actual = beat.get_lhTickIndices();
    const expected = [0,3,6,9];

    assert.ok(_.isEqual(actual, expected), msg);

    assert.end();
});