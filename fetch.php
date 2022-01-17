<?php 

$key = urlencode(strtolower($_GET['key']));
$mode = strtolower($_GET['mode']);
$source = strtolower($_GET['source']);

$user_pref_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];
$user_pref_langs2 = explode('-', $user_pref_langs);
$hl = strtolower($user_pref_langs2[0]);
$gl = strtoupper($user_pref_langs2[1]);

if($gl === 'ES') {
  $gl = 'AR';
}

if ($source === 'google') {
  $url = "https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}";
  // $url = "dummy.xml";
} else if ($source === 'bing') {
  $url = "https://www.bing.com/news/results.aspx?setLang=${user_pref_langs}&q=${key}&format=rss";
}

if ($mode === 'geo') {
  if ($source === 'google') {
    $url = "https://news.google.com/news/rss/headlines/section/geo/${key}";
  } else if ($source === 'bing') {
    $url = "https://www.bing.com/news/results.aspx?q=${key}&format=rss";
  }
} else if ($mode === 'keyword') {
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
