/* ==============================================================
 * Segmentation
 *
 * How many events did we see from different country/referrer
 * groups?
 */
function main() {
  return Events({
    from_date: "2018-02-22",
    to_date: "2018-03-24"
  })
  .groupBy(
    ["properties.mp_country_code", "properties.$referring_domain"],
    mixpanel.reducer.count()
  );
}