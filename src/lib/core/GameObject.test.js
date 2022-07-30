import test from 'ava';
import { GameObject } from './GameObject.js';
import { GameEvent } from './GameEvent.js';

test('propagates an event', (t) => {
  t.plan(3);

  const payload = {
    a: 'hello',
    b: 4557438384,
    c: [true, false],
  };

  const root = new GameObject({});
  root.onTestEvent = (event) => {
    t.deepEqual(event.data, payload);
  };

  const childShallow = new GameObject({});
  childShallow.onTestEvent = (event) => {
    t.deepEqual(event.data, payload);
  };
  root.add(childShallow);

  const childDeep = new GameObject({});
  childDeep.onTestEvent = (event) => {
    t.deepEqual(event.data, payload);
  };
  childShallow.add(childDeep);

  root.handleEvent(new GameEvent('testEvent', payload));
});

test('can stop propagation', (t) => {
  t.plan(2);

  const payload = {
    a: 'hello',
    b: 4557438384,
    c: [true, false],
  };

  const root = new GameObject({});
  root.onTestEvent = (event) => {
    t.deepEqual(event.data, payload);
  };

  const childShallow = new GameObject({});
  childShallow.onTestEvent = (event) => {
    event.stopPropagating();

    t.deepEqual(event.data, payload);
  };
  root.add(childShallow);

  const childDeep = new GameObject({});
  childDeep.onTestEvent = (_event) => {
    t.fail();
  };
  childShallow.add(childDeep);

  root.handleEvent(new GameEvent('testEvent', payload));
});
