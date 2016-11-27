import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import './main.html';
import todosList from '../imports/components/todosList/todosList';


angular.module('simple-todos', [
  angularMeteor,
todosList.name
]);

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
