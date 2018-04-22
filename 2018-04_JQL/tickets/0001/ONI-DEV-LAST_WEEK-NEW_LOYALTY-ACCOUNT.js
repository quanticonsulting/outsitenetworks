ll
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
daysago1.setDate(daysago1.getDate()-1);
daysago7.setDate(daysago7.getDate()-7);
daysago8.setDate(daysago8.getDate()-8);
daysago14.setDate(daysago14.getDate()-14);
daysago15.setDate(daysago15.getDate()-15);
daysago30.setDate(daysago30.getDate()-30);
daysago31.setDate(daysago31.getDate()-31);
daysago37.setDate(daysago37.getDate()-37);
daysago38.setDate(daysago38.getDate()-38);

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
  'daysago38' : daysago38
}

function main() {
    return join(
    Events({
            from_date: formatDate(params.daysago8),
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
            return tuple.user.properties["Consumer created"] >= params.daysago31;
	})
	.groupByUser([function(u) { return u.event.properties["Place name"]}
		      , function(u) { return u.event.properties["Place market"]}
		      , function(u) { return u.event.properties["Place division"]}
		      , function(u) { return u.event.properties["Place region"]}], mixpanel.reducer.count())
    .groupBy([mixpanel.slice("key", 1)],mixpanel.reducer.sum('value'))
    .map(function(kv) {
      return {
          store : kv.key[0],
	  market : kv.key[1],
	  division : kv.key[2],
	  region : kv.key[3],
        num_of_loyalty_accounts: kv.value
      }
    })
    .sortDesc('num_of_loyalty_accounts')
}
