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
function main() {
    return join(
      Events({
        //select the transaction item event between today and the last 30 days
        from_date: formatDate(last30days),
        to_date:   formatDate(today),
        event_selectors: [{
                    event: 'Transaction Item'
        }]
      }),
        People(), {
            type: "inner",
            selectors: [{
                selector: '(user[".Profile type"] == "PERSON") '       }]
        })
        .groupByUser((_state, tuples) => {
      return {
        "Email": tuples[0].user.properties.$email,
        "Name": tuples[0].user.properties.$name,
        "Allow Email": tuples[0].user.properties["Allow Email"],
        "Registration Country": tuples[0].user.properties["Registration Country"],
        "Transaction Count": _.reduce(tuples, (memo, x) => (x.event.name === "Transaction Item") ? memo+1 : memo, 0)
      };
    });
}