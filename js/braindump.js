
function group(entries)
{
    var entriesByDay = new Array();

    entries.forEach(function(entry)
    {
      var date = new Date(entry["created"]);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if(!(date in entriesByDay))
        entriesByDay[date] = new Array();

      entriesByDay[date].push(entry);
    });

    return entriesByDay;
}

function processEntry(entry)
{
  var content = entry["description"];
  var checkable = entry["checkable"];
  var checked = entry["checked"];
  var link = entry["link"];

  var template = '<div class="row">' + 
      '<div class="col-1"><button type="button" class="close"><span>&times;</span></button></div>' +
      '<div class="col-11">' +
        '<label class="custom-control custom-checkbox">' + 
          '<input type="checkbox" class="custom-control-input" {checkable} {checked}>' +
          '<span class="custom-control-indicator"></span>' +
          '<span class="custom-control-description">' +
            '{link}{description}{/link}' +
      '</span></label></div>' +      
    '</div>';

  var element = template;

  element = element.replace("{checkable}", checkable ? '' : 'disabled');
  element = element.replace("{checked}", checked ? '' : 'checked');

  if(link)
  {
     element = element.replace("{link}", '<a href="' + link + '"">');
     element = element.replace("{/link}", '</a>');
  }
  else
  {
     element = element.replace("{link}", '');
     element = element.replace("{/link}", '');
  }

  element = element.replace("{description}", content);

  $("section#entries").append(element);
}

function processGroup(key, group)
{
  var date = new Date(key);
  var content = date.toLocaleDateString();
  var element = '<div class="row mt-3">' + 
     '<div class="col-1"></div><div class="col-11"><h4>' + content + '</h4></div></div>';

  $("section#entries").append(element);
  group.forEach(processEntry);
}

$(document).ready(function() 
{ 
  jQuery.getJSON("braindump.json", function(json) 
  {
    var entries = json["entries"];
    
    entries.sort(function (a, b) 
    {
      var date_a = new Date(a["created"]);
      var date_b = new Date(b["created"]);
      return date_a < date_b;
    });

    var groupedEntries = group(entries);
    for(var date in groupedEntries) 
      processGroup(date, groupedEntries[date]);
  });
});
