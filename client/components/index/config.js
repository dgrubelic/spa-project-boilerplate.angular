module.exports = function ($stateProvider) {
  'ngInject';
  $stateProvider.state('index', {
    url: '/',
    template: '<index-component></index-component>'
  })
};