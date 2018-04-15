/**
 * Hello MP Teamie! To see an appliation report for this query - please see:
 * https://mixpanel.com/report/3/mpplatform/51615
 * - Happy Querying :) - CRP
**/
function main() {
  return People()
  .map(function(user) { return {"distinct_id" : user.distinct_id, 
    "number of properties": _.keys(user.properties).length}
    })
  .groupBy([ "number of properties"],mixpanel.reducer.count())
  // .filter(function(x){return x["number of properties"] > 200})
}