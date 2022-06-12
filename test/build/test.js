"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const sinon = require("sinon");
const ava_1 = require("ava");
const { fake } = sinon;
const assert = require("assert");
class StartError extends Error {
    constructor() {
        super('');
    }
}
class StopError extends Error {
    constructor() {
        super('');
    }
}
(0, ava_1.default)('start succ stop succ', async (t) => {
    const f = fake();
    const s = __1.Startable.create(async () => {
        f();
        assert(s.getReadyState() === "STARTING" /* STARTING */);
        return Promise.resolve();
    }, async () => {
        f();
        assert(s.getReadyState() === "STOPPING" /* STOPPING */);
        return Promise.resolve();
    });
    s.start();
    await s.start();
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start succ stop fail', async (t) => {
    const f = fake();
    const s = __1.Startable.create(async () => {
        f();
        return Promise.resolve();
    }, async () => {
        f();
        return Promise.reject(new StopError());
    });
    await s.start();
    s.stop().catch(() => { });
    await assert.rejects(s.stop(), StopError);
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop succ', async (t) => {
    const f = fake();
    const s = __1.Startable.create(async () => {
        f();
        return Promise.reject(new StartError());
    }, async () => {
        f();
        return Promise.resolve();
    });
    s.start().catch(() => { });
    await assert.rejects(s.start(), StartError);
    s.stop();
    await s.stop();
    assert(f.callCount === 2);
});
(0, ava_1.default)('start fail stop fail', async (t) => {
    const f = fake();
    const s = __1.Startable.create(async () => {
        f();
        return Promise.reject(new StartError());
    }, async () => {
        f();
        return Promise.reject(new StopError());
    });
    s.start().catch(() => { });
    await assert.rejects(s.start(), StartError);
    s.stop().catch(() => { });
    await assert.rejects(s.stop(), StopError);
    assert(f.callCount === 2);
});
(0, ava_1.default)('starp during starting', async (t) => {
    const f = fake();
    let resolveStart;
    const s = __1.Startable.create(async () => {
        f();
        return new Promise(resolve => {
            resolveStart = resolve;
        });
    }, async () => {
        f();
        return Promise.resolve();
    });
    const pStart = s.start();
    pStart.catch(() => { });
    const pStarp = s.starp();
    resolveStart();
    await assert.rejects(pStart, __1.StarpCalledDuringStarting);
    await pStarp;
    assert(f.callCount === 2);
});
//# sourceMappingURL=test.js.map