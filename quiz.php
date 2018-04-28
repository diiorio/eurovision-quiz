<?php
include_once(__DIR__ . '/php/fill.php');
include_once(__DIR__ . '/php/years.php');
echo fill('quiz.twig', [
  'year' => $year,
  'data' => trim(file_get_contents(__DIR__ . "/data/$year.json")),
  'head' => [
    'title' => "Eurovision $year Favourites Quiz",
    'canonical' => "https://$_SERVER[HTTP_HOST]/eurovision/quiz.php?year=$year",
    'desc' => "Take this quiz to help you rank your favourite Eurovision $year songs by comparing just two songs at a time. Then compare your favourites with your friends!"
  ],
  'share' => rawurlencode("Take the Eurovision $year Favourites Quiz to rank your favourite songs!")
]);
?>
