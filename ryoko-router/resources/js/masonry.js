export default function () {
    function getRoots()
    {
        var rootElements = document.getElementsByClassName('masonry-root');
        return Array.prototype.map.call(rootElements, function (rootElement) {
            var cellElements = rootElement.getElementsByClassName('masonry-cell');
            var cells = Array.prototype.map.call(cellElements, function (cellElement) {
                var style = getComputedStyle(cellElement);
                cellElement.style.flexBasis = 0;
                return {
                    'element': cellElement,
                    'outerHeight': parseInt(style.marginTop) + cellElement.offsetHeight + parseInt(style.marginBottom)
                };
            });
            return {
                'element': rootElement,
                'noOfColumns': 0,
                'cells': cells
            };
        });
    }
    function onResize()
    {
        var roots = getRoots();
        for (let root of roots) {
            root.noOfColumns = Math.round(root.element.offsetWidth / root.cells[0].element.offsetWidth);
            if (!root.noOfColumns && root.noOfColumns !== 0) {
                return;
            }
            var columns = Array.from(new Array(root.noOfColumns)).map(function () {
                return {
                    'cells': [],
                    'outerHeight': 0
                };
            });
            for (let cell of root.cells) {
                var minOuterHeight = Math.min(...columns.map(function (column) {
                    return column.outerHeight;
                }));
                var column = columns.find(function (column) {
                    return column.outerHeight === minOuterHeight;
                });
                column.cells.push(cell);
                column.outerHeight += cell.outerHeight;
            }
            var masonryHeight = Math.max(...columns.map(function (column) {
                return column.outerHeight;
            }));
            var order = 0;
            for (let column of columns) {
                for (let cell of column.cells) {
                    cell.element.style.order = order++;
                    cell.element.style.flexBasis = 0;
                }
                column.cells[column.cells.length - 1].element.style.flexBasis = column.cells[column.cells.length - 1].element.offsetHeight + masonryHeight - column.outerHeight - 1 + 'px';
            }
            root.element.style.maxHeight = masonryHeight + 5 + 'px';
        }
    }
    $(() => onResize());
    window.addEventListener('resize', onResize);
    window.recalculateMasonry = () => onResize();
    setTimeout(window.recalculateMasonry, 2000);
};
