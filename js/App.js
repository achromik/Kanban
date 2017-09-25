var CORS = 'https://cors-anywhere.herokuapp.com/',
    baseUrl = CORS + 'https://kodilla.com/pl/bootcamp-api',
    myHeaders = {
        'X-Client-Id': '2316',
        'X-Auth-Token': '319c582ba240195927d0acd39400fa84'    
    };

$.ajaxSetup({
    headers : myHeaders
});

$.ajax({
    url: baseUrl + '/board',
    method: 'GET',
    success: function(response) {
        setupColumns(response.columns);
        
    }
});


function setupColumns(columns) {
    columns.forEach(function (column) {
        var col = new Column(column.id, column.name);
        board.createColumn(col);
        setupCards(col,column.cards);
    });
}

function setupCards(col, cards) {
    cards.forEach(function(card) {
        var cd = new Card(card.id, card.name, card.bootcamp_kanban_colum_id);
        col.createCard(cd);
    });
}

// function randomString() {
// 	var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ'.split();
// 	var str = '', i;
// 	for (i = 0; i < 10; i++) {
// 	  str += chars[Math.floor(Math.random() * chars.length)];
// 	}
// 	return str;
// }





