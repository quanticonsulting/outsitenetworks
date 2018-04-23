function main() {
    return People()
        .filter(function(tuple) {
            return typeof tuple.properties["Consumer token: APID"] != "undefined";
	})
	.groupByUser([function(u) { return u.properties["Consumer ID"]}], mixpanel.reducer.count())
	.groupBy([mixpanel.slice("key", 1)],mixpanel.reducer.sum('value'))
	.groupBy(["key.1"],mixpanel.reducer.sum('value'))
	.map(function(keysvalues) {
	    return {
		value: keysvalues.value
	    }
	})
}
