var today = new Date();

function formatDate(date) {
    
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

params = {
  from_date: "2018-01-01",
    to_date: formatDate(today),
  event: "Transaction Item"
}

function main() {
    return join(
	Events({
	    from_date: params.from_date,
	    to_date: params.to_date,
            event_selectors: [{
                event: params.event
	    }]
	}),
        People(), {
            type: "inner",
            selectors: [{
                selector: '(user[".Profile type"] == "Person")'
            }]
        })
        .filter(function(tuple) {
            return typeof tuple.user.properties["Consumer token: APID"] != "undefined";
	})
	.groupByUser([function(u) { return u.event.properties["Consumer ID"]}], mixpanel.reducer.count())
	.groupBy([mixpanel.slice("key", 1)],mixpanel.reducer.sum('value'))
	.groupBy(["key.1"],mixpanel.reducer.sum('value'))
	.map(function(keysvalues) {
	    return {
		value: keysvalues.value
	    }
	})
}
