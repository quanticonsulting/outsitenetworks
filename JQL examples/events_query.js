var params = {
  //distinct_id: 'cd1aa508-df26-4b6a-875f-80ff332b9b4b',
  key_field_name: 'distinctid',
  key_field_value: 'cd1aa508-df26-4b6a-875f-80ff332b9b4b',
  event_name: 'consumer transaction',
  start_date: '2017-12-01',
  end_date: '2017-12-13'
};

var MIN_PARTIAL_LENGTH = 5;
var DISTINCT_ID = '$distinct_id';
var CLEAN_DISTINCT_ID = cleanup(DISTINCT_ID);
var cleanEventName = cleanup(params.event_name);
var cleanDistinctId = params.distinct_id === undefined ? null : cleanup(params.distinct_id);
var cleanKeyFieldName = params.key_field_name === undefined ? null : cleanup(params.key_field_name);
var cleanKeyFieldValue = params.key_field_value === undefined ? null : cleanup(params.key_field_value);

if (cleanKeyFieldName === CLEAN_DISTINCT_ID && cleanKeyFieldValue !== null)
{
  cleanDistinctId = cleanKeyFieldValue;
}

function main() {
  return Events({
    from_date: params.start_date,
    to_date: params.end_date
  })
  .filter(function(event) {
    if (cleanup(event.name) != cleanEventName)
    {
      return false;
    }
    else if (cleanDistinctId !== null)
    {
      return cleanup(event.distinct_id) == cleanDistinctId;
    }
    else
    {
       _.each(event.properties, function(v,k)
       {
        var cleanK = cleanup(k);
        var cleanV = cleanup(String(v));
        if (((cleanK === cleanKeyFieldName) ||
          ((cleanKeyFieldName.length >= MIN_PARTIAL_LENGTH) &&
            (cleanK.substring(0, cleanKeyFieldName.length) === cleanKeyFieldName))) &&
          (cleanV == cleanFieldValue))
          {
            return true;
          }
      });
      return false;
    }
  })
  .map(function(event) { return pruneData(event); });
}

function pruneData(obj) {
  var type = typeof obj;
  if (obj instanceof Date)
  {
    return obj.toISOString();
  }
  else if (type == 'object')
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
  return true;
}

function cleanup(fld) {
  if (typeof(fld) === 'string')
  {
    return fld.toUpperCase()
    .split('$').join('')
    .split('_').join('')
    .split(':').join('')
    .split(' ').join('');
  }
  else
  {
    return fld;
  }
}
