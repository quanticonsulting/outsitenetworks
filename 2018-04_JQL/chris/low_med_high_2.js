/* ==============================================================
 * Notes from meeting
 * Category Name - Sub category name - item Manufacturer - item Brand - name
 * For every customer for every product need to give estimate of wallet share of low medium and high
 * Concatenate : low_manufacturer – low_Generic Brands

 *
 * Get distribution for product category in last 30 days
 */
var length_of_list = 0;
var today = new Date();
var last30days = new Date();
last30days.setDate(last30days.getDate()-30);

function formatDate(date) {
	 
	 // This function takes a date and returns a string in YYYY-MM-DD format
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

params = {
  start_date: formatDate(last30days),
  end_date: formatDate(today),
  event: 'Transaction Item',
  event_selector : '"Other Tobacco Products" in properties["Category name"]'
}

function main() {
  return Events({
    //select the transaction item event between today and the last 30 days
    from_date: params.start_date,
    to_date:   params.end_date,
    event_selectors: [{
                event: params.event
                , selector: params.event_selector
    }]
  })
  //sum number of times a user has done an property in an event -- a very small pct were negative so I am using abs
  .groupByUser(mixpanel.reducer.sum(function(u) { return Math.abs(u.properties["Item quantity"]); }))
  .sortDesc('value')
  //
  .groupBy([mixpanel.slice("key", 0)],[mixpanel.reducer.sum('value'), function(t){
  return length_of_list = length_of_list + 1
  }])
    .map(function(item) {
    var len = item.value[0].max;
    return {
      "customer_id": item.key[0],
      "qty_purchased": item.value[0],
      "length_of_list" :len
    }
  })