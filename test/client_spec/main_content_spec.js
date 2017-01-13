// <!-- Created by Duncan on 12.28.2016 -->
import Vue from 'vue';
import MainContent from '../../client/vue-components/main_content.vue';

describe('MainContent', () => {

  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof MainContent.created).toBe('function');
  });

  // Inspect the component instance on mount
  it('correctly sets the message when created', () => {
    const vm = new Vue(MainContent).$mount;
    expect(vm.input).toBe('');
  });

  // Mount an instance and inspect the render output
  it('should update input and increase count', () => {
    const Ctor = Vue.extend(MainContent);
    const vm = new Ctor().$mount();
    vm.update({target:{value: 'Testing to see if data is added!'}});
    vm.wordCounter();
    expect(vm.$data.input).toBe('Testing to see if data is added!');
    expect(vm.$data.count).toBe(7);
  })
});

