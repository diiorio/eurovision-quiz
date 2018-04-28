<?php
# ascii <-> emoji conversions
$char_to_flag = [];
$flag_to_char = [];
foreach (str_split('ABCDEFGHIJKLMNOPQRTSTUVWXYZ') as $char) {
  $flag = iconv('UCS-4LE', 'UTF-8', pack('V', 127397 + ord($char)));
  $char_to_flag[$char] = $flag;
  $flag_to_char[$flag] = $char;
}
# Load country data and make accessible by country code
$json = json_decode(file_get_contents(realpath(__DIR__ . "/../data/$year.json")), true);
$map = [];
foreach($json as $country) {
  $map[$country['countryCode']] = $country;
}
function get_table_data ($list) {
  $is_global = strtolower($list) == 'global';
  if ($is_global) {
    try {
      global $year;
      include_once(__DIR__ . '/db.php');
      $data = read_db($year);
      usort($data, function ($a, $b) {
        return $b['score'] - $a['score'];
      });
      $order = array_map(function ($entry) {
        global $char_to_flag, $map;
        $country = $map[$entry['country']];
        $country['emoji'] = $char_to_flag[$entry[0]] . $char_to_flag[$entry[1]];
        return $country;
      }, $data);
    } catch (PDOException $e) {
      $order = [
        [
          'missing' => true,
          'countryCode' => '??'
        ]
      ];
    }
  } else {
    preg_match_all('/[A-Za-z]{2}|[🇦-🇿]{2}/u', $list, $matches);
    $order = array_map(function ($str) {
      global $char_to_flag, $flag_to_char, $map;
      if (strlen($str) == 2) {
        $cc = strtoupper($str);
      } else {
        $cc = $flag_to_char[substr($str, 0, 4)] . $flag_to_char[substr($str, 4, 4)];
      }
      if (isset($map[$cc])) {
        $country = $map[$cc];
        if (strlen($str) == 2) {
          $country['emoji'] = $char_to_flag[$cc[0]] . $char_to_flag[$cc[1]];
        } else {
          $country['emoji'] = $str;
        }
        return $country;
      } else {
        return [
          'missing' => true,
          'countryCode' => $cc,
        ];
      }
    }, $matches[0]);
  }
  # Modify indices to start at 1
  array_unshift($order, null);
  unset($order[0]);
  return [
    'parsed' => $order,
    'raw' => $is_global ? 'global' : implode(' ', array_map(function ($country) {
      return $country['countryCode'];
    }, $order))
  ];
}
?>
