params = {
  start_date: "2017-11-01",
  end_date: "2017-11-30"
};

function main() {
  return Events({
    from_date: params.start_date,
    to_date: params.end_date
  })
  .filter(function(event) {
    return event.name == 'Transaction Item' &&
    event.properties['Item ID - Loyalty'] !== undefined;
    })
  .groupBy([
      'properties.Item ID - Loyalty',
      'properties.Category code',
      'properties.Category name',
      'properties.Classification',
      'properties.Item CPG',
      'properties.Item POS line item name',
      'properties.Item UPC code',
      'properties.Item brand',
      'properties.Item is excluded',
      'properties.Item is fuel',
      'properties.Item is unknown',
      'properties.Item manufacturer',
      'properties.Item name',
      'properties.Loyalty Customer ID',
      'properties.Loyalty Customer Name',
      'properties.Sub-category code',
      'properties.Sub-category name'
    ],
    mixpanel.reducer.count()
    )
  .map(function(obj) {
    return {
    'Item ID - Loyalty': obj.key[0],
    'Category code': obj.key[1],
    'Category name': obj.key[2],
    'Classification': obj.key[3],
    'Item CPG': obj.key[4],
    'Item POS line item name': obj.key[5],
    'Item UPC code': obj.key[6],
    'Item brand': obj.key[7],
    'Item is excluded': obj.key[8],
    'Item is fuel': obj.key[9],
    'Item is unknown': obj.key[10],
    'Item manufacturer': obj.key[11],
    'Item name': obj.key[12],
    'Loyalty Customer ID': obj.key[13],
    'Loyalty Customer Name': obj.key[14],
    'Sub-category code': obj.key[15],
    'Sub-category name': obj.key[16]
    };
  })
  ;
}