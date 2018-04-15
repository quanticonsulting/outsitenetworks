var params = {
  key_field_name: 'name',
  key_field_value: 'Test Game 03',
  profile_type: 'GAME',
  fields: [ '*' ]
};

var MIN_PARTIAL_LENGTH = 5;
var DISTINCT_ID = '$distinct_id';
var CLEAN_DISTINCT_ID = cleanup(DISTINCT_ID);
var PROFILE_TYPE = '.Profile type';
var cleanKey = cleanup(params.key_field_name);
var cleanValue = cleanup(params.key_field_value);
var cleanProfileType = cleanup(params.profile_type);
var allFields = false;
var cleanFields = [];
for (var i = 0; i < params.fields.length; i++) {
    cleanFields[i] = cleanup(params.fields[i]);
    allFields |= (cleanFields[i] == '*');
}

function main() {
  return People()
  .map(function(user) {
    var match = false;
    var properties = {};
    properties[CLEAN_DISTINCT_ID] = user.distinct_id;
    if (user.properties[PROFILE_TYPE] == cleanProfileType)
    {
        if (CLEAN_DISTINCT_ID === cleanKey)
        {
          if (cleanup(user.distinct_id) == cleanValue)
          {
            match = true;
          }
        }
        _.each(user.properties, function(v,k) {
            var cleanK = cleanup(k);
            var cleanV = cleanup(String(v));
            if (isNeeded(cleanK))
            {
            properties[cleanK] = v;
            }
            if (((cleanK === cleanKey) ||
            ((cleanKey.length >= MIN_PARTIAL_LENGTH) && (cleanK.substring(0, cleanKey.length) === cleanKey))) &&
            (cleanV == cleanValue))
            {
            match = true;
            }
        });
    }
    properties.match = match;
    return properties;
  })
  .filter(function(user) {
    return user.match;
  })
  .map(function(user) { return pruneData(user); });
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
  return allFields || contains(cleanFields, cleanup(name));
}

function contains(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) return true;
        if ((arr[i].length >= MIN_PARTIAL_LENGTH) && (val.substring(0, arr[i].length) === arr[i])) return true;
    }
    return false;
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