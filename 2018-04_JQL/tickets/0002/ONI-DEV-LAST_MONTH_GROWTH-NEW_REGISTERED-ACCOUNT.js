var today = new Date();
var daysago1 = new Date();
var daysago7 = new Date();
var daysago8 = new Date();
var daysago14 = new Date();
var daysago15 = new Date();
var daysago30 = new Date();
var daysago31 = new Date();
var daysago37 = new Date();
var daysago38 = new Date();
var daysago61 = new Date();
daysago1.setDate(daysago1.getDate()-1);
daysago7.setDate(daysago7.getDate()-7);
daysago8.setDate(daysago8.getDate()-8);
daysago14.setDate(daysago14.getDate()-14);
daysago15.setDate(daysago15.getDate()-15);
daysago30.setDate(daysago30.getDate()-30);
daysago31.setDate(daysago31.getDate()-31);
daysago37.setDate(daysago37.getDate()-37);
daysago38.setDate(daysago38.getDate()-38);
daysago61.setDate(daysago61.getDate()-61);

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

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
    event: 'Transaction Item',
    'today' : today,
    'daysago1' : daysago1,
    'daysago7' : daysago7,
    'daysago8' : daysago8,
    'daysago14' : daysago14,
    'daysago15' : daysago15,
    'daysago30' : daysago30,
    'daysago31' : daysago31,
    'daysago37' : daysago37,
    'daysago38' : daysago38,
    'daysago61' : daysago61
}

function main() {
    return join(
	Events({
            from_date: formatDate(params.daysago61),
            to_date:   formatDate(params.daysago1),
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
            var trans_date = new Date(tuple.event.properties["Transaction date time"]);
            return formatDate(trans_date) >= formatDate(params.daysago61) &&
		typeof tuple.user.properties["Consumer token: APID"] == "undefined";
	})
	.groupByUser([function(u) { return u.event.properties["Place name"]}
		      , function(u) { return u.event.properties["Place market"]}
		      , function(u) { return u.event.properties["Place division"]}
		      , function(u) { return u.event.properties["Place region"]}
		      , function(u) { return formatDate(u.event.properties["Transaction date time"])}]
		     , mixpanel.reducer.count())
	.groupBy(["key.1","key.2","key.3","key.4","key.5"],mixpanel.reducer.sum('value'))
	.map(function(kv) {
	    var start_metric = 0;
	    var end_metric = 0;
	    if (kv.key[4] > formatDate(params.daysago30)) {
		end_metric = kv.value;
	    } else {
		start_metric = kv.value;
	    }
	    return {
	  date : kv.key[4],
		store : kv.key[0],
		market : kv.key[1],
		division : kv.key[2],
		region : kv.key[3],
		num_of_new_registered_accounts_start: start_metric,
		num_of_new_registered_accounts_end: end_metric
	    }
	})
	.groupBy(["store","market","division","region"],[mixpanel.reducer.sum('num_of_new_registered_accounts_start'),mixpanel.reducer.sum('num_of_new_registered_accounts_end')])
	.map(function(keysvalues) {
	    var growth = 100;
	    if (keysvalues.value[0] > 0) {
		growth =  ((keysvalues.value[1] - keysvalues.value[0])/keysvalues.value[0])*100
	    } 
	    return {
		store : keysvalues.key[0],
		market : keysvalues.key[1],
		division : keysvalues.key[2],
		region : keysvalues.key[3],
		growth_rate_of_new_registered_accounts: roundToTwo(growth)
	    }
	})
}
