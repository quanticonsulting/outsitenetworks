//https://mixpanel.com/report/1121678/jql-console/#new
//example of event object return
function main() {
  return Events({
    //select the transaction item event between today and the last 30 days
    from_date: '2018-03-20',
    to_date:   '2018-03-25',
    event_selectors: [{
                event: 'Transaction Item', selector: '"Wine" in properties["Category name"]'
    }]
  })
}