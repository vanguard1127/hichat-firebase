<?php
header('Access-Control-Allow-Origin: *');
error_reporting(0);
$firebase = 'https://hichat-20ff5.firebaseio.com';
$host = 'https://taydomailer.com/mobileapp/hichat/active.php';
$action = $_GET['action'];
$key = $_GET['key'];
$email = $_GET['email'];
$phone = $_GET['phone'];
if(!empty($phone)){
	if($action == 'forgot'){
		$url = $firebase.'/login/'.$phone.'/email.json';
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$email = curl_exec($ch);
		curl_close();
		$email = str_replace('"','',$email);
		if(!empty($key)){
			$key = '"'.$key.'"';
			$url = $firebase.'/login/'.$phone.'/forgot/key.json';
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($ch);
			curl_close();
			if($response == $key){
				$url = $firebase.'/login/'.$phone.'/forgot.json';
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $url);
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$response  = curl_exec($ch);
				curl_close($ch);
				$rand = substr(md5(rand(0,999999)),0,6);
				$data = array('password'=>$rand);
				$data_json = json_encode($data);
				$url = $firebase.'/login/'.$phone.'/.json';
				$setPass = curl_init();
				curl_setopt($setPass, CURLOPT_URL, $url);
				curl_setopt($setPass, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
				curl_setopt($setPass, CURLOPT_CUSTOMREQUEST, 'PATCH');
				curl_setopt($setPass, CURLOPT_POSTFIELDS,$data_json);
				curl_setopt($setPass, CURLOPT_RETURNTRANSFER, true);
				$response  = curl_exec($setPass);
				curl_close($setPass);
				$to = $email;
				$subject = 'New password your HiChat account';
				$message = 'You are change password HiChat account success.<br/>New password is '.$rand.'<br/>- Team HiChat';
				$headers = "From: noreply@hichat.com";
				$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
				$mail_sent = @mail($to, $subject, $message, $headers);
				echo 'Change password success, new password will send to your email';
			}
		} else {
			$rand = md5(rand(0,999999));
			$data = array('key'=>$rand);
			$data_json = json_encode($data);
			$url = $firebase.'/login/'.$phone.'/forgot.json';
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
			curl_setopt($ch, CURLOPT_POSTFIELDS,$data_json);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response  = curl_exec($ch);
			curl_close($ch);
			$to = $email;
			$subject = 'Forgot password your HiChat account';
			$message = 'Hello!<br/>Someone has asked to forgot your password account.<br/>If you did not, you can disregard this email. No changes have been made to your account.<br/>To change password, follow this link (or paste into your browser):<br/>'.$host.'?action=forgot&phone='.$phone.'&key='.$rand.'<br/>- Team HiChat';
			$headers = "From: noreply@hichat.com\r\n";
			$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
			$mail_sent = @mail($to, $subject, $message, $headers);
		}
	}
}
?>