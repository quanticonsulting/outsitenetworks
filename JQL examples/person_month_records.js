var TYPE_OBJECT = 'object';
var DISTINCT_ID = 'distinct_id';
var PROPERTIES = 'properties';
var EVENT = 'event';
var USER = 'user';
var MONTHS_ENDED = 'Months ended';
var PROFILE_TYPE = '.Profile type';
var PROFILE_TYPE_PERSON = 'PERSON';

function main() {
  return join(
    Events({
      from_date: '2017-11-01',
      to_date:   '2017-12-31'
    }),
    People(),
    {
      type:"inner"
    })
  .filter(function(pair) {
    return pair.event.name == 'Person Month Record' &&
      pair.user.properties[PROFILE_TYPE] == PROFILE_TYPE_PERSON &&
      pair.user.properties['Rollover totals month'] !== undefined &&
      (pair.user.properties['Months ended'] > 1 ||
       pair.user.properties['Prior month categories'] === undefined);
  })
  .map(function(pair) { return pruneData(pair); });
}

function pruneData(obj) {
  var type = typeof obj;
  if (obj instanceof Date)
  {
    return obj.toISOString();
  }
  else if ((type == TYPE_OBJECT) && Array.isArray(obj))
  {
    var prunedArray = [];
    for (var key2 in obj)
    {
      prunedArray[key2] = pruneData(obj[key2]);
    }
    return prunedArray;
  }
  else if (type == TYPE_OBJECT)
  {
    var prunedObj = {};
    for (var key in obj)
    {
      if (isNeeded(key))
      {
        prunedObj[key] = pruneData(obj[key]);
      }
    }
    return prunedObj;
  }
  else
  {
    return obj;
  }
}

function isNeeded(name) {
  return (name == DISTINCT_ID) ||
        (name == PROPERTIES) ||
        (name == EVENT) ||
        (name == USER) ||
        isCategoryTotal(name) ||
        isSubCategoryTotal(name);
}

function isNumeric(str) {
  return /^\d+$/.test(str);
}

function isCategoryTotal(name) {
  return (name.length >= 5) &&
    isNumeric(name.substr(0, 2)) &&
    (name[2] == ' ');
}

function isSubCategoryTotal(name) {
  return (name.length >= 7) &&
    isNumeric(name.substr(0, 2)) &&
    isNumeric(name.substr(2, 2)) &&
    (name[4] == ' ');
}
