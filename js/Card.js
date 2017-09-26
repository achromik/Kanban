function Card(id, name) {
	var self = this;
	
	this.id = id;
	this.name = name || 'No given name';
	this.element = createCard();

	function createCard() {
		var card = $('<li class="card"></li>').attr('id', self.id);
		var cardDeleteBtn = $('<button>').addClass('card-delete btn btn-danger')
                            .append('<i>').addClass('fa fa-times');
		var cardDescription = $('<p class="card-description"></p>');
		
		cardDeleteBtn.on('click', function(){
			self.removeCard();
		});
        
        //********** change card's description
        cardDescription.on('click', function(event) {
            self.changeName(event);
        });
            

		card.append(cardDeleteBtn);
		cardDescription.text(self.name);
		card.append(cardDescription);
		return card;
	}
}

Card.prototype = {
	removeCard: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function (response) {
                self.element.remove();
            }
        });
    },

    changeName: function(event) {
        var self = this,
            element,
            $input,
            cardDescription,
            columnID = $('#' + self.id).parents('.column').attr('id');

        element = event.target;

        if (element && element.tagName.toUpperCase() === "P") {

            //hide descriptions's element
            element.style.display = "none";
            
            //get current description
            cardDescription = element.innerHTML;

            //make input field
            $input = $('<input>').val(cardDescription).attr('placeholder', 'Enter new name');
            $input.width($('#'+self.id).width());
            
            //insert input field to DOM
            $(element).before($input);

            //set focus and select all text in field
            $input.focus();
            $input.select();

            //API change description when field is blur or pressed ENTER key
            $input.on('blur keypress', function(event) {
                var keycode = event.keycode || event.which;
                
                if(event.type == 'blur' ||  keycode == '13' || keycode == '10') {
                    event.preventDefault();
                    
                    //new description is not empty and not the same than old
                    if ($input.val() !== '' && $input.val() !== cardDescription) {
                        var descriptionToChange = $input.val();

                        $.ajax({
                            url: baseUrl + '/card/' + self.id,
                            method: 'PUT',
                            data: {
                                id: self.id,
                                name: descriptionToChange,
                                bootcamp_kanban_column_id: columnID
                            },
                            success: function(response) {
                                $(element).text(descriptionToChange);
                                $input.remove();
                                element.style.display = "";
                            }
                        });
                    //no changes in description  
                    } else {
                        $input.remove();
                        element.style.display = "";
                    }
                }
            }); // END API chane description
        } 
    } //END change card's description
};