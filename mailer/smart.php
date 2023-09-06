<?php 
$name = $_POST['user_name'];
$email = $_POST['user_email'];
$phone = $_POST['user_phone'];
$country = $_POST['user_country'];

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

// $mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'facemassagebylerasend@gmail.com';                 // Наш логин
$mail->Password = 'kmqvcdgfmydygkod';                           // Наш пароль от ящика
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;                                    // TCP port to connect to
 
$mail->setFrom('facemassagebylerasend@gmail.com', 'Сайт курса');   // От кого письмо 
$mail->addAddress('kiselrodion7@gmail.com');     // Add a recipient
//$mail->addAddress('ellen@example.com');               // Name is optional
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Данные';
$mail->Body    = '
	Пользователь оставил данные <br> 
	<strong>Имя:</strong> ' . $name . ' <br>
	<strong>E-mail:</strong> ' . $email . '<br>
	<strong>Телефон:</strong> ' . $phone . '<br>
	<strong>Страна:</strong> ' . $country . '<br>';

if(!$mail->send()) {
    return false;
} else {
    return true;
}
?>