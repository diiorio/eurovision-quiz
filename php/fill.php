<?php
include_once(realpath($_SERVER['DOCUMENT_ROOT'] . '/../vendor/autoload.php'));
include_once(__DIR__ . '/minify.php');
$TEMPLATE_PATH = realpath(__DIR__ . '/../templates');
$loader = new Twig_Loader_Filesystem($TEMPLATE_PATH);
$twig = new Twig_Environment($loader);

function fill ($file, $arr) {
  global $twig, $TEMPLATE_PATH;
  if (!isset($arr['footer'])) {
    $arr['footer'] = file_get_contents($TEMPLATE_PATH . '/partials/footer.twig');
  }
  $share = $arr['share'];
  if ($share) {
    if (gettype($share) == 'string') {
      $share = [
        'desc' => $share
      ];
      if (!isset($share['url'])) {
        $share['url'] = htmlspecialchars(rawurlencode("https://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"));
      }
      $defaults = [
        'twitter' => 'desc',
        'reddit' => 'desc',
        'email_subject' => 'desc',
        'email_body' => 'url',
        'tumblr_title' => 'desc',
        'tumblr_caption' => 'url'
      ];
      foreach($defaults as $key => $val) {
        if (!isset($share[$key])) {
          $share[$key] = $share[$val] ?: '';
        }
      }
    }
  }
  $arr['share'] = $twig->render('partials/share.twig', $share ?: []);
  $arr['head'] = $twig->render('partials/head.twig', $arr['head'] ?: []);
  return $twig->render($file, $arr);
}
?>
