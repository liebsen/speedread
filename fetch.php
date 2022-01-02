<?php 

$key = strtolower($_GET['key']);
$type = strtolower($_GET['type']);
$source = strtolower($_GET['source']);

$user_pref_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];

if ($source === 'google') {
  $url = "https://news.google.com/rss?hl=${user_pref_langs}";
} else if ($source === 'bing') {
  $url = "https://www.bing.com/news/results.aspx?setLang=${user_pref_langs}&q=${key}&format=rss";
}

if ($type === 'geo') {
  if ($source === 'google') {
    $url = "https://news.google.com/news/rss/headlines/section/geo/${key}";
  } else if ($source === 'bing') {
    $url = "https://www.bing.com/news/results.aspx?q=${key}&format=rss";
  }
} else if ($type === 'keyword') {
  if ($source === 'google') {
    $url = "https://news.google.com/rss/search?q=${key}&hl=${user_pref_langs}";
  } else if ($source === 'bing') {
    $url = "https://www.bing.com/news/results.aspx?q=${key}&format=rss";
  }
}

$string = file_get_contents("${url}");
if($string === FALSE) {
  echo "error";
} else {
  echo $string;
}
