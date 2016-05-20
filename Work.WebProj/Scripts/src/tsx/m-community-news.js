var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');
var Moment = require('moment');
var CommCmpt = require('comm-cmpt');
var CommFunc = require('comm-func');
var dt = require('dt');
var DatePicker = require('react-datepicker');
require("react-datepicker/dist/react-datepicker.css");
var Matter;
(function (Matter) {
    var GridRow = (function (_super) {
        __extends(GridRow, _super);
        function GridRow() {
            _super.call(this);
            this.modify = this.modify.bind(this);
        }
        GridRow.prototype.modify = function () {
            this.props.updateType(this.props.primKey);
        };
        GridRow.prototype.render = function () {
            var state = [];
            state['A'] = React.createElement("span", {"className": "label label-success"}, "前台顯示");
            state['C'] = React.createElement("span", {"className": "label label-danger"}, "前台關閉");
            return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridButtonDel, {"removeItemSubmit": this.props.removeItemSubmit, "primKey": this.props.primKey})), React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.community_name), React.createElement("td", null, this.props.itemData.title), React.createElement("td", null, Moment(this.props.itemData.start_date).format(dt.dateFT)), React.createElement("td", null, Moment(this.props.itemData.end_date).format(dt.dateFT)), React.createElement("td", null, state[this.props.itemData.state]));
        };
        GridRow.defaultProps = {};
        return GridRow;
    })(React.Component);
    var GirdForm = (function (_super) {
        __extends(GirdForm, _super);
        function GirdForm() {
            _super.call(this);
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.removeItemSubmit = this.removeItemSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.componentWillUnmount = this.componentWillUnmount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.state = {
                fieldData: null,
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null },
                editPrimKey: null
            };
        }
        GirdForm.prototype.componentDidMount = function () {
            var _this = this;
            CommFunc.jqGet(gb_approot + 'Api/GetAction/GetOptionsCommunity', {})
                .done(function (data) {
                _this.setState({ options_community: data });
            });
            this.queryGridData(1);
        };
        GirdForm.prototype.componentDidUpdate = function (prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                CKEDITOR.replace('news_content', { customConfig: '../ckeditor/inlineConfig.js' });
            }
        };
        GirdForm.prototype.componentWillUnmount = function () {
        };
        GirdForm.prototype.gridData = function (page) {
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
        GirdForm.prototype.queryGridData = function (page) {
            var _this = this;
            this.gridData(page)
                .done(function (data, textStatus, jqXHRdata) {
                if (data.records == 0) {
                    CommFunc.tosMessage(null, '無任何資料', 2);
                }
                _this.setState({ gridData: data });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.handleSubmit = function (e) {
            var _this = this;
            e.preventDefault();
            this.state.fieldData.context = CKEDITOR.instances['news_content'].getData();
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
                var packData = { id: this.state.editPrimKey, md: this.state.fieldData };
                CommFunc.jqPut(this.props.apiPath, packData)
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
        GirdForm.prototype.deleteSubmit = function () {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].community_news_id);
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
        GirdForm.prototype.removeItemSubmit = function (primKey) {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            CommFunc.jqDelete(this.props.apiPath, { id: primKey })
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
        GirdForm.prototype.handleSearch = function (e) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        };
        GirdForm.prototype.delCheck = function (i, chd) {
            var newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        };
        GirdForm.prototype.checkAll = function () {
            var newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        };
        GirdForm.prototype.insertType = function () {
            this.setState({
                edit_type: 1,
                fieldData: {
                    start_date: Moment().toDate(),
                    state: 'A'
                }
            });
        };
        GirdForm.prototype.updateType = function (id) {
            var _this = this;
            var idPack = { id: id };
            CommFunc.jqGet(this.props.apiPath, idPack)
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({
                    edit_type: 2,
                    fieldData: data.data,
                    editPrimKey: id
                });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.noneType = function () {
            var _this = this;
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ edit_type: 0, gridData: data, editPrimKey: null });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        GirdForm.prototype.changeFDValue = function (name, e) {
            this.setEventValue(this.props.fdName, name, e);
        };
        GirdForm.prototype.changeGDValue = function (name, e) {
            this.setEventValue(this.props.gdName, name, e);
        };
        GirdForm.prototype.setEventValue = function (collentName, name, e) {
            var input = e.target;
            var value;
            if (input.value == 'true') {
                value = true;
            }
            else if (input.value == 'false') {
                value = false;
            }
            else {
                value = input.value;
            }
            var objForUpdate = (_a = {},
                _a[collentName] = (_b = {},
                    _b[name] = { $set: value },
                    _b
                ),
                _a
            );
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
            var _a, _b;
        };
        GirdForm.prototype.setInputValue = function (collentName, name, v) {
            var objForUpdate = (_a = {},
                _a[collentName] = (_b = {},
                    _b[name] = { $set: v },
                    _b
                ),
                _a
            );
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
            var _a, _b;
        };
        GirdForm.prototype.setInputValueMuti = function (collentName, name, v) {
            var objForUpdate = (_a = {}, _a[collentName] = {}, _a);
            for (var i in name) {
                var item = name[i];
                var value = v[i];
                objForUpdate[collentName][item] = { $set: value };
            }
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
            var _a;
        };
        GirdForm.prototype.setChangeDate = function (collentName, name, date) {
            var v = date == null ? null : date.format();
            var objForUpdate = (_a = {},
                _a[collentName] = (_b = {},
                    _b[name] = {
                        $set: v
                    },
                    _b
                ),
                _a
            );
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
            var _a, _b;
        };
        GirdForm.prototype.render = function () {
            var _this = this;
            var outHtml = null;
            var GridNavPage = CommCmpt.GridNavPage;
            if (this.state.edit_type == 0) {
                var search = this.state.searchData;
                outHtml =
                    (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), this.props.menuName)), React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null), React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeGDValue.bind(this, 'keyword'), "value": this.state.searchData.keyword, "placeholder": "社區名稱"}), React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-2"}, "社區名稱"), React.createElement("th", {"className": "col-xs-2"}, "標題"), React.createElement("th", {"className": "col-xs-2"}, "啟始日期"), React.createElement("th", {"className": "col-xs-2"}, "結束日期"), React.createElement("th", {"className": "col-xs-2"}, "狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                        return React.createElement(GridRow, {"key": i, "primKey": itemData.community_news_id, "itemData": itemData, "removeItemSubmit": _this.removeItemSubmit, "updateType": _this.updateType});
                    })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "queryGridData": this.queryGridData, "insertType": this.insertType, "deleteSubmit": this.deleteSubmit, "showDelete": false}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                var field = this.state.fieldData;
                var mnt_start_date = CommFunc.MntV(field.start_date);
                var mnt_end_date = CommFunc.MntV(field.end_date);
                var end_date_disabled = mnt_start_date == null ? true : false;
                var fldState = {
                    label: field.state == 'A' ?
                        React.createElement("label", {"className": "col-xs-1 control-label text-success"}, "狀態") :
                        React.createElement("label", {"className": "col-xs-1 control-label text-danger"}, "狀態"),
                    tip: field.state == 'A' ?
                        React.createElement("span", {"className": "col-xs-1"}) :
                        React.createElement("span", {"className": "col-xs-1"}, React.createElement(CommCmpt.Tips, {"comment": "前台關閉:即使日期目前仍在有效範圍也不會顯示在前台!"}))
                };
                var outHtml = (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), this.props.menuName)), React.createElement("h4", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-1 control-label"}, "標題"), React.createElement("div", {"className": "col-xs-4"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'title'), "value": field.title, "maxLength": 64, "required": true})), React.createElement("label", {"className": "col-xs-1 control-label"}, "來源社區"), React.createElement("div", {"className": "col-xs-3"}, React.createElement("select", {"className": "form-control", "required": true, "value": field.community_id, "onChange": this.changeFDValue.bind(this, 'community_id')}, React.createElement("option", {"value": ""}), this.state.options_community.map(function (item, i) {
                    return (React.createElement("option", {"value": item.community_id, "key": item.community_id}, item.community_name));
                })))), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-1 control-label"}, "時間"), React.createElement("div", {"className": "col-xs-4"}, React.createElement(DatePicker, {"selected": mnt_start_date, "dateFormat": dt.dateFT, "isClearable": true, "required": true, "locale": "zh-TW", "showYearDropdown": true, "minDate": Moment(), "onChange": this.setChangeDate.bind(this, this.props.fdName, 'start_date'), "className": "form-control"})), React.createElement("div", {"className": "col-xs-4"}, React.createElement(DatePicker, {"selected": mnt_end_date, "dateFormat": dt.dateFT, "isClearable": true, "required": true, "locale": "zh-TW", "showYearDropdown": true, "onChange": this.setChangeDate.bind(this, this.props.fdName, 'end_date'), "className": "form-control", "minDate": mnt_start_date, "disabled": end_date_disabled}))), React.createElement("div", {"className": "form-group"}, fldState.label, React.createElement("div", {"className": "col-xs-4"}, React.createElement("select", {"className": "form-control", "required": true, "value": field.state, "onChange": this.changeFDValue.bind(this, 'state')}, React.createElement("option", {"value": "A"}, "前台顯示"), React.createElement("option", {"value": "C"}, "前台關閉"))), fldState.tip), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-1 control-label"}, "內容"), React.createElement("div", {"className": "col-xs-8"}, React.createElement("textarea", {"type": "date", "className": "form-control", "id": "news_content", "name": "news_content", "value": field.context, "onChange": this.changeFDValue.bind(this, 'context')}))), React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "col-xs-4 col-xs-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁")))))));
            }
            return outHtml;
        };
        GirdForm.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/CommunityNews'
        };
        return GirdForm;
    })(React.Component);
    Matter.GirdForm = GirdForm;
})(Matter || (Matter = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(Matter.GirdForm, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
