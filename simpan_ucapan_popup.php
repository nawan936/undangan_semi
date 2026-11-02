<?php
include "koneksi.php"; // koneksi ke database lain

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = $_POST['nama'];
    $ket_hadir = $_POST['ket_hadir'];
    $jumlah = isset($_POST['jumlah']) ? $_POST['jumlah'] : 0;

    // kalau popup tidak ada ucapan, kita set default
    $ucapan = isset($_POST['ucapan']) ? $_POST['ucapan'] : '';

    $sql = "INSERT INTO ucapan_popup (nama, ucapan, ket_hadir, jumlah) 
            VALUES ('$nama', '$ucapan', '$ket_hadir', '$jumlah')";

    if (mysqli_query($conn_popup, $sql)) {
        header("Location: komen.php?popup_success=1");
        exit;
    } else {
        echo "Error: " . mysqli_error($conn_popup);
    }
}
?>
