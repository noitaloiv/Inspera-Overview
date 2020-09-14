<!DOCTYPE html>
<html>

<head>
    <title>Inspera Exam Overview</title>
    <script src="jquery.min.js"></script>
    <link rel="stylesheet" href="bootstrap.min.css" />
    <script src="bootstrap.min.js"></script>
    <script src="inspera_csv.js"></script>
    <link rel="shortcut icon" href="favicon.png">
    <style>
        #sorttable_sortrevind {
            display: none;
            opacity: 0;
        }

        #sorttable_sortfwdind {
            display: none;
            opacity: 0;
        }

        .table thead th {
            vertical-align: middle;
        }

        .big-checkbox {
            width: 38px;
            height: 38px;

            float: left;
        }

        .labelCheckBox {
            margin-top: 5px;
            position: absolute;
            float: right;
            vertical-align: middle;
            overflow: hidden;
            white-space: nowrap;
        }

        .container {
            height: 20%;
        }

        .container-fluid {
            height: 80%;
        }

        #wrapper {
            height: 100%;
        }

        table {
            overflow: scroll;
        }

        .table-responsive {
            overflow-x: unset;
        }
    </style>
</head>

<body>
    <div id="wrapper">
        <div class="container">
            <h1 align="center">Inspera Exam Overview</h1>
            <br />
            <form class="mx-auto">
                <div class="row align-items-center">
                    <div class="col">
                        <label class="mr-sm-2" for="g">Points for G</label>
                        <input type="number" id="g" min="0" class="form-control" placeholder="Points for G" value=0>
                    </div>
                    <div class="col">
                        <label class="" for="vg">Points for VG</label>
                        <input type="number" id="vg" min="0" class="form-control" placeholder="Points for VG" value=0>
                    </div>
                    <div class="col">
                        <label class="" for="max">Max score</label>
                        <input type="number" id="max_score" min="0" class="form-control" placeholder="Max score"
                            value=0>
                    </div>
                </div>
                <div class="row align-items-center">

                    <div class="col">
                        <br>
                        <label id="load_data_label" class="custom-file-label btn" for="load_data"
                            style="right:15px; left:15px; top:inherit; text-align: left;">Select
                            csv</label>
                        <input type="file" name="load_data" id="load_data" class="custom-file-input"
                            accept="text/csv, .csv">
                    </div>
                    <div class="col">
                        <br>
                        <input type="checkbox" id="borderline" class="form-check-inline big-checkbox">
                        <label for="borderline" class="form-check-label labelCheckBox">Show only borderline
                            cases</label>
                    </div>
                    <div class="col">
                        <br>
                        <button type="button" id="read_csv" class="btn btn-secondary btn-block">Read CSV</button>
                    </div>
                </div>
                <!-- <div class="row align-items-center">
                <div class="col">
                    <input type="number" id="inspera_dl" min="0" class="form-control" placeholder="Inspera test code">
                </div>
            </div> -->
            </form>
        </div>
        <div class="container-fluid">
            <br />
            <div class="table-responsive text-center" id="inspera_table">
            </div>
        </div>
    </div>
</body>

</html>
