requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $, TableComponent) {

        function DurabilityMatrix(options) {
            options = options || {};

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var padding = 10;
            var cell = 30;

            var size;
            var paper;

            var attrRect = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var attrDur = {"font-family": "Roboto", "font-size": 20, "stroke": colorBlue4};
            var attrSum = {"font-family": "Roboto", "font-size": 16, "stroke": colorBlue4};

            this.draw = function(dom, matrix, rows, cols, weak) {
                size = padding * 2 + (matrix.length + 1) * cell;
                paper = Raphael(dom, size, size);
                var mRow = Math.min.apply(Math.min, rows);
                var mCol = Math.min.apply(Math.min, cols);
                for (var i = 0; i < rows.length; i++) {
                    var t = paper.text(padding + cell / 2, padding + cell * 1.5 + cell * i, rows[i]).attr(attrSum);
                    if (rows[i] === mRow) {
                        t.attr({"stroke": colorOrange4, "fill": colorOrange4});
                    }
                }
                for (i = 0; i < cols.length; i++) {
                    t = paper.text(padding + cell * 1.5 + cell * i, padding + cell / 2, cols[i]).attr(attrSum);
                    if (cols[i] === mCol) {
                        t.attr({"stroke": colorOrange4, "fill": colorOrange4});
                    }
                }

                for (var row = 0; row < matrix.length; row++) {
                    for (var col = 0; col < matrix[row].length; col++) {
                        var r = paper.rect(
                            padding + cell + cell * col,
                            padding + cell + cell * row,
                            cell, cell).attr(attrRect);
                        paper.text(
                            padding + cell * 1.5 + cell * col,
                            padding + cell * 1.5 + cell * row,
                            matrix[row][col]
                        ).attr(attrDur);
                        if (rows[row] === mRow || cols[col] === mCol) {
                            r.attr("fill", colorOrange1);
                        }
                        if (row === weak[0] && col === weak[1]) {
                            r.attr("fill", colorOrange4);
                        }
                    }
                }

            }
        }
        var $tryit;
        var io = new extIO({
            animation: function($expl, data){
                var checkioInput = data.in;
                var explanation = data.ext["explanation"];
                var answer = data.ext["answer"]
                if (!checkioInput){
                    return;
                }
                var canvas = new DurabilityMatrix();
                canvas.draw($expl[0], checkioInput, explanation[0], explanation[1], answer);
            },
            animationTemplateName: 'animation',

            tryit: function(){
                var this_e = this;
                $tryit = $(this_e.extSetHtmlTryIt(this_e.getTemplate('tryit')));

                var tryitDataInput = $tryit.find('.tryit-content');
                tryitDataInput.focus();

                $tryit.find('.bn-check').click(function (e) {
                    var tryitData = tryitDataInput.val();
                    this_e.extSendToConsoleCheckiO(tryitData);
                    e.stopPropagation();
                    return false;
                });
            },

            retConsole: function (ret) {
                $tryit.find('.checkio_result').html("Your result:<br>" + ret);
            },

            functions: {
                js: 'weakPoint',
                python: 'weak_point'
            }
        });
        io.start();
    }
);
