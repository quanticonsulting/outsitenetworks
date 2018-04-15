/* ==============================================================
 * Notes from meeting
 * Category Name - Sub category name - item Manufacturer - item Brand - name
 * For every customer for every product need to give estimate of wallet share of low medium and high
 * Concatenate : low_manufacturer – low_Generic Brands

 *
 * Get distribution for product category in last 30 days
 */
 
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
  end_date: formatDate(today)
  event: 'Transaction Item'
}

function main() {
  return Events({
    //select the transaction item event between today and the last 30 days
    from_date: params.start_date,
    to_date:   params.end_date,
    event_selectors: [{
                event: params.event
    }]
  })
    .groupBy(
        //group by event properties
        [
          'properties.Category name'
          ,'properties.Sub-category name'
          ,'properties.Item brand'
          ,'properties.Item manufacturer'
          ,'properties.Item name'
        ]
        ,mixpanel.reducer.count()
    )
    .map(function(obj) {
      //map keys to names
  		return {
  		'Category name': obj.key[0]
  		,'Sub-category name': obj.key[1]
  		,'Item brand': obj.key[2]
  		,'Item manufacturer': obj.key[3]
  		,'Item name': obj.key[4]
  		, 'count' : obj.value
  		};
    });
}