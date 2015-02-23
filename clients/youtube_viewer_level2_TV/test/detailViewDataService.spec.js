describe('Service: detailInformationService', function () {

	beforeEach(module('tvUiApp'));
	beforeEach(module('tvDetailView'));

	it('should exist', inject(function (informationService) {
		expect(informationService).toBeDefined();
	}));
	it('should have data variable which is undefined', inject(function (informationService) {
		expect(informationService.data).toBeUndefined();
	}));

});

