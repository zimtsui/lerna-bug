import {
    Startable,
    StopCalledDuringStarting,
} from '../../build/index';
import sinon = require('sinon');
import test from 'ava';
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
const { fake } = sinon;
chai.use(chaiAsPromised);
const { assert } = chai;

test('start succ stop succ', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});

test('start succ stop fail', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.reject(new Error('stop'));
    });
    await s.start();
    s.stop();
    await assert.isRejected(s.stop(), /^stop$/);
    assert(f.callCount === 2);
});

test('start fail stop succ', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.reject(new Error('start'));
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start().catch(() => { });
    await assert.isRejected(s.start(), /^start$/);
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});

test('start fail stop fail', async t => {
    const f = fake();
    const s = Startable.create(async () => {
        f();
        return Promise.reject(new Error('start'));

    }, async () => {
        f();
        return Promise.reject(new Error('stop'));
    });
    s.start().catch(() => { });
    await assert.isRejected(s.start(), /^start$/);
    s.stop();
    await assert.isRejected(s.stop(), /^stop$/);
    assert(f.callCount === 2);
});

test('stop during starting', async t => {
    const f = fake();
    let resolveStart: () => void;
    const s = Startable.create(async () => {
        f();
        return new Promise<void>(resolve => {
            resolveStart = resolve;
        });
    }, async () => {
        f();
        return Promise.resolve();
    });
    const pStart = s.start();
    pStart.catch(() => { });
    const pStop = s.stop();
    resolveStart!();
    await assert.isRejected(pStart, new StopCalledDuringStarting().message);
    await assert.isFulfilled(pStop);
    assert(f.callCount === 2);
});
