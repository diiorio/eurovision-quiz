<?php
$YEARS = ['2018'];
$year = $_GET['year'];
if (!in_array($year, $YEARS)) {
  $year = end($YEARS);
}
?>
