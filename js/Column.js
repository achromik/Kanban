function Column(id, name) {
	var self = this;
	
	this.id = id;
	this.name = name || 'No given name';
	this.element = createColumn();

	function createColumn() {
		// TWORZENIE NOWYCH WĘZŁÓW
		var column = $('<div class="column"></div>').attr('id', self.id);
		var columnTitle = $('<h2 class="column-title"><span>' + self.name + '</span></h2>');
		var columnCardList = $('<ul class="card-list"></ul>');
		var columnDelete = $('<button class="btn-delete">x</button>');
		var columnAddCard = $('<button class="column-add-card">Dodaj kartę</button>');
		
		// PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
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
        


        //********** change name column
        columnTitle.on('click', function(event) {
            var span,
                $input,
                columnName;

            span = event.target;

            if (span && span.tagName.toUpperCase() === "SPAN") {

                //hide name's span
                span.style.display = "none";
                
                //get current name
                columnName = span.innerHTML;

                //make input field
                $input = $('<input>').val(columnName).attr('placeholder', 'Enter new name');
                $input.width($('#'+self.id).width());
                
                //insert input field to DOM
                $(span).before($input);

                $input.focus();
                $input.select();

                $input.on('blur keypress', function(event) {
                    var keycode = event.keycode || event.which;
                    
                    if(event.type == 'blur' ||  keycode == '13' || keycode == '10') {
                        event.preventDefault();
                         
                        
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

                        } else {
                            $input.remove();
                            span.style.display = "";
                        }
                    }
                });
            } 
                

            // var nameToChange =  prompt("Enter new name").toString();  //without .toString() dosent change name (empty string)
            // // var nameToChange = "z kliku";
            // //console.log(typeof nameToChange);
           


            // // event.preventDefault();
            // $.ajax({
            //     url: baseUrl + '/column/' + self.id,
            //     method: 'PUT',
            //     data: {
            //         id: self.id,
            //         name: nameToChange
            //     },
            //     success: function(response) {
            //         $('#' + response.id + ' .column-title').text(nameToChange);
            //     }
            // });
        });
			
			// KONSTRUOWANIE ELEMENTU KOLUMNY
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

        $.ajax({
            url: baseUrl + '/column/' + self.id,
            method: 'DELETE',
            success: function(response) {
                self.element.remove();
            }
        });
    },
    

};
