<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'negocios@apollo.com.ar';
        $mail->Password = 'TU_PASSWORD_REAL';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('negocios@apollo.com.ar', 'Web Apollo');
        $mail->addAddress('negocios@apollo.com.ar');

        $mail->isHTML(false);

        $mail->Subject = $_POST['asunto'];

        $mail->Body =
            "Nombre: " . $_POST['nombre'] . "\n" .
            "Email: " . $_POST['email'] . "\n\n" .
            "Mensaje:\n" . $_POST['mensaje'];

        $mail->send();

        echo "OK";

    } catch (Exception $e) {
        echo "ERROR: " . $mail->ErrorInfo;
    }
}