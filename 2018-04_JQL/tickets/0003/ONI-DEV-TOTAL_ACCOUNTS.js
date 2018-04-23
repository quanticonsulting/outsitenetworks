function main() {
    return join(
	Events({
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
            return typeof tuple.user.properties["Consumer token: APID"] == "undefined";
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
		num_of_new_registered_accounts: kv.value
	    }
	})
	.sortDesc('num_of_new_registered_accounts')
}
