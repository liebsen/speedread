<?php 

$key = strtolower($_GET['key']);
$type = strtolower($_GET['type']);
$user_pref_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];

$url = "https://news.google.com/rss?hl=${user_pref_langs}";

if ($type === 'geo') {
  $url = "https://news.google.com/news/rss/headlines/section/geo/${key}";
} else if ($type === 'keyword') {
  $url = "https://news.google.com/rss/search?q=${key}";
}

$string = file_get_contents("${url}");
if($string === FALSE) {
  echo "Could not read the file.";
} else {
  echo $string;
}
