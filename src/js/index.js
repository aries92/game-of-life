/**
 * Application entry point
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '../scss/index.scss';

// ================================
// START YOUR APP HERE
// ================================

const GameOfLife = (() => {

    //common
    let timer;
    let _speed = 1;

    let _domCells = [];
    let _originCells = [];
    let _proceedCells = [];

    let _renderStartIndex = 0;

    let _rows = [];

    let _numCells = 0;
    let _numCellsInRow = 0;


    //logic

    class App {
        constructor(options) {

            this.options = {
                selector: null,
                cells_count: null
            };

            this.options = Object.assign({}, this.options, options);
            this._setField();
        }

        _setField() {
            const rowsNumber = Math.round(Math.sqrt(this.options.cells_count));

            let table = $('<div class="field"></div>');
            let row = "";
            let cell = "";

            for (let i = 0; i < rowsNumber; i++) {
                row = $('<div class="field-row"></div>');

                for (let j = 0; j < rowsNumber; j++) {
                    cell = new Cell({state: 'dead'});

                    _originCells.push(cell);
                    row.append(cell.html);
                }

                _rows.push(row);
                table.append(row);
            }

            $(this.options.selector).append(table);

            _domCells = document.querySelectorAll('.field-cell');

            _numCells = _domCells.length;

            _numCellsInRow = $(_rows[0]).children().length;
        }

        _setUserPattern(pattern) {
            let userPatternArr = [];
            let startPoint = _renderStartIndex;
            let lines = pattern.split('\n');

            // i = 1 cause of remove first line P # #
            for (var i = 1; i < lines.length - 1; i++) {

                let str = lines[i];

                //transform
                str = str.replace(/\s/g, '').replace(/\*/g, 1).replace(/\./g, 0);

                //to array
                userPatternArr.push(str.split(''));
            }

            let cells = this._getExistedCells();

            for (let i = 0; i < userPatternArr.length; i++) {
                for (let j = 0; j < userPatternArr[i].length; j++) {
                    if (userPatternArr[i][j] == 1) {
                        let index = startPoint + j;

                        if (index > cells.length) {
                            cells[index - cells.length] = new Cell({state: 'alive'});
                        } else {
                            cells[startPoint + j] = new Cell({state: 'alive'});
                        }
                    }
                }
                startPoint = startPoint + _numCellsInRow;
            }
            _proceedCells = [...cells];

            this._render(_proceedCells);
        }

        _getExistedCells() {
            let cells = [];

            if (_proceedCells.length != 0) {
                cells = [..._proceedCells]
            } else {
                cells = [..._originCells];
            }

            return cells;
        }

        _runApp() {

            let cells = [..._proceedCells];

            this._proceed(cells);

            this._render(_proceedCells);
        }

        _proceed(cells) {
            for (let i = 0, len = cells.length; i < len; i++) {

                let cell = cells[i];
                let cellIndex = i;

                let neighbors = [];
                let neighborsQuantity = 0;

                neighbors.push(
                    //left
                    cells[this._getNeighborIndex(cellIndex, 'left')],
                    //right
                    cells[this._getNeighborIndex(cellIndex, 'right')],
                    //top
                    cells[this._getNeighborIndex(cellIndex, 'top')],
                    //top left,
                    cells[this._getNeighborIndex(cellIndex, 'top_left')],
                    //top right
                    cells[this._getNeighborIndex(cellIndex, 'top_right')],
                    //bottom
                    cells[this._getNeighborIndex(cellIndex, 'bottom')],
                    //bottom left
                    cells[this._getNeighborIndex(cellIndex, 'bottom_left')],
                    //bottom right
                    cells[this._getNeighborIndex(cellIndex, 'bottom_right')]
                );

                for (let neighbor of neighbors) {
                    if (neighbor && neighbor.state == 'alive') {
                        neighborsQuantity += 1;
                    }
                }

                if (neighborsQuantity == 3 && cell.state == 'dead') {
                    //$cell.removeClass('isDead').addClass('alive');
                    _proceedCells[cellIndex] = new Cell({state: 'alive'});
                }

                if ((neighborsQuantity == 2 || neighborsQuantity == 3) && cell.state == 'alive') {
                    //$cell.addClass('alive');
                    _proceedCells[cellIndex] = new Cell({state: 'alive'});
                }

                if (neighborsQuantity == 0 || neighborsQuantity == 1) {
                    //$cell.removeClass('alive').addClass('isDead');
                    _proceedCells[cellIndex] = new Cell({state: 'dead'});
                }

                if (neighborsQuantity >= 4) {
                    //$cell.removeClass('alive').addClass('isDead');
                    _proceedCells[cellIndex] = new Cell({state: 'dead'});
                }

            }
        }

        _getNeighborIndex(cellIndex, pos) {

            let neighborIndex = 0;

            if (pos == 'left') {
                neighborIndex = cellIndex - 1
            }

            if (pos == 'right') {
                neighborIndex = cellIndex + 1
            }

            if (pos == 'top') {
                neighborIndex = cellIndex - _numCellsInRow
            }

            if (pos == 'top_left') {
                neighborIndex = cellIndex - _numCellsInRow - 1
            }

            if (pos == 'top_right') {
                neighborIndex = cellIndex - _numCellsInRow + 1;
            }

            if (pos == 'bottom') {
                neighborIndex = cellIndex + _numCellsInRow
            }

            if (pos == 'bottom_left') {
                neighborIndex = cellIndex + _numCellsInRow - 1
            }

            if (pos == 'bottom_right') {
                neighborIndex = cellIndex + _numCellsInRow + 1
            }

            if (neighborIndex < 0) {
                neighborIndex = _numCells + neighborIndex
            }
            if (neighborIndex > _numCells) {
                neighborIndex = neighborIndex - _numCells
            }

            return neighborIndex
        }

        _render(proceedCells) {
            for (let i = 0, len = proceedCells.length; i < len; i++) {
                if (proceedCells[i].state == 'alive') {
                    //_domCells.eq(i).addClass('alive');
                    _domCells[i].classList.add("alive")
                } else {
                    //_domCells.eq(i).removeClass('alive');
                    _domCells[i].classList.remove("alive")
                }
            }
        };
    }

    class Cell {
        constructor(options) {
            this.state = options.state;
            this.html = '<div class="field-cell"></div>'
        }
    }

    class Mode extends App {
        constructor() {
            super()
        }

        _patternMode(activePattern) {

            $('body').removeClass().addClass('patternMode');

            $(_domCells).on('click', (e)=> {
                _renderStartIndex = $(_domCells).index($(e.currentTarget));
                this._setUserPattern(activePattern)
            })

        }

        _randomMode(cellsNumber) {

            let cells = this._getExistedCells();

            for (let i = 0, len = cellsNumber; i < len; i++) {
                cells[Math.floor(Math.random() * cells.length)] = new Cell({state: 'alive'});
            }

            _proceedCells = [...cells];


            this._render(_proceedCells)
        }

        _editMode(type) {

            if (type == 'add') {
                $('body').removeClass().addClass('editModeAdd');
            }
            if (type == 'remove') {
                $('body').removeClass().addClass('editModeRemove');
            }

            let cells = this._getExistedCells();

            _proceedCells = [...cells];

            let isDown = false;   // Tracks status of mouse button

            $(_domCells).on('mousedown', () => {
                    isDown = true;      // When mouse goes down, set isDown to true
                })
                .on('mouseup', ()=> {
                    isDown = false;    // When mouse goes up, set isDown to false
                });

            $(_domCells).on('mouseover', (e)=> {
                if (isDown) {        // Only change css if mouse is down
                    let index = $(_domCells).index($(e.currentTarget));

                    if (type == 'add') {
                        $(e.currentTarget).addClass('alive');
                        _proceedCells[index] = new Cell({state: 'alive'});
                    }
                    if (type == 'remove') {
                        $(e.currentTarget).removeClass('alive');
                        _proceedCells[index] = new Cell({state: 'dead'});
                    }
                }
            });
        }

        disable() {
            $(_domCells).off('click mousedown mouseup mouseover');
        }

        activate(mode, arg) {
            this.disable();

            if (mode == 'pattern_mode') {
                this._patternMode(arg)
            }
            if (mode == 'edit_mode') {
                this._editMode(arg)
            }
            if (mode == 'random_mode') {
                this._randomMode(arg)
            }
        }
    }

    class Controls extends App {

        constructor() {
            super();

            //controls
            this.start = "#start";
            this.pause = "#pause";
            this.stop = "#stop";

            //pattern mode controls
            this.dropDownItem = '.dropdown-item';
            this.patternImg = '#patternImg';

            //random mode controls
            this.setRandomCells = '#setRandomCells';
            this.randomCellsNumber = '#randomCellsNumber';

            //edit mode controls
            this.addCells = '#addCells';
            this.removeCells = '#removeCells';

            //edit mode controls
            this.speedChange = '#speedChange';

            this.mode = new Mode();

            this.initEvents();
        }

        initEvents() {

            $(this.start).on('click', (e) => {
                this._start();
            });
            $(this.pause).on('click', (e) => {
                this._pause();
            });
            $(this.stop).on('click', (e) => {
                this._stop();
            });

            //enable pattern mode
            $(this.dropDownItem).on('click', (e) => {

                let imgSrc = $(e.currentTarget).find('img').attr('src');
                $(this.patternImg).attr('src', imgSrc);

                let activePattern = $(e.currentTarget).data('pattern');

                this.mode.activate('pattern_mode', activePattern);
            });

            //enable random mode
            $(this.setRandomCells).on('click', (e) => {

                let randomCells = $(this.randomCellsNumber).val();

                this.mode.activate('random_mode', randomCells);
            });

            //enable edit mode
            $(this.addCells).on('click', (e) => {
                this.mode.activate('edit_mode', 'add');
            });
            $(this.removeCells).on('click', (e) => {
                this.mode.activate('edit_mode', 'remove');
            });

            //change speed
            let timerSpeed;
            $(this.speedChange).on('keyup mouseup', (e) => {
                clearTimeout(timerSpeed);
                timerSpeed = setTimeout(()=> {
                    _speed = $(e.currentTarget).val();
                }, 1000)
            });
        }

        _stop() {
            this.mode.disable();
            clearTimeout(timer);
            _proceedCells = [];
            $(_domCells).removeClass('alive');
            $(this.patternImg).attr('src', '');
        }

        _pause() {
            clearTimeout(timer);
        }

        _start() {
            let tick;
            timer = setTimeout(tick = () => {
                this._runApp();
                timer = setTimeout(tick, _speed);
            }, _speed);
        }
    }


    //init
    let init = (options) => {
        new App(options);
        new Controls();
    };

    return {
        init
    }

})();


$(document).ready(()=> {

    GameOfLife.init({
        selector: '#root',
        cells_count: 25000
    });

});
