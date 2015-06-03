'use strict';

/* global Core */
describe('grid.normal.test', function() {
    var grid,
        $empty,
        timeoutDelay = 0;

    jasmine.getFixtures().fixturesPath = 'base/';
    loadFixtures('test/fixtures/empty.html');
    $empty = $('#empty');

    afterEach(function() {
        grid && grid.destroy();
    });

    beforeEach(function() {
        grid = new Core({
            el: $empty,
            columnModelList: [
                {
                    title: 'c1',
                    columnName: 'c1',
                    editOption: {
                        type: 'text'
                    }
                }, {
                    title: 'c2',
                    columnName: 'c2',
                    editOption: {
                        type: 'text'
                    }
                }, {
                    title: 'c3',
                    columnName: 'c3'
                }
            ],
            selectType: 'checkbox'
        });
        grid.setRowList([
            {
                c1: '0-1',
                c2: '0-2',
                c3: '0-3'
            }, {
                _extraData: {
                    rowState: 'DISABLED'
                },
                c1: '1-1',
                c2: '1-2',
                c3: '1-3'
            }, {
                c1: '2-1',
                c2: '2-2',
                c3: '2-3'
            }
        ]);
    });

    it('setRowList()를 실행하면 dataModel이 설정된다.', function() {
        expect(grid.dataModel.length).toBe(3);
    });

    describe('option()', function() {
        it('option의 동작을 확인한다.', function() {
            grid.option('temp', 'test_value');
            expect(grid.option('temp')).toEqual('test_value');
            grid.option('temp', 'test_value_changed');
            expect(grid.option('temp')).toEqual('test_value_changed');
        });
    });

    describe('getValue(), setValue()', function() {
        it('getValue 는 값을 잘 가져온다.', function() {
            expect(grid.getValue(0, 'c1')).toBe('0-1');
        });
        it('setValue 이후 getValue 의 isOriginal 을 true 로 설정시 original 데이터를 반환한다.', function() {
            grid.setValue(0, 'c1', 'New0-1');
            expect(grid.getValue(0, 'c1')).toBe('New0-1');
            expect(grid.getValue(0, 'c1', true)).toBe('0-1');
        });
    });

    describe('getColumnValues()', function() {
        it('인자로 들어온 열에 대한 데이터를 배열로 반환한다.', function() {
            var values = grid.getColumnValues('c2');
            expect(values.length).toBe(3);
            expect(values[0]).toBe('0-2');
            expect(values[1]).toBe('1-2');
            expect(values[2]).toBe('2-2');
        });
        it('인자로 들어온 열에 대한 데이터를 json 스트링으로 반환한다.', function() {
            var values = grid.getColumnValues('c1'),
                valuesJSON = grid.getColumnValues('c1', true);

            expect($.toJSON(values)).toBe(valuesJSON);
        });
    });

    describe('setColumnValues()', function() {
        it('인자로 들어온 열에 대한 데이터를 전부 변경한다.', function() {
            grid.setColumnValues('c1', 'changed');
            expect(grid.getValue(0, 'c1')).toBe('changed');
            expect(grid.getValue(1, 'c1')).toBe('1-1'); //2번째 row 는 disabled 이므로 변경하지 않는다.
            expect(grid.getValue(2, 'c1')).toBe('changed');
        });
        it('isCheckCellState를 false 로 넘겼을 경우 열에 대한 데이터 모두를 상태에 관계없이 변경한다.', function() {
            grid.setColumnValues('c1', 'changed', false);
            expect(grid.getValue(1, 'c1')).toBe('changed');
        });
    });

    describe('getRow()', function() {
        it('주어진 rowKey에 해당하는 행의 데이터를 object로 반환한다.', function() {
            var row = grid.getRow(0);
            expect(row._extraData).toBeDefined();
            expect(row.rowKey).toBe(0);
            expect(row._number).not.toBeDefined();
            expect(row._button).toBe(false);
            expect(row.c1).toBe('0-1');
            expect(row.c2).toBe('0-2');
            expect(row.c3).toBe('0-3');
        });
        it('두번째 파라미터가 true이면 json문자열 형태로 반환한다.', function() {
            expect($.toJSON(grid.getRow(0))).toBe(grid.getRow(0, true));
        });
    });

    describe('getRowAt()', function() {
        it('주어진 index에 해당하는 행의 데이터를 object로 반환한다.', function() {
            var row = grid.getRowAt(2);
            expect(row._extraData).toBeDefined();
            expect(row.rowKey).toBe(2);
            expect(row._number).not.toBeDefined();
            expect(row._button).toBe(false);
            expect(row.c1).toBe('2-1');
            expect(row.c2).toBe('2-2');
            expect(row.c3).toBe('2-3');
        });
        it('두번째 파라미터가 true이면 json문자열 형태로 반환한다.', function() {
            expect($.toJSON(grid.getRowAt(0))).toBe(grid.getRowAt(0, true));
        });
    });

    describe('getRowCount()', function() {
        it('row 개수를 반환한다.', function() {
            expect(grid.getRowCount()).toEqual(3);
            grid.setRowList([]);
            expect(grid.getRowCount()).toEqual(0);
        });
    });

    describe('getElement()', function() {
        beforeEach(function(done) {
            setTimeout(function() {
                done();
            }, timeoutDelay);
        });
        it('rowKey 와 columnName 에 해당하는 element 를 반환한다.', function() {
            var $el;
            $el = grid.getElement(0, 'c1');
            expect($el.closest('td').attr('columnname')).toBe('c1');
            expect($el.closest('tr').attr('key')).toBe('0');
        });
    });

    describe('focusModel 위임 함수', function() {
        it('select()', function() {
            spyOn(grid.focusModel, 'select');
            grid.select(1);
            expect(grid.focusModel.select).toHaveBeenCalledWith(1);
        });
        it('unselect()', function() {
            spyOn(grid.focusModel, 'unselect');
            grid.unselect();
            expect(grid.focusModel.unselect).toHaveBeenCalled();
        });
        it('focus()', function() {
            spyOn(grid.focusModel, 'focus');
            grid.focus(0, 'c1', true);
            expect(grid.focusModel.focus).toHaveBeenCalledWith(0, 'c1', true);
        })
        it('blur()', function() {
            spyOn(grid.focusModel, 'blur');
            grid.blur();
            expect(grid.focusModel.blur).toHaveBeenCalled();
        });
        it('focusAt()', function() {
            spyOn(grid.focusModel, 'focus');
            grid.focusAt(0, 0, true);
            expect(grid.focusModel.focus).toHaveBeenCalledWith(0, '_number', true);
        });
    });

    describe('getSelectedRowKey()', function() {
        it('select 된 rowKey 를 반환한다.', function() {
            grid.select(1);
            expect(grid.getSelectedRowKey()).toBe(1);
            grid.unselect();
            expect(grid.getSelectedRowKey()).toBeNull();
        });
    });

    describe('focusIn()', function() {
        it('editable한 column일 경우 cellInstance의 focusIn을 호출한다.', function() {
            var instance = grid.cellFactory.getInstance(grid.columnModel.getEditType('c1'));
            spyOn(instance, 'focusIn');
            grid.focusIn(0, 'c1');
            expect(instance.focusIn).toHaveBeenCalled();
        });
        it('editable하지 않을경우 focusClipboard를 호출한다.', function() {
            spyOn(grid, 'focusClipboard');
            var instance = grid.cellFactory.getInstance(grid.columnModel.getEditType('c1'));
            spyOn(instance, 'focusIn');
            grid.focusIn(1, 'c3');
            expect(instance.focusIn).not.toHaveBeenCalled();
            expect(grid.focusClipboard).toHaveBeenCalled();
        });
    });

    describe('focusInAt()', function() {
        it('주어진 인덱스에 해당하는 셀의 키와 컬럼명으로 focus()를 호출한다.', function() {
            spyOn(grid, 'focus');
            grid.focusInAt(0, 0, true);
            expect(grid.focus).toHaveBeenCalledWith(0, '_number', true);
        });
    });

    describe('check()', function() {
        it('주어진 rowkey에 해당하는 행의 _button 컬럼을 true로 설정한다.', function() {
            grid.check(0);
            expect(grid.getValue(0, '_button')).toBe(true);
        });
    });

    describe('uncheck()', function() {
        it('주어진 rowkey에 해당하는 행의 _button 컬럼을 false로 설정한다.', function() {
            grid.check(0);
            expect(grid.getValue(0, '_button')).toBe(true);
            grid.uncheck(0);
            expect(grid.getValue(0, '_button')).toBe(false);
        });
    });

    describe('checkAll()', function() {
        it('disabled 상태를 제외한 모든 행의 _button컬럼을 true로 설정한다.', function() {
            grid.checkAll();
            grid.dataModel.forEach(function(row, key) {
                if (key === 1) { //2번째 행은 disabled
                    expect(row.get('_button')).toBe(false);
                } else {
                    expect(row.get('_button')).toBe(true);
                }
            }, this);
        });
    });

    describe('uncheckAll()', function() {
        it('모든 행의 _button컬럼을 false로 설정한다. ', function() {
            grid.checkAll();
            grid.uncheckAll();
            grid.dataModel.forEach(function(row) {
                expect(row.get('_button')).toBe(false);
            }, this);
        });
    });

    describe('clear()', function() {
        it('등록된 행 데이터를 모두 삭제한다.', function() {
            grid.clear();
            expect(grid.getRowCount()).toBe(0);
        });
    });

    describe('removeRow()', function() {
        it('실제 remove 되는지 확인한다.', function() {
            expect(grid.getRowCount()).toBe(3);
            grid.removeRow(2);
            expect(grid.getRow(2)).not.toBeDefined();
            expect(grid.getRowCount()).toBe(2);
        });
    });

    describe('disableRow()', function() {
        it('disableRow 되는지 확인한다.', function() {
            expect(grid.dataModel.get(0).getRowState().isDisabled).toBe(false);
            grid.disableRow(0);
            expect(grid.dataModel.get(0).getRowState().isDisabled).toBe(true);
        });
    });

    describe('enableRow()', function() {
        it('enableRow 되는지 확인한다.', function() {
            expect(grid.dataModel.get(1).getRowState().isDisabled).toBe(true);
            grid.enableRow(1);
            expect(grid.dataModel.get(1).getRowState().isDisabled).toBe(false);
        });
    });

    describe('disableCheck()', function() {
        it('disableCheck 되는지 확인한다.', function() {
            grid.disableCheck(0);
            expect(grid.dataModel.get(0).getRowState().isDisabledCheck).toBe(true);
        });
    });

    describe('enableCheck()', function() {
        it('enableCheck 되는지 확인한다.', function() {
            grid.disableCheck(0);
            grid.enableCheck(0);
            expect(grid.dataModel.get(0).getRowState().isDisabledCheck).toBe(false);
        });
    });

    describe('check된 행 관련', function() {
        beforeEach(function() {
            grid.check(0);
            grid.check(2);
        });

        describe('getCheckedRowKeyList()', function() {
            it('check된 행의 rowKey 목록을 반환한다.', function() {
                expect(grid.getCheckedRowKeyList()).toEqual([0, 2]);
            });

            it('check된 행의 rowKey 목록을 json 문자열로 반환한다.', function() {
                expect(grid.getCheckedRowKeyList(true)).toBe($.toJSON([0, 2]));
            });
        });

        describe('getCheckedRowList()', function() {
            it('check된 행의 목록을 반환한다.', function() {
                var rowList = grid.getCheckedRowList();
                expect(rowList[0].rowKey).toBe(0);
                expect(rowList[1].rowKey).toBe(2);
                expect(rowList.length).toBe(2);
            });

            it('check된 행의 목록을 json 문자열로 반환한다.', function() {
                expect(grid.getCheckedRowList(true)).toBe($.toJSON(grid.getCheckedRowList()));
            });
        });
    });

    describe('getColumnModelList()', function() {
        it('columnModel의 columnModelList 값을 반환한다.', function() {
            spyOn(grid.columnModel, 'get');
            grid.getColumnModelList();
            expect(grid.columnModel.get).toHaveBeenCalledWith('columnModelList');
        });
    });

    describe('getModifiedRowList()', function() {
        it('dataModel.getModifiedRowList()를 호출한다.', function() {
            var options = {
                isOnlyChecked: false,
                isOnlyRowKeyList: true
            };
            spyOn(grid.dataModel, 'getModifiedRowList');
            grid.getModifiedRowList(options);
            expect(grid.dataModel.getModifiedRowList).toHaveBeenCalledWith(options);
        });
    });

    describe('appendRow()', function() {
        it('실제 데이터가 뒤에 추가되는지 확인한다.', function() {
            expect(grid.dataModel.length).toBe(3);
            grid.appendRow({
                c1: '3-1',
                c2: '3-2',
                c3: '3-3'
            });
            expect(grid.dataModel.length).toBe(4);
            expect(grid.dataModel.at(3).get('rowKey')).toBe(3);
        });
    });

    describe('prependRow()', function() {
        it('실제 데이터가 앞에 추가되는지 확인한다.', function() {
            expect(grid.dataModel.length).toBe(3);
            grid.prependRow({
                c1: '3-1',
                c2: '3-2',
                c3: '3-3'
            });
            expect(grid.dataModel.length).toBe(4);
            expect(grid.dataModel.at(0).get('rowKey')).toBe(3);
        });
    });

    describe('isChanged()', function() {
        it('변경사항이 없을때 false 를 반환한다.', function() {
            expect(grid.isChanged()).toBe(false);
        });

        it('데이터가 append 추가되었을때 변경사항을 감지한다.', function() {
            grid.appendRow({
                c1: '3-1',
                c2: '3-2',
                c3: '3-3'
            });
            expect(grid.isChanged()).toBe(true);
        });

        it('데이터가 prepend 추가되었을때 변경사항을 감지한다.', function() {
            grid.prependRow({
                c1: '3-1',
                c2: '3-2',
                c3: '3-3'
            });
            expect(grid.isChanged()).toBe(true);
        });

        it('데이터가 remove 되었을때 변경사항을 감지한다.', function() {
            grid.removeRow(2);
            expect(grid.isChanged()).toBe(true);
        });

        it('데이터가 변경 되었을때 변경사항을 감지한다.', function() {
            grid.setValue(0, 'c1', 'New0-1');
            expect(grid.isChanged()).toBe(true);
        });
    });
    describe('restore()', function() {
        beforeEach(function() {
            grid.appendRow({
                c1: '3-1',
                c2: '3-2',
                c3: '3-3'
            });
            grid.prependRow({
                c1: '4-1',
                c2: '4-2',
                c3: '4-3'
            });
            grid.removeRow(2);
            grid.setValue(0, 'c1', 'New0-1');
        });

        it('변경후 restore 하면 원상태로 돌아오는지 확인한다.', function() {
            expect(grid.isChanged()).toBe(true);
            grid.restore();
            expect(grid.isChanged()).toBe(false);
        });
    });

    describe('isEditable()', function() {
        it('주어진 rowKey에 해당하는 행의 isEditable()을 컬럼명과 함께 호출한다.', function() {
            var row = grid.dataModel.get(1);
            spyOn(row, 'isEditable');
            grid.isEditable(1, 'c2');
            expect(row.isEditable).toHaveBeenCalledWith('c2');
        });

        it('인자가 없으면 현재 focus된 행의 isEditable()을 컬럼명과 함께 호출한다.', function() {
            var row = grid.dataModel.get(0);
            grid.focus(0, 'c1');
            spyOn(row, 'isEditable');
            grid.isEditable();
            expect(row.isEditable).toHaveBeenCalledWith('c1');
        });
    });

    describe('isDisabled()', function() {
        it('주어진 rowKey에 해당하는 행의 isDisabled()을 컬럼명과 함께 호출한다.', function() {
            var row = grid.dataModel.get(1);
            spyOn(row, 'isDisabled');
            grid.isDisabled(1, 'c2');
            expect(row.isDisabled).toHaveBeenCalledWith('c2');
        });

        it('인자가 없으면 현재 focus된 행의 isDisabled()를 컬럼명과 함께 호출한다.', function() {
            var row = grid.dataModel.get(0);
            grid.focus(0, 'c1');
            spyOn(row, 'isDisabled');
            grid.isDisabled();
            expect(row.isDisabled).toHaveBeenCalledWith('c1');
        });
    });

    describe('getCellState()', function() {
        it('주어진 rowKey에 해당하는 행의 row.getCellState()을 호출한다.', function() {
            var row = grid.dataModel.get(1);
            spyOn(row, 'getCellState');
            grid.getCellState(1, 'c2');
            expect(row.getCellState).toHaveBeenCalledWith('c2');
        });

        it('인자가 없으면 현재 focus된 위치의 row.getCellState()을 호출한다.', function() {
            var row = grid.dataModel.get(0);
            grid.focus(0, 'c1');
            spyOn(row, 'getCellState');
            grid.getCellState();
            expect(row.getCellState).toHaveBeenCalledWith('c1');
        });
    });

    describe('getRowList()', function() {
        it('dataModel의 getRowList를 호출해서 결과를 반환한다.', function() {
            spyOn(grid.dataModel, 'getRowList');
            grid.getRowList();
            expect(grid.dataModel.getRowList).toHaveBeenCalled();
        });
    });

    describe('del()', function() {
        it('editable 하고, disabled 하지 않은 cell만 삭제한다.', function() {
            grid.del(0, 'c1');
            grid.del(0, 'c3');
            expect(grid.getValue(0, 'c1')).toBe('');
            expect(grid.getValue(0, 'c3')).toBe('0-3');

            grid.del(1, 'c1');
            grid.del(1, 'c2');
            expect(grid.getValue(1, 'c1')).toBe('1-1');
            expect(grid.getValue(1, 'c2')).toBe('1-2');
        });
    });
});
