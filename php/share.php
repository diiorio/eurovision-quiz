<?php
function get_share_links () {
  return [];
  global $order;
  global $year;
  $url = rawurlencode((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? "https" : "http") . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
  $top5 = implode('', array_map('str_to_emoji', array_slice($order, 0, 5))); # Top 5 picks as emoji
  $short_text = rawurlencode("My Eurovision $year Picks $top5");
  $emoji_text = rawurlencode("My favourite Eurovision songs for $year: $top5");
  $url_text = rawurlencode("Check out my top Eurovision picks for $year: ") . $url;
  $links = [
    'facebook' => "http://www.facebook.com/sharer.php?u=$url",
    'twitter' => "https://twitter.com/intent/tweet?url=$url&text=$emoji_text",
    'email' => "mailto:?subject=$short_text&body=$url_text",
    'reddit' => "https://reddit.com/submit?url=$url&title=$emoji_text",
    'tumblr' => "https://www.tumblr.com/widgets/share/tool?canonicalUrl=$url&title=$short_text&caption=$url_text"
  ];
  return $links;
}
?>
