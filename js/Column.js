function Column(id, name) {
	var self = this;
	
	this.id = id;
	this.name = name || 'No given name';
	this.element = createColumn();

	function createColumn() {
        //make column's elements
		var column = $('<div class="column"></div>').attr('id', self.id);
		var columnTitle = $('<h2 class="column-title"><span>' + self.name + '</span></h2>');
		var columnCardList = $('<ul class="card-list"></ul>');
		var columnDelete = $('<button>').addClass('column-delete btn btn-danger')
                            .append('<i>').addClass('fa fa-times');
		var columnAddCard = $('<button>').addClass('add-card btn btn-success').text('New card');
		
		// add event listeners
		columnDelete.click(function() {
			self.deleteColumn();
		});
		
		columnAddCard.click(function(event) {
            var cardName = prompt('Enter the name of card');
            event.preventDefault();
            $.ajax({
                url: baseUrl + '/card',
                method: 'POST',
                data: {
                    name: cardName,
                    bootcamp_kanban_column_id: self.id
                },
                success: function(response) {
                    var card = new Card(response.id, cardName);
                    self.createCard(card);
                }
            });
        });

        //********** change column's name
        columnTitle.on('click', function(event) {
            self.changeColumnName(event);
        });

		// creating colun's element
		column.append(columnTitle)
			.append(columnDelete)
			.append(columnAddCard)
			.append(columnCardList);
			return column;
    }
}
    
Column.prototype = {
	createCard: function(card) {
	    this.element.children('ul').append(card.element);
    },
    
	deleteColumn: function() {
        var self = this;

        if ($('#' + self.id + ' .card-list').children().length == 0 ) {
            

            $.ajax({
                url: baseUrl + '/column/' + self.id,
                method: 'DELETE',
                success: function(response) {
                    self.element.remove();
                }
            }); 
        } else {
            confirm('CAN\'T DELETE! Column is not empty!');
        }

    },

    changeColumnName: function(event) {
        var self = this,
            span,
            $input,
            columnName;

        span = event.target;

        if (span && span.tagName.toUpperCase() === "SPAN") {

            //get height of element
            var height = $('#' + self.id + ' .column-title').height();
            //hide name's span
            span.style.display = "none";
            
            //get current name
            columnName = span.innerHTML;

            //make input field
            $input = $('<input>').val(columnName).attr('placeholder', 'Enter new name').addClass('column-title');

            //make element fit to content
            $input.css({
                width: $('#' + self.id).width() - 2,
                marginLeft: 1,
                height: height - 2 
            });

            //insert input field to DOM
            $(span).before($input);

            //set focus and select all text in field
            $input.focus();
            $input.select();

            //API change name when field is blur or pressed ENTER key
            $input.on('blur keypress', function(event) {
                var keycode = event.keycode || event.which;
                
                
                if(event.type == 'blur' ||  keycode == '13' || keycode == '10') {
                    event.preventDefault();
                    
                    //new description is not empty and not the same than old
                    if ($input.val() !== '' && $input.val() !== columnName) {
                        var nameToChange = $input.val();

                        $.ajax({
                            url: baseUrl + '/column/' + self.id,
                            method: 'PUT',
                            data: {
                                id: self.id,
                                name: nameToChange
                            },
                            success: function(response) {
                                $(span).text(nameToChange);
                                $input.remove();
                                span.style.display = "";
                            }
                        });
                    // no changes in name        
                    } else {
                        $input.remove();
                        span.style.display = "";
                    }
                }
            }); // END API chane name
        } 
    }
};
