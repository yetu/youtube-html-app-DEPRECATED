describe('Service: detailViewDirective', function () {

	beforeEach(module('tvState'));
	beforeEach(module('tvDetailView'));
	beforeEach(module('uiApp.templates'));
	beforeEach(module('tvUiApp'));

	var $scope, element;
	beforeEach(inject(function ($rootScope, $compile, $httpBackend, CONFIG) {
		$httpBackend.whenGET(CONFIG.notification.url).respond({});
		$httpBackend.whenPOST(CONFIG.authentication.authenticateUrl).respond({});
		$scope = $rootScope.$new();
		element = angular.element('<detail-view></detail-view>');
		$compile(element)($scope);
		$scope.$digest();
	}));

	it('should have an attribute called info', function () {
		expect($scope.info).toBeDefined();
	});
	it('should have an attribute called currentIndex', function () {
		expect($scope.currentIndex).toBeDefined();
	});
	it('should have defined values for attributes', function () {
		expect($scope.currentIndex).toBe(0);
		expect($scope.info.duration).toBe(0);
		expect($scope.info.actTime).toBe(0);
		expect($scope.info.percentage).toBe(0);
		expect($scope.info.isPlaying).toBe(true);
	});


});

