!(function($){
	// all notes here
	var notesList = [];

	// store filter value to be faster
	var filterValue = "";

	// create note function
	var createNote = function(title, value){
		var note = new Note(title, value);
		note.onEdit(function(){ modal(note); });
		note.onDelete(function(){
			notesList.splice(notesList.indexOf(note), 1);
			save(); // save changes
		});
		var newEl = note.render();
		$('.note-list').prepend(newEl);
		// check the filter
		if (!~title.indexOf(filterValue)) {
			newEl.hide();
		}
		notesList.unshift(note);    // add into the list
	};

	// create new
	$('#createNote').submit(function(e){
		e.preventDefault();

		createNote(this.title.value, this.message.value);

		// clear form
		this.reset();

		save(); // save changes
		return false;
	});


	//filter function
	var filterSaveTimer;
	$('#nameFilter').keyup(function(e){
		filterValue = this.value;
		if (filterValue.length === 0) { // show all when filter is empty
			$('.note-list').children().filter(":hidden").show();
		} else {
			notesList.forEach(function(note, key){
				if (~note.title.indexOf(filterValue)) {
					note.show();
				} else {
					note.hide();
				}
			});
		}

		clearTimeout(filterSaveTimer);
		filterSaveTimer = setTimeout(save, 300); // save changes
	});

	// bootstrap modal dialog without bootstrap
	var modal = function(model){
		var dialog = $('.modal');
		dialog.show('fast');

		var close = function(){
			dialog.hide('fast');
			dialog.unbind('click');
			dialog.find('[data-dismiss="modal"]').unbind('click');
			dialog.find(".save").unbind('click');
		};
		dialog.bind('click', function(e){
			if (e.target===this) {
				close();
			}
		});
		dialog.find('[data-dismiss="modal"]').bind('click', close);

		// put exist data
		dialog.find('#editNoteTitle').val( model.title );      // i should not use selector.find(id),
		dialog.find('#editNoteMessage').val( model.message );  // but i don't like the id so it will be changed to class

		var onSaveCb = function(){
			model.update( dialog.find('#editNoteTitle').val(), dialog.find('#editNoteMessage').val() );
			// check the filter
			if (!~model.title.indexOf(filterValue)) {
				model.hide();
			}
			close();

			save(); // save changes
		};
		dialog.find(".save").bind('click', onSaveCb);
	};


	/**
	 * Rewrite this if you don't want to use localStorage. Or add more function to support what you want
	 * @type {{load: load, save: save, remove: remove}}
	 */
	var storage = {
		load: function(){
			return localStorage.getItem('test-notes');
		},
		save: function(data){
			localStorage.setItem('test-notes', data);
		},
		remove: function(){
			localStorage.removeItem('test-notes');
		}
	};

	var savedTime;
	var restore = function(){
		var saved = storage.load(),
			data;
		if (!saved) return; // nothing to do
		try{
			data = JSON.parse(saved);
		}catch(e){
			// can't restore data. Remove it :)
			storage.remove();
		}
		if (savedTime === data.timeStamp) return;   // it's my save, do nothing
		// clear all notes
		$('.note-list').empty();
		notesList.length = 0;  // should call each destructors, possible place for memory leak
		// apply filter
		$('#nameFilter').val(filterValue = data.filter);
		// and put saved
		data.notes.forEach(function(n){
			createNote.apply(this, n);  // createNote(n[0], n[1]);
		});
	};

	var save = function(){
		var dataToSave = {
			timeStamp   : new Date().getTime(),
			notes       : [],
			filter      : filterValue
		};
		notesList.forEach(function(n){
			dataToSave.notes.unshift([n.title, n.message]);
		});
		savedTime = dataToSave.timeStamp;
		storage.save(JSON.stringify(dataToSave));
	};

	// first time initialization
	restore();
	// restore when we come back
	$(window).focus(restore);

}(jQuery));