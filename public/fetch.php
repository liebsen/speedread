<?php 

$keyword = urlencode(strtolower($_GET['keyword']));
$mode = strtolower($_GET['mode']);
$source = strtolower($_GET['source']);

$user_pref_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];
$user_pref_langs2 = explode('-', $user_pref_langs);
$hl = strtolower($user_pref_langs2[0]);
$gl = strtoupper($user_pref_langs2[1]);
$dev = $_SERVER['REMOTE_ADDR'] == '127.0.0.11';

if($gl === 'ES') {
  $gl = 'AR';
}

if ($source === 'google') {
  // avoid fetching in develope environment
  $url = $dev ? "dummy.xml" : "https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${gl}:${hl}"; 
} else if ($source === 'bing') {
  $url = "https://www.bing.com/news/results.aspx?setLang=${user_pref_langs}&q=${keyword}&format=rss";
}

if ($mode === 'geo') {
  if ($source === 'google') {
    $url = "https://news.google.com/news/rss/headlines/section/geo/${keyword}";
  } else if ($source === 'bing') {
    $url = "https://www.bing.com/news/results.aspx?q=${keyword}&format=rss";
  }
} else if ($mode === 'keywordword') {
  if ($source === 'google') {
    $url = "https://news.google.com/rss/search?q=${keyword}&hl=${user_pref_langs}";
  } else if ($source === 'bing') {
    $url = "https://www.bing.com/news/results.aspx?q=${keyword}&format=rss";
  }
}

$string = file_get_contents("${url}");
if($string === FALSE) {
  echo "error";
} else {
  echo $string;
}
