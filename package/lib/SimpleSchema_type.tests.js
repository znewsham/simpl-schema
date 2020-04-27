/* eslint-disable func-names, prefer-arrow-callback */

import expect from 'expect';
import expectErrorLength from './testHelpers/expectErrorLength';
import expectErrorOfTypeLength from './testHelpers/expectErrorOfTypeLength';
import friendsSchema from './testHelpers/friendsSchema';
import testSchema from './testHelpers/testSchema';
import { SimpleSchema } from './SimpleSchema';
import Address from './testHelpers/Address';

describe('SimpleSchema - type', function () {
  it('typed array', function () {
    const schema = new SimpleSchema({
      ta: {
        type: Uint8Array,
      },
    });

    expectErrorLength(schema, {
      ta: new Uint8Array(100000000),
    }).toEqual(0);
  });

  it('array of objects', function () {
    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, friendsSchema, {
      $set: {
        enemies: [{
          name: 'Zach',
          traits: [{
            name: 'evil',
            weight: 'heavy',
          }],
        }],
      },
    }, { modifier: true }).toEqual(1);

    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, friendsSchema, {
      $set: {
        enemies: [{
          name: 'Zach',
          traits: [{
            name: 'evil',
            weight: 9.5,
          }],
        }],
      },
    }, { modifier: true }).toEqual(0);
  });

  describe('custom type', function () {
    it('valid', function () {
      const schema = new SimpleSchema({
        address: { type: Address },
        createdAt: { type: Date },
        file: { type: Uint8Array },
      });

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, schema, {
        createdAt: new Date(),
        file: new Uint8Array([104, 101, 108, 108, 111]),
        address: new Address('San Francisco', 'CA'),
      }).toEqual(0);
    });

    it('invalid', function () {
      const schema = new SimpleSchema({
        address: { type: Address },
        createdAt: { type: Date },
        file: { type: Uint8Array },
      });

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, schema, {
        createdAt: {},
        file: {},
        address: {},
      }).toEqual(3);
    });
  });

  it('weird type', function () {
    expect(function () {
      new SimpleSchema({ // eslint-disable-line no-new
        name: { type: Array[Object] },
      });
    }).toThrow();
  });

  describe('string', function () {
    it('normal', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: 'test',
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: true,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: 1,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: { test: 'test' },
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: ['test'],
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        string: new Date(),
      }).toEqual(1);
    });

    it('modifier with $setOnInsert', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: 'test' },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: true },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: 1 },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: { test: 'test' } },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: ['test'] },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { string: new Date() },
      }, { modifier: true, upsert: true }).toEqual(1);
    });

    it('modifier with $set', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: 'test' },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: true },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: 1 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: { test: 'test' } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: ['test'] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { string: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: 'test' },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: true },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: 1 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { test: 'test' } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: ['test'] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $addToSet', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: 'test' },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: true },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: 1 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: { test: 'test' } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: ['test'] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedStringsArray: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push + $each', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: ['test', 'test'] } },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: [true, false] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: [1, 2] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: [{ test: 'test' }, { test: 'test2' }] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: [['test'], ['test']] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedStringsArray: { $each: [new Date(), new Date()] } },
      }, { modifier: true }).toEqual(2);
    });
  });

  describe('boolean', function () {
    it('normal', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: true,
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: false,
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: 'true',
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: 0,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: { test: true },
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: [false],
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        boolean: new Date(),
      }).toEqual(1);
    });

    it('modifier with $setOnInsert', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: true },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: false },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: 'true' },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: 0 },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: { test: true } },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: [false] },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { boolean: new Date() },
      }, { modifier: true, upsert: true }).toEqual(1);
    });

    it('modifier with $set', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: true },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: false },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: 'true' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: 0 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: { test: true } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: [false] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { boolean: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: true },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: false },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: 'true' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: 0 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { test: true } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: [false] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $addToSet', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: true },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: false },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: 'true' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: 0 },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: { test: true } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: [false] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { booleanArray: new Date() },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push + $each', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: [true, false] } },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: ['true', 'false'] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: [0, 1] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: [{ test: true }, { test: false }] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: [[true], [false]] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { booleanArray: { $each: [new Date(), new Date()] } },
      }, { modifier: true }).toEqual(2);
    });
  });

  describe('number', function () {
    it('normal', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: 1,
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: 0,
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: 'test',
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: false,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: { test: 1 },
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: [1],
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: new Date(),
      }).toEqual(1);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        number: NaN,
      }).toEqual(1);
    });

    it('modifier with $setOnInsert', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: 1 },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: 0 },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: 'test' },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: false },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: { test: 1 } },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: [1] },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: new Date() },
      }, { modifier: true, upsert: true }).toEqual(1);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { number: NaN },
      }, { modifier: true, upsert: true }).toEqual(1);
    });

    it('modifier with $set', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: 1 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: 0 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: { test: 1 } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: [1] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: new Date() },
      }, { modifier: true }).toEqual(1);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { number: NaN },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: 1 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: 0 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { test: 1 } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: [1] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: new Date() },
      }, { modifier: true }).toEqual(1);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: NaN },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $addToSet', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: 1 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: 0 },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: { test: 1 } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: [1] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: new Date() },
      }, { modifier: true }).toEqual(1);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { allowedNumbersArray: NaN },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push + $each', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [0, 1] } },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: ['test', 'test'] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [false, true] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [{ test: 1 }, { test: 2 }] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [[1], [2]] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [new Date(), new Date()] } },
      }, { modifier: true }).toEqual(2);

      // NaN does not count
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { allowedNumbersArray: { $each: [NaN, NaN] } },
      }, { modifier: true }).toEqual(2);
    });
  });

  describe('date', function () {
    it('normal', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: new Date(),
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: 'test',
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: false,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: { test: new Date() },
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: [new Date()],
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        date: 1,
      }).toEqual(1);
    });

    it('modifier with $setOnInsert', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: new Date() },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: 'test' },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: false },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: { test: new Date() } },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: [new Date()] },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { date: 1 },
      }, { modifier: true, upsert: true }).toEqual(1);
    });

    it('modifier with $set', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: new Date() },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: { test: new Date() } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: [new Date()] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { date: 1 },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: new Date() },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { test: new Date() } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: [new Date()] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: 1 },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $addToSet', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: new Date() },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: { test: new Date() } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: [new Date()] },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $addToSet: { dateArray: 1 },
      }, { modifier: true }).toEqual(1);
    });

    it('modifier with $push + $each', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: [new Date(), new Date()] } },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: ['test', 'test'] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: [false, true] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: [{ test: new Date() }, { test: new Date() }] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: [[new Date()], [new Date()]] } },
      }, { modifier: true }).toEqual(2);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $push: { dateArray: { $each: [1, 2] } },
      }, { modifier: true }).toEqual(2);
    });
  });

  describe('array', function () {
    it('normal', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: [],
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: [true],
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: [false],
      }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: 'test',
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: false,
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: { test: [] },
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: ['test'],
      }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        booleanArray: 1,
      }).toEqual(1);
    });

    it('modifier with $setOnInsert', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: [true, false] },
      }, { modifier: true, upsert: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: 'test' },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: false },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: { test: [false] } },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: new Date() },
      }, { modifier: true, upsert: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $setOnInsert: { booleanArray: 1 },
      }, { modifier: true, upsert: true }).toEqual(1);
    });

    it('modifier with $set', function () {
      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: [true, false] },
      }, { modifier: true }).toEqual(0);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: 'test' },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: false },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: { test: false } },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: new Date() },
      }, { modifier: true }).toEqual(1);

      expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, testSchema, {
        $set: { booleanArray: 1 },
      }, { modifier: true }).toEqual(1);
    });

    it('sparse arrays', function () {
      const schema = new SimpleSchema({
        sparse: Array,
        'sparse.$': {
          type: String,
          optional: true,
        },
      });

      expectErrorLength(schema, {
        sparse: ['1', null, '2', null],
      }).toEqual(0);
    });

    it('ignores slice', function () {
      expectErrorLength(testSchema, {
        $push: {
          booleanArray: { $each: [false, true], $slice: -5 },
          dateArray: { $each: [(new Date()), (new Date())], $slice: -5 },
          allowedStringsArray: { $each: ['tuna', 'fish'], $slice: -5 },
          allowedNumbersArray: { $each: [2, 1], $slice: -5 },
        },
      }, { modifier: true }).toEqual(0);
    });

    it('ignores pull', function () {
      expectErrorLength(testSchema, {
        $pull: {
          booleanArray: 'foo',
          dateArray: 'foo',
          allowedStringsArray: 'foo',
          allowedNumbersArray: 200,
        },
      }, { modifier: true }).toEqual(0);
    });

    it('ignores pull + $each', function () {
      expectErrorLength(testSchema, {
        $pull: {
          booleanArray: { $each: ['foo', 'bar'] },
          dateArray: { $each: ['foo', 'bar'] },
          allowedStringsArray: { $each: ['foo', 'bar'] },
          allowedNumbersArray: { $each: [200, 500] },
        },
      }, { modifier: true }).toEqual(0);
    });

    it('ignores pullAll', function () {
      expectErrorLength(testSchema, {
        $pullAll: {
          booleanArray: ['foo', 'bar'],
          dateArray: ['foo', 'bar'],
          allowedStringsArray: ['foo', 'bar'],
          allowedNumbersArray: [200, 500],
        },
      }, { modifier: true }).toEqual(0);
    });

    it('ignores pop', function () {
      expectErrorLength(testSchema, {
        $pop: {
          booleanArray: 1,
          dateArray: 1,
          allowedStringsArray: 1,
          allowedNumbersArray: 1,
        },
      }, { modifier: true }).toEqual(0);

      expectErrorLength(testSchema, {
        $pop: {
          booleanArray: -1,
          dateArray: -1,
          allowedStringsArray: -1,
          allowedNumbersArray: -1,
        },
      }, { modifier: true }).toEqual(0);
    });
  });
});
