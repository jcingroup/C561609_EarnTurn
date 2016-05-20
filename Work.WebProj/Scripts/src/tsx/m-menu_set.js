var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var CommCmpt = require('comm-cmpt');
var CommFunc = require('comm-func');
var MenuSet;
(function (MenuSet) {
    var GridRow = (function (_super) {
        __extends(GridRow, _super);
        function GridRow() {
            _super.call(this);
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        GridRow.prototype.delCheck = function (i, chd) {
            this.props.delCheck(i, chd);
        };
        GridRow.prototype.modify = function () {
            this.props.updateType(this.props.primKey);
        };
        GridRow.prototype.render = function () {
            var StateForGird = CommCmpt.StateForGird;
            return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridCheckDel, {"iKey": this.props.ikey, "chd": this.props.itemData.check_del, "delCheck": this.delCheck})), React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.menu_id), React.createElement("td", null, this.props.itemData.parent_menu_id), React.createElement("td", null, this.props.itemData.menu_name), React.createElement("td", null, this.props.itemData.area), React.createElement("td", null, this.props.itemData.controller), React.createElement("td", null, this.props.itemData.action), React.createElement("td", null, this.props.itemData.icon_class), React.createElement("td", null, this.props.itemData.sort), React.createElement("td", null, this.props.itemData.is_folder ? React.createElement("span", {"className": "label label-success"}, "父選單") : React.createElement("span", {"className": "label label-primary"}, "子選單")));
        };
        GridRow.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/Menu'
        };
        return GridRow;
    })(React.Component);
    var GridForm = (function (_super) {
        __extends(GridForm, _super);
        function GridForm() {
            _super.call(this);
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.getAjaxInitData = this.getAjaxInitData.bind(this);
            this.setRolesCheck = this.setRolesCheck.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, is_folder: null },
                folder: []
            };
        }
        GridForm.prototype.componentDidMount = function () {
            this.queryGridData(1);
            this.getAjaxInitData();
        };
        GridForm.prototype.getAjaxInitData = function () {
            CommFunc.jqGet(this.props.apiInitPath, {})
                .done(function (data, textStatus, jqXHRdata) {
                console.log(data);
                this.setState({ folder: data.options_folder });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.gridData = function (page) {
            var parms = {
                page: 0
            };
            if (page == 0) {
                parms.page = this.state.gridData.page;
            }
            else {
                parms.page = page;
            }
            $.extend(parms, this.state.searchData);
            return CommFunc.jqGet(this.props.apiPath, parms);
        };
        GridForm.prototype.queryGridData = function (page) {
            var _this = this;
            this.gridData(page)
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ gridData: data });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.handleSubmit = function (e) {
            var _this = this;
            e.preventDefault();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '新增完成', 1);
                        _this.updateType(data.id);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
            }
            else if (this.state.edit_type == 2) {
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
                    .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '修改完成', 1);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
            }
            ;
            return;
        };
        GridForm.prototype.handleOnBlur = function (date) {
        };
        GridForm.prototype.deleteSubmit = function () {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].menu_id);
                }
            }
            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }
            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    CommFunc.tosMessage(null, '刪除完成', 1);
                    this.queryGridData(0);
                }
                else {
                    alert(data.message);
                }
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.handleSearch = function (e) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        };
        GridForm.prototype.delCheck = function (i, chd) {
            var newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        };
        GridForm.prototype.checkAll = function () {
            var newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        };
        GridForm.prototype.insertType = function () {
            var _this = this;
            CommFunc.jqGet(gb_approot + 'api/GetAction/GetInsertRoles', {})
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ edit_type: 1, fieldData: { role_array: data, parent_menu_id: 0, sort: 0 } });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.updateType = function (id) {
            var _this = this;
            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ edit_type: 2, fieldData: data.data });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.noneType = function () {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                this.setState({ edit_type: 0, gridData: data });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GridForm.prototype.changeFDValue = function (name, e) {
            this.setInputValue(this.props.fdName, name, e);
        };
        GridForm.prototype.changeGDValue = function (name, e) {
            this.setInputValue(this.props.gdName, name, e);
        };
        GridForm.prototype.setInputValue = function (collentName, name, e) {
            var input = e.target;
            var obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            }
            else if (input.value == 'false') {
                obj[name] = false;
            }
            else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        };
        GridForm.prototype.setRolesCheck = function (i, e) {
            var obj = this.state[this.props.fdName];
            var roleObj = obj['role_array'];
            var item = roleObj[i];
            item.role_use = !item.role_use;
            this.setState({ fieldData: obj });
        };
        GridForm.prototype.render = function () {
            var _this = this;
            var outHtml = null;
            if (this.state.edit_type == 0) {
                var searchData = this.state.searchData;
                var GridNavPage = CommCmpt.GridNavPage;
                outHtml =
                    (React.createElement("div", null, React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null, "menu名稱"), " ", React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeGDValue.bind(this, 'keyword'), "value": searchData.keyword, "placeholder": "請輸入關鍵字..."}), " ", React.createElement("label", null, "狀態"), " ", React.createElement("select", {"className": "form-control", "onChange": this.changeGDValue.bind(this, 'is_folder'), "value": searchData.is_folder}, React.createElement("option", {"value": ""}, "全部"), React.createElement("option", {"value": "true"}, "父選單"), React.createElement("option", {"value": "false"}, "子選單")), " ", React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-1"}, "編號"), React.createElement("th", {"className": "col-xs-1"}, "對應父選單"), React.createElement("th", {"className": "col-xs-2"}, "選單名稱"), React.createElement("th", {"className": "col-xs-1"}, "area"), React.createElement("th", {"className": "col-xs-1"}, "controller"), React.createElement("th", {"className": "col-xs-1"}, "action"), React.createElement("th", {"className": "col-xs-1"}, "icon_class"), React.createElement("th", {"className": "col-xs-1"}, "排序"), React.createElement("th", {"className": "col-xs-1"}, "選單狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                        return React.createElement(GridRow, {"key": i, "ikey": i, "primKey": itemData.menu_id, "itemData": itemData, "delCheck": _this.delCheck, "updateType": _this.updateType});
                    })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "queryGridData": this.queryGridData, "insertType": this.insertType, "deleteSubmit": this.deleteSubmit}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                var fieldData = this.state.fieldData;
                var InputDate = CommCmpt.InputDate;
                outHtml = (React.createElement("div", null, React.createElement("h4", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "編號"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "number", "className": "form-control", "value": fieldData.menu_id, "onChange": this.changeFDValue.bind(this, 'menu_id'), "placeholder": "系統自動產生", "disabled": true}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "選擇父選單"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("select", {"className": "form-control", "value": fieldData.parent_menu_id, "onChange": this.changeFDValue.bind(this, 'parent_menu_id')}, React.createElement("option", {"value": "0"}, "無"), this.state.folder.map(function (itemData, i) {
                    return React.createElement("option", {"key": i, "value": itemData.val}, itemData.Lname);
                }))), React.createElement("small", {"className": "help-inline col-xs-6 text-danger"}, "(必填) ")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "選單名稱"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "value": fieldData.menu_name, "onChange": this.changeFDValue.bind(this, 'menu_name'), "maxLength": 64, "required": true})), React.createElement("small", {"className": "help-inline col-xs-6 text-danger"}, "(必填) ")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "area"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "value": fieldData.area, "onChange": this.changeFDValue.bind(this, 'area'), "maxLength": 64}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "controller"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "value": fieldData.controller, "onChange": this.changeFDValue.bind(this, 'controller'), "maxLength": 16}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "action"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "value": fieldData.action, "onChange": this.changeFDValue.bind(this, 'action'), "maxLength": 16}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "icon_class"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "value": fieldData.icon_class, "onChange": this.changeFDValue.bind(this, 'icon_class'), "maxLength": 16}))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "排序"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "number", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'sort'), "value": fieldData.sort, "required": true})), React.createElement("small", {"className": "col-xs-6 help-inline"}, "由小到大排序")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "選單狀態"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "is_folder", "value": true, "checked": fieldData.is_folder === true, "onChange": this.changeFDValue.bind(this, 'is_folder')}), React.createElement("span", null, "父選單"))), React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "is_folder", "value": false, "checked": fieldData.is_folder === false, "onChange": this.changeFDValue.bind(this, 'is_folder')}), React.createElement("span", null, "子選單"))))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "使用狀態"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "is_use", "value": true, "checked": fieldData.is_use === true, "onChange": this.changeFDValue.bind(this, 'is_use')}), React.createElement("span", null, "使用中"))), React.createElement("div", {"className": "radio-inline"}, React.createElement("label", null, React.createElement("input", {"type": "radio", "name": "is_use", "value": false, "checked": fieldData.is_use === false, "onChange": this.changeFDValue.bind(this, 'is_use')}), React.createElement("span", null, "未使用"))))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "可檢視角色"), React.createElement("div", {"className": "col-xs-10"}, fieldData.role_array.map(function (itemData, i) {
                    return React.createElement("div", {"className": "checkbox", "key": itemData.role_id}, React.createElement("label", null, React.createElement("input", {"type": "checkbox", "checked": itemData.role_use, "onChange": _this.setRolesCheck.bind(_this, i)}), itemData.role_name));
                }))), React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "col-xs-4 col-xs-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), " ", React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁")))))));
            }
            return outHtml;
        };
        GridForm.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Menu',
            apiInitPath: gb_approot + 'Base/Menu/aj_Init'
        };
        return GridForm;
    })(React.Component);
    MenuSet.GridForm = GridForm;
})(MenuSet || (MenuSet = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(MenuSet.GridForm, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
