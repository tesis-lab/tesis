// <!-- Created by Duncan on 12.28.2016 -->
import Vue from 'vue';
import Utils from '../../client/js/utils.js';

describe('Utils.send should', () => {

  let data = {
    userName: 'Sally',
    email: 'sally@me.com',
    password: '',
    saved: [some.txt, that.txt]
  }

  let response;

  beforeEach((done) => {
    Utils.send(data, (res) => {
      response = res;
      done();
    });
  });

  it('be defined', () => {
    expect(Utils.send).toBeDefined();
  });

  it('a new entrie should return an id', () => {
    expect(response.status).toBe(201);
    expect(typeof JSON.parse(response.body)).toBe('string');
  });
});

describe('Utils.send should', () => {

  let fetchStat;

  beforeEach((done) => {
    Utils.fetch((res) => {
      fetchStat = res.status;
      done();
    });
  });

  it('be defined', () => {
    expect(Utils.fetch).toBeDefined();
  });

  it('fetch should reveive data, with response 202', () => {
    expect(fetchStat).toBe(202);
  });
});

describe('Utils.update should', () => {
  let data = {
    userName: 'Francis',
    email: 'sally@me.com',
    projects: ['some.txt', 'that.txt']
  }

  let updateStat;

  beforeEach((done) => {
    Utils.update(JSON.stringify(data), (res) => {
      updateStat = res.status;
      done();
    });
  });

  it('be defined', () => {
    expect(Utils.update).toBeDefined();
  });

  it('fetch should reveive data, with response 202', () => {
    expect(updateStat).toBe(202);
  });
});

describe('Utils.remove should', () => {
  let data = {};

  let removeStat;

  beforeEach((done) => {
    Utils.remove(data, (res) => {
      removeStat = res.status;
      done();
    });
  });

  it('be defined', () => {
    expect(Utils.remove).toBeDefined();
  });

  it('fetch should reveive data, with response 202', () => {
    expect(removeStat).toBe(202);
  });
});









