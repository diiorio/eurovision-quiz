<?php
try {
  include_once(__DIR__ . '/php/db.php');
  $DEBUG = false;
  $PARAMS = $DEBUG ? $_GET : $_POST;
  function redirect ($msg) {
    global $DEBUG;
    if ($DEBUG) {
      echo $msg;
    } else {
      global $result_page;
      echo $msg;
      if (isset($result_page)) {
        header("Location: $result_page");
      } else {
        header('Location: quiz.php');
      }
    }
    die();
  }
  # Check and validate params
  if (count($PARAMS) > 3 || !isset($PARAMS['year']) || !isset($PARAMS['result'])) {
    redirect('Passed params are missing or invalid');
  }
  $year = $PARAMS['year'];
  $result = $PARAMS['result'];
  $result_page = "result.php?year=$year&order=$result";
  if (!$PARAMS['contribute']) {
    redirect('Not contributing');
  }
  include_once(__DIR__ . '/php/years.php');
  $year = $PARAMS['year']; # years.php changes $year value - reset it
  if (!in_array($year, $YEARS)) {
    redirect('Invalid year');
  }
  $order = explode(',', $result);
  $list = json_decode(file_get_contents(__DIR__ . "/data/$year.json"), true);
  if (count($order) != count($list)) {
    redirect('Count mismatch');
  }
  $map = [];
  foreach($list as $country) {
    $map[$country['countryCode']] = $country;
  }
  foreach($order as $cc) {
    if (!isset($map[$cc])) {
      redirect('Invalid entry'); # Either a duplicate or never existed
    }
    unset($map[$cc]);
  }
  update_db($year, $result, $order);
} catch (Exception $e) {
  redirect('An error occurred.');
}
redirect('OK');
?>
