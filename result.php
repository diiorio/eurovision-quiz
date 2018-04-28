<?php
include_once(__DIR__ . '/php/years.php');
if (!isset($_GET['order'])) {
  header("Location: quiz.php?year=$year");
  die();
}
include_once(__DIR__ . '/php/fill.php');
include_once(__DIR__ . '/php/table.php');
$data = get_table_data($_GET['order']);
$data['raw'] = urlencode($data['raw']);
foreach ($data['parsed'] as &$country) {
  $a = $country['countryCode'][0];
  $b = $country['countryCode'][1];
  if (!$country['missing']) {
    if (isset($char_to_flag[$a]) && isset($char_to_flag[$b])) {
      $country['emoji'] = $char_to_flag[$a] . $char_to_flag[$b];
    } else {
      $country['emoji'] = $country['countryCode'];
    }
  }
}
$is_global = strtolower($_GET['order']) == 'global';
echo fill('result.twig', [
  'year' => $year,
  'whose' => $is_global ? 'Global' : 'Your',
  'countries' => $data,
  'head' => [
    'title' => "Eurovision $year Favourites Quiz Result",
    'canonical' => htmlspecialchars("https://$_SERVER[HTTP_HOST]" . "/result.php?year=$year&order=global"),
    'desc' => "These are my five favourite songs for Eurovision $year: $emoji_list. Check out my full list of favourites then take the quiz to figure out your own!"
  ],
  'share' => "Check out my favourite Eurovision $year songs and take the quiz to rank them all yourself!"
]);
?>
