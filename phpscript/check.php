<?php

// Checks status of the point: inside/outside
function checkValues($x, $y, $r) {

    $inside = '<span style="color: green">inside</span>';
    $outside = '<span style="color: red">outside</span>';

    // Rectangle check
    if ($x >= 0 && $x <= $r && $y <= 0 & $y >= -$r/2) {
        return $inside;
    }
    // Triangle check
    if ($x >= 0 && $x <= $r && $y >= 0 && $y <= - $x/2 + $r/2) {
        return $inside;
    }
    // 1/4 of circle check
    if ($x <= 0 && $x >= -$r/2 && $y <= 0 && $x*$x + $y*$y <= $r*$r/4) {
        return $inside;
    }
    return $outside;
}

// Rounds number
function floatRound($floatValue, $length) {
    $radius = pow(10, $length);
    $lastDigit = ($floatValue * $radius) % 10;

    $newValue = round($floatValue * $radius) / $radius;
    // returns ceiling value
    if ($newValue > $floatValue) {
        if ($lastDigit !== 0) $newValue -= 1 / $radius;
    }
    // returns flooring value
    if ($newValue < $floatValue) {
        if ($lastDigit !== 9) $newValue += 1 / $radius;
    }
    return $newValue;
}

session_start();

date_default_timezone_set('Europe/Moscow');
$currentTime = date("H:i:s"); // Current time in f: Hour:minutes:seconds

$startTime = microtime(true);

$xValue = $_POST['x'];
$yValue = $_POST['y'];
$rValue = $_POST['r'];

$status = checkValues($xValue, $yValue, $rValue);

// Calculating execution time (in seconds)
$executionTime = microtime(true) - $startTime;

$result = array($xValue, // value of the x
                floatRound($yValue, 5), // value of the y
//                $yValue,
                floatRound($rValue, 5), // value of the r
//                $rValue,
                $status, // status of point
                $currentTime, // start of script
                floatRound($executionTime, 9)); // execution time in seconds
//                $executionTime);

if (!isset($_SESSION['history'])) {
    $_SESSION['history'] = array();
}

array_push($_SESSION['history'], $result);

include 'table.php';
