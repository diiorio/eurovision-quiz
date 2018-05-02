<?php
include_once(__DIR__ . '/php/fill.php');
include_once(__DIR__ . '/php/years.php');
include_once(__DIR__ . '/php/table.php');
function get_data ($key) {
  $param = $_GET[$key];
  if (isset($param)) {
    return get_table_data($param);
  } else {
    return [
      'raw' => '',
      'parsed' => []
    ];
  }
}
$desc = "Check out my favourite Eurovision $year songs and compare them with your own top picks!";
echo fill('compare.twig', [
  'year' => $year,
  'left' => get_data('left'),
  'right' => get_data('right'),
  'data' => file_get_contents(__DIR__ . "/data/$year.json"),
  'head' => [
    'title' => "Compare Eurovision $year Favourites",
    'canonical' => htmlspecialchars("https://$_SERVER[HTTP_HOST]" . "/eurovision/compare.php?year=$year"),
    'desc' => "Do you know what your favourite Eurovision $year songs are? Use this page to compare yours with a friend's!"
  ],
  'share' => "Check out my favourite Eurovision $year songs and compare them with your own top picks!"
]);
?>
