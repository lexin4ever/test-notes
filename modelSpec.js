describe("Note model", function() {

	var title = "test1",
		message = "test2",
		html, note;

	beforeEach(function(){
		note = new Note(title, message);
		html = note.render();
	});

	it("Should put title and message into HTML", function() {
		expect(html.find('.title').text()).toBe(title);
		expect(html.find('.message').text()).toBe(message);
	});
	it("Should escape HTML in title and message", function() {
		var title = "<b>test1</b>",
			message = "<b>test2</b>",
			note = new Note(title, message),
			html = note.render();

		expect(html.find('.title').html()).toBe( "&lt;b&gt;test1&lt;/b&gt;" );
		expect(html.find('.message').html()).toBe( "&lt;b&gt;test2&lt;/b&gt;" );
	});
	it("Should refresh data", function() {
		note.update(message, title);

		expect(html.find('.title').text()).toBe(message);
		expect(html.find('.message').text()).toBe(title);
	});
	it("Should call edit function", function() {
		var callback = jasmine.createSpy('callback');

		note.onEdit(callback);

		html.find('.edit').click();

		expect(callback).toHaveBeenCalled();
	});
	it("Should call delete function", function() {
		var callback = jasmine.createSpy('callback');

		note.onDelete(callback);

		expect(callback).not.toHaveBeenCalled();
		html.find('.close').click();
		expect(callback).toHaveBeenCalled();
	});
});