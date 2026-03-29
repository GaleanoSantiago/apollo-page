<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $mail = new PHPMailer(true);

    try {
        // DEBUG (activar solo si falla)
        // $mail->SMTPDebug = 2;

        $mail->isSMTP();
        $mail->Host = 'smtp.hostinger.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'negocios@apollo.com.ar';
        $mail->Password = '8tQJL$E0t'; //Password real
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('negocios@apollo.com.ar', 'Web Apollo');
        $mail->addAddress('agenciaapollo.arg@gmail.com');

        $mail->isHTML(false);

        // Sanitizar básico
        $nombre = trim($_POST['nombre'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $asunto = trim($_POST['asunto'] ?? '');
        $mensaje = trim($_POST['mensaje'] ?? '');

        if (!$nombre || !$email || !$asunto || !$mensaje) {
            echo "ERROR: Datos incompletos";
            exit;
        }

        $mail->Subject = $asunto;

        $mail->Body =
            "Nombre: $nombre\n" .
            "Email: $email\n\n" .
            "Mensaje:\n$mensaje";

        $mail->send();

        echo "OK";
        exit;

    } catch (Exception $e) {
        echo "ERROR: " . $mail->ErrorInfo;
        exit;
    }
}

// Si no es POST
echo "ERROR: Metodo no permitido";
exit;