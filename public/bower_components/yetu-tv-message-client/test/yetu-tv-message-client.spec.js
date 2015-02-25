describe('message-client', function () {

	beforeEach(function(){
		//enable action handler
		yetu.onAnyActionDetected();
	});

	it('should exist', function () {
		expect(yetu).toBeDefined();
	});
	it('should have all method', function () {
		expect(yetu.onAnyActionDetected).toBeDefined();
		expect(yetu.onActionBack).toBeDefined();
		expect(yetu.onActionUp).toBeDefined();
		expect(yetu.onActionDown).toBeDefined();
		expect(yetu.onActionLeft).toBeDefined();
		expect(yetu.onActionRight).toBeDefined();
		expect(yetu.onActionForward).toBeDefined();
		expect(yetu.onActionPlay).toBeDefined();
		expect(yetu.onActionEnter).toBeDefined();
		expect(yetu.onActionMenu).toBeDefined();
		expect(yetu.onActionRewind).toBeDefined();
		expect(yetu.onReceiveMessage).toBeDefined();
		expect(yetu.sendFeedItemIndex).toBeDefined();
		expect(yetu.sendMessage).toBeDefined();
		expect(yetu.sendQuit).toBeDefined();
	});

	it('should send Message', function () {
		expect(local.sendData).toBeDefined();
		spyOn(local,'sendData');
		yetu.sendMessage('Test');
		expect(local.sendData).toHaveBeenCalledWith(constants.messageTopic,'Test');
	});

	it('should send Quit', function () {
		expect(local.sendData).toBeDefined();
		spyOn(local,'sendData');
		yetu.sendQuit('Test');
		expect(local.sendData).toHaveBeenCalledWith(constants.quitTopic,'Test');
	});

	it('should send Index', function () {
		expect(local.sendData).toBeDefined();
		spyOn(local,'sendData');
		yetu.sendFeedItemIndex(1);
		expect(local.sendData).toHaveBeenCalledWith(constants.indexTopic,{index:1});
	});

	it('should broadcast message', function () {
		expect(flyer.wrapper.broadcast).toBeDefined();
		spyOn(flyer.wrapper,'broadcast');
		local.sendData(constants.messageTopic, 'Test');
		expect(flyer.wrapper.broadcast).toHaveBeenCalled();
	});
});
