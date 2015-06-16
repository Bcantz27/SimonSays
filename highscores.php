<!DOCTYPE html>
    <html lang="en">
    <head>

    <title>Simon Says!</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="stylesheet" href="css/grid12.css" type="text/css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

    </head>

    <body>
        <nav>
            <div class="row">
                <div class="col-lg-6 col-lg-offset-4">
                    <ul>
                        <li>
                            <a class="active" href="./index.html">Play</a>
                        </li>
                        <li>
                            <a href="./highscores.php">Highscores</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="highscores" style="font-size: 32px;">
            <?php
            $servername = "localhost";
            $username = "admin";
            $password = "22penn27";
            $database = "simonsays";
            $players = array();
            $scores = array();

            $db_handle = mysql_connect($servername, $username, $password);
            $db_found = mysql_select_db($database, $db_handle);
            if ($db_found) {

                $SQL = "SELECT name, score FROM users ORDER BY score DESC";
                $result = mysql_query($SQL);

                while(($row =  mysql_fetch_assoc($result))) {
                    $players[] = $row['name'];
                    $scores[] = $row['score'];
                }

                mysql_close($db_handle);

            }
            else {

                mysql_close($db_handle);

            }

            ?>
            <div class="row">
                <div class="col-6-lg">
                    <table style="position: relative; width: 100%; text-align: center;">
                        <tr>
                            <td style="text-align: right;" id="rank"><u>Rank</u></td>
                            <td id="name"><u>Name</u></td>
                            <td style="text-align: left;" id="score"><u>Score</u></td>
                        </tr>
                        <?php for($i = 0; $i < count($scores); $i++): ?>
                        <tr>
                            <td style="text-align: right;"><?= $i+1 ?></td>
                            <td><?= $players[$i] ?></td>
                            <td style="text-align: left;"><?= $scores[$i] ?></td>
                        </tr>
                        <?php endfor; ?>
                    </table>
                </div>
            </div>
        </div>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="scripts/myJs.js"></script>
    </body>

</html>
