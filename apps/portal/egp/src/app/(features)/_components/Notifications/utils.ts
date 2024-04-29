export function findNotifDate(date_notified) {
  /**
   * @ findNotifDate : Finds the Date Difference of a Notification
   * @ date_notified : The notification date
   **/
  const date_sent_tmp = new Date(date_notified);

  //Check for timestamps
  if (date_notified.indexOf('-') != -1) {
    var date_sent: any = date_sent_tmp.getTime();
  } else {
    var date_sent: any = date_notified;
  }

  const date_now = new Date();
  //current timestamp
  var today = date_now.getTime();

  //Subtract the timestamps
  var calc = new Date(today - date_sent);

  //Prevent Extra 1 Hour
  calc.setHours(calc.getUTCHours() + 0);

  //Make our result readable
  var calcDate =
    calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
  var calcTime =
    calc.getHours() + ':' + calc.getMinutes() + ':' + calc.getSeconds();

  //Get How many days, months and years that has passed
  var date_passed = calcDate.split('-');
  var time_passed = calcTime.split(':');

  if (!date_passed.includes('1-1-1970')) {
    var days_passed =
      parseInt(date_passed[0]) - 1 != 0 ? parseInt(date_passed[0]) - 1 : null;
    var months_passed =
      parseInt(date_passed[1]) - 1 != 0 ? parseInt(date_passed[1]) - 1 : null;
    var years_passed =
      parseInt(date_passed[2]) - 1970 != 0
        ? parseInt(date_passed[2]) - 1970
        : null;
  } else {
    var days_passed: number | null = null;
    var months_passed: number | null = null;
    var years_passed: number | null = null;
  }

  var hours_passed = parseInt(time_passed[0]);
  var mins_passed = parseInt(time_passed[1]);
  var secs_passed = parseInt(time_passed[2]);

  //Set up your Custom Text output here
  const s = ['sec ago', 'secs ago']; //seconds
  const m = ['min', 'sec ago', 'mins', 'secs ago']; //minutes
  const h = ['hr', 'min ago', 'hrs', 'mins ago']; //hours
  const d = ['day', 'hr ago', 'days', 'hrs ago']; //days
  const M = ['month', 'day ago', 'months', 'days ago']; //months
  const y = ['year', 'month ago', 'years', 'months ago']; //years

  var ret, retA, retB;

  if (
    !days_passed &&
    !months_passed &&
    !years_passed &&
    !hours_passed &&
    !mins_passed
  ) {
    ret =
      secs_passed == 1 ? secs_passed + ' ' + s[0] : secs_passed + ' ' + s[1];
  } else if (!days_passed && !months_passed && !years_passed && !hours_passed) {
    retA =
      mins_passed == 1 ? mins_passed + ' ' + m[0] : mins_passed + ' ' + m[2];
    retB =
      secs_passed == 1 ? secs_passed + ' ' + m[1] : secs_passed + ' ' + m[3];

    ret = retA + ' ' + retB;
  } else if (!days_passed && !months_passed && !years_passed) {
    retA =
      hours_passed == 1 ? hours_passed + ' ' + h[0] : hours_passed + ' ' + h[2];
    retB =
      mins_passed == 1 ? mins_passed + ' ' + h[1] : mins_passed + ' ' + h[3];

    ret = retA + ' ' + retB;
  } else if (!years_passed && !months_passed) {
    retA =
      days_passed == 1 ? days_passed + ' ' + d[0] : days_passed + ' ' + d[2];
    retB =
      hours_passed == 1 ? hours_passed + ' ' + d[1] : hours_passed + ' ' + d[3];

    ret = retA + ' ' + retB;
  } else if (!years_passed) {
    retA =
      months_passed == 1
        ? months_passed + ' ' + M[0]
        : months_passed + ' ' + M[2];
    retB =
      days_passed == 1 ? days_passed + ' ' + M[1] : days_passed + ' ' + M[3];

    ret = retA + ' ' + retB;
  } else {
    retA =
      years_passed == 1 ? years_passed + ' ' + y[0] : years_passed + ' ' + y[2];
    retB =
      months_passed == 1
        ? months_passed + ' ' + y[1]
        : months_passed + ' ' + y[3];

    ret = retA + ' ' + retB;
  }

  //Check if return contains a negative value
  if (ret.includes('-')) {
    ret += ' ( TIME ERROR )-> Invalid Date Provided!';
  }

  return ret;
}
