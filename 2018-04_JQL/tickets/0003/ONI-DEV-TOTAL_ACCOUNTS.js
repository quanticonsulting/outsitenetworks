function main() {
    return People()
	.groupByUser([function(u) { return u.event.properties["Consumer ID"]}], mixpanel.reducer.count())
	.groupBy([mixpanel.slice("key", 1)],mixpanel.reducer.sum('value'))
	.groupBy(["key.1"],mixpanel.reducer.sum('value'))
	.map(function(keysvalues) {
	    return {
		value: keysvalues.value
	    }
	})
}
