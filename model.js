!(function($, window){
	/**
	* jQuery object
	* @external jQuery
	* @see {@link http://api.jquery.com/jQuery/}
	*/

	var template = '<div class="col-md-4 notes">'+
						'<div class="panel panel-default">' +
							'<div class="panel-heading">' +
								'<h3 class="panel-title title"></h3>' +
								'<div class="action-buttons">'+
									'<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
									'<span class="glyphicon glyphicon-pencil edit" aria-hidden="true"></span>'+
								'</div>'+
							'</div>' +
							'<div class="panel-body message"></div>' +
						'</div>'+
					'</div>';

	/**
	 * One note
	 * @param {String} title
	 * @param {String} message
	 * @constructor
	 */
	var Note = function(title, message){
		this.title = title;
		this.message = message;

		this._onEditCb = [];
		this._onDeleteCb = [];
	};
	/**
	 * Render note and bind action listeners
	 * @return {jQuery}
	 */
	Note.prototype.render = function(){
		this.jqObject = $(template);
		this.refresh();
		this.bind();
		return this.jqObject;
	};
	/**
	 * bind function. Should be private
	 */
	Note.prototype.bind = function(){
		var self = this;
		this.jqObject.find('.close').click(function(e){
			self._onDeleteCb.forEach(function(cb){
				cb();
			});
			// $(this).unbind('click', e);
			self.jqObject.remove();
			self._onEditCb = null;
			self._onDeleteCb = null;
		});
		this.jqObject.find('.edit').click(function(){
			self._onEditCb.forEach(function(cb){
				cb();
			});
		});
	};
	/**
	 * refresh note's data
	 */
	Note.prototype.refresh = function(){
		this.jqObject.find('.title').text(this.title).attr("title", this.title);
		this.jqObject.find('.message').text(this.message);
	};
	/**
	 * Set new values and update DOM
	 * @param {String} title
	 * @param {String} message
	 */
	Note.prototype.update = function(title, message){
		this.title = title;
		this.message = message;
		this.refresh();
	};
	/**
	 * Set callback which called when note will be edited
	 * @param {Function} cb
	 */
	Note.prototype.onEdit = function(cb){
		this._onEditCb.push(cb);
	};
	/**
	 * Set callback which called when note will be removed
	 * @param {Function} cb
	 */
	Note.prototype.onDelete = function(cb){
		this._onDeleteCb.push(cb);
	};
	/**
	 * show note
	 */
	Note.prototype.show = function(){
		this.jqObject.show();
	};
	/**
	 * hide note
	 */
	Note.prototype.hide = function(){
		this.jqObject.hide();
	};

	// exports
	window.Note = Note;

}(jQuery, window));