describe('Service: detailInformationService', function () {

	beforeEach(module('tvUiApp'));
	beforeEach(module('tvDetailView'));

	it('should exist', inject(function (detailInformationService) {
		expect(detailInformationService).toBeDefined();
	}));
	it('should have data variable which is undefined', inject(function (detailInformationService) {
		expect(detailInformationService.data).toBeUndefined();
	}));

});

