<table>
    <thead>
        <tr>
            <th class="column1">X</th>
            <th class="column2">Y</th>
            <th class="column3">R</th>
            <th class="column4">Status</th>
            <th class="column5">Time</th>
            <th class="column6">Execution time(s)</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($_SESSION['history'] as $row) { ?>
            <tr>
                <td class="column1"><?php echo $row[0] ?></td>
                <td class="column2"><?php echo sprintf('%.5f', $row[1]) ?></td>
                <td class="column3"><?php echo sprintf('%.5f', $row[2]) ?></td>
                <td class="column4"><?php echo $row[3] ?></td>
                <td class="column5"><?php echo $row[4] ?></td>
                <td class="column6"><?php echo sprintf('%.9f', $row[5]) ?></td>
            </tr>
        <?php } ?>
    </tbody>
</table>