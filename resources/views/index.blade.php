<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Завантаження файлу</title>
    <link rel="stylesheet" type="text/css" href="{{ asset('styles/styles.css') }}">
</head>
<body>
<div id="container">
    <input type="file" id="fileInput">
    <button id="startButton">Start upload</button>
    <button id="pauseButton">Pause</button>
    <button id="resumeButton">Resume</button>
    <button id="cancelButton">Cancel</button>
</div>
<script src="{{ asset('js/index.js') }}"></script>
</body>
</html>
