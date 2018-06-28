
module.exports.netsuite_date_formatter = function(date_to_be_converted) {

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
if(date_to_be_converted == '' || date_to_be_converted == null)
{
  var date_created=''; 
  return date_created;
}
else
{
  var date = new Date(date_to_be_converted);
  var date_created = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
//var date_created = weekday[date.getDay()] + "  " + month[date.getMonth()] + "  " + date.getDate() + "  " + date.getFullYear();
  return date_created ;
}
};


module.exports.date_formatter = function(date_to_be_converted) {

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
if(date_to_be_converted == '' || date_to_be_converted == null)
{
  var date_created=''; 
  return date_created;
}
else
{
  var date = new Date(date_to_be_converted);
  var date_created = weekday[date.getDay()] + "  " + month[date.getMonth()] + "  " + date.getDate() + "  " + date.getFullYear();
  return date_created ;
}
};
module.exports.timestamp_formatter = function(date_to_be_converted) {

function AddZero(num) 
{
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";
if(date_to_be_converted == '' || date_to_be_converted == null)
{
  var date_created=''; 
  return date_created;
}
else
{
  var date = new Date(date_to_be_converted);
  var  hours=date.getHours();
	if(date.getHours()>12)
		{
		
		hours=parseInt(date.getHours())-12;
		}
  var date_created = [[AddZero(date.getMonth() + 1), AddZero(date.getDate()), date.getFullYear()].join("/"), [AddZero(hours), AddZero(date.getMinutes())].join(":"), date.getHours() >= 12 ? "PM" : "AM"].join(" ");
  //var date_created = weekday[date.getDay()] + "  " + month[date.getMonth()] + "  " + date.getDate() + "  " + date.getFullYear();
  return date_created ;
}
};
