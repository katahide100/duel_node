<?php
$url = 'https://manadream.net:1337/userList/checkAndDelete';

$options['ssl']['verify_peer']=false;
$options['ssl']['verify_peer_name']=false;

$response = file_get_contents($url, false, stream_context_create($options));

// 結果はjson形式で返されるので
$result = json_decode($response,true);
var_dump($result);
