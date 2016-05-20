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
var Edit;
(function (Edit) {
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
            return React.createElement("tr", null, React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridButtonDel, {"removeItemSubmit": this.props.removeItemSubmit, "primKey": this.props.primKey})), React.createElement("td", {"className": "text-center"}, React.createElement(CommCmpt.GridButtonModify, {"modify": this.modify})), React.createElement("td", null, this.props.itemData.edit_name), React.createElement("td", null, this.props.itemData.sort));
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
            this.queryGridData(1);
        };
        GirdForm.prototype.componentDidUpdate = function (prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                console.log('CKEDITOR');
                CKEDITOR.replace('edit_content', { customConfig: '../ckeditor/inlineConfig.js' });
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
            this.state.fieldData.edit_content = CKEDITOR.instances['edit_content'].getData();
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
                    ids.push('ids=' + this.state.gridData.rows[i].edit_id);
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
                edit_type: 1, fieldData: {}
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
            this.setInputValue(this.props.fdName, name, e);
        };
        GirdForm.prototype.changeGDValue = function (name, e) {
            this.setInputValue(this.props.gdName, name, e);
        };
        GirdForm.prototype.setInputValue = function (collentName, name, e) {
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
        GirdForm.prototype.render = function () {
            var _this = this;
            var outHtml = null;
            var GridNavPage = CommCmpt.GridNavPage;
            if (this.state.edit_type == 0) {
                var searchData = this.state.searchData;
                outHtml =
                    (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), this.props.menuName)), React.createElement("h3", {"className": "title"}, this.props.caption), React.createElement("form", {"onSubmit": this.handleSearch}, React.createElement("div", {"className": "table-responsive"}, React.createElement("div", {"className": "table-header"}, React.createElement("div", {"className": "table-filter"}, React.createElement("div", {"className": "form-inline"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", null), React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeGDValue.bind(this, 'keyword'), "value": this.state.searchData.keyword, "placeholder": "名稱"}), React.createElement("button", {"className": "btn-primary", "type": "submit"}, React.createElement("i", {"className": "fa-search"}), " 搜尋"))))), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {"className": "col-xs-1 text-center"}, React.createElement("label", {"className": "cbox"}, React.createElement("input", {"type": "checkbox", "checked": this.state.checkAll, "onChange": this.checkAll}), React.createElement("i", {"className": "fa-check"}))), React.createElement("th", {"className": "col-xs-1 text-center"}, "修改"), React.createElement("th", {"className": "col-xs-4"}, "名稱"), React.createElement("th", {"className": "col-xs-4"}, "排序"))), React.createElement("tbody", null, this.state.gridData.rows.map(function (itemData, i) {
                        return React.createElement(GridRow, {"key": i, "primKey": itemData.edit_id, "itemData": itemData, "removeItemSubmit": _this.removeItemSubmit, "updateType": _this.updateType});
                    })))), React.createElement(GridNavPage, {"startCount": this.state.gridData.startcount, "endCount": this.state.gridData.endcount, "recordCount": this.state.gridData.records, "totalPage": this.state.gridData.total, "nowPage": this.state.gridData.page, "queryGridData": this.queryGridData, "insertType": this.insertType, "deleteSubmit": this.deleteSubmit, "showDelete": false}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                var fieldData = this.state.fieldData;
                var outHtml = (React.createElement("div", null, React.createElement("ul", {"className": "breadcrumb"}, React.createElement("li", null, React.createElement("i", {"className": "fa-list-alt"}), this.props.menuName)), React.createElement("h4", {"className": "title"}, " ", this.props.caption, " 基本資料維護"), React.createElement("form", {"className": "form-horizontal", "onSubmit": this.handleSubmit}, React.createElement("div", {"className": "col-xs-10"}, React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "標題"), React.createElement("div", {"className": "col-xs-8"}, React.createElement("input", {"type": "text", "className": "form-control", "onChange": this.changeFDValue.bind(this, 'edit_name'), "value": fieldData.edit_name, "maxLength": 64, "required": true})), React.createElement("small", {"className": "col-xs-2 text-danger"}, "(必填) ")), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "col-xs-2 control-label"}, "內容"), React.createElement("div", {"className": "col-xs-10"}, React.createElement("textarea", {"type": "date", "className": "form-control", "id": "edit_content", "name": "edit_content", "value": fieldData.edit_content, "onChange": this.changeFDValue.bind(this, 'edit_content')}))), React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "col-xs-4 col-xs-offset-2"}, React.createElement("button", {"type": "submit", "className": "btn-primary"}, React.createElement("i", {"className": "fa-check"}), " 儲存"), " ", React.createElement("button", {"type": "button", "onClick": this.noneType}, React.createElement("i", {"className": "fa-times"}), " 回前頁")))))));
            }
            return outHtml;
        };
        GirdForm.defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Edit'
        };
        return GirdForm;
    })(React.Component);
    Edit.GirdForm = GirdForm;
})(Edit || (Edit = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(Edit.GirdForm, {"caption": gb_caption, "menuName": gb_menuname, "iconClass": "fa-list-alt"}), dom);
