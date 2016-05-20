var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var CommFunc = require('comm-func');
var Login;
(function (Login) {
    var GridForm = (function (_super) {
        __extends(GridForm, _super);
        function GridForm() {
            _super.call(this);
            this.render = this.render.bind(this);
            this.onChange = this.onChange.bind(this);
            this.onChangeUpper = this.onChangeUpper.bind(this);
            this.getValidateUrl = this.getValidateUrl.bind(this);
            this.reLoadValidateUrl = this.reLoadValidateUrl.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.state = {
                field: {
                    account: debug_account,
                    password: debug_password,
                    validate: debug_validate
                },
                validateUrl: this.getValidateUrl()
            };
        }
        GridForm.prototype.onChange = function (name, e) {
            var input = e.target;
            var obj = this.state.field;
            obj[name] = input.value;
            this.setState({ field: obj });
        };
        GridForm.prototype.onChangeUpper = function (e) {
            var input = e.target;
            var obj = this.state.field;
            obj.validate = input.value.toUpperCase();
            this.setState({ field: obj });
        };
        GridForm.prototype.getValidateUrl = function () {
            return gb_approot + '_Code/Ashx/ValidateCode.ashx?vn=CheckCode&t=' + CommFunc.uniqid();
        };
        GridForm.prototype.reLoadValidateUrl = function () {
            var obj = this.state;
            obj.validateUrl = this.getValidateUrl();
            obj.field.validate = null;
            this.setState(obj);
        };
        GridForm.prototype.handleSubmit = function (e) {
            var _this = this;
            e.preventDefault();
            var data = {
                account: this.state.field.account,
                password: this.state.field.password,
                validate: this.state.field.validate,
                rememberme: this.state.field.rememberme,
                lang: 'zh-TW'
            };
            $("body").mask("檢查中請稍後...");
            var jqxhr = $.ajax({
                type: "POST",
                url: gb_approot + 'Base/Login/ajax_Login',
                data: data,
                dataType: 'json'
            })
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    document.location.href = data.url;
                }
                else {
                    var obj = _this.state;
                    obj.validateUrl = _this.getValidateUrl();
                    obj.field.password = '';
                    _this.setState(obj);
                    $("body").unmask();
                    alert(data.message);
                }
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                $("body").unmask();
                showAjaxError(errorThrown);
            });
            return;
        };
        GridForm.prototype.render = function () {
            return (React.createElement("div", null, React.createElement("h3", null, "System Login"), React.createElement("form", {"onSubmit": this.handleSubmit}, React.createElement("div", {"className": "form-group has-feedback"}, React.createElement("label", {"className": "control-label"}, "帳號 Username"), React.createElement("input", {"className": "form-control", "type": "text", "value": this.state.field.account, "tabIndex": 1, "placeholder": "帳號", "onChange": this.onChange.bind(this, 'account'), "required": true}), React.createElement("i", {"className": "fa-user form-control-feedback"})), React.createElement("div", {"className": "form-group has-feedback"}, React.createElement("label", {"className": "control-label"}, "密碼 Password"), React.createElement("input", {"className": "form-control", "type": "password", "value": this.state.field.password, "tabIndex": 2, "placeholder": "密碼", "onChange": this.onChange.bind(this, 'password'), "required": true}), React.createElement("i", {"className": "fa-lock form-control-feedback"})), React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "control-label"}, "驗證碼 Code"), React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-3"}, React.createElement("img", {"alt": "驗證碼", "src": this.state.validateUrl})), React.createElement("div", {"className": "col-xs-5"}, React.createElement("input", {"type": "text", "className": "form-control", "tabIndex": 3, "onChange": this.onChangeUpper, "value": this.state.field.validate, "required": true, "placeholder": "驗證碼"})), React.createElement("div", {"className": "col-xs-4"}, React.createElement("button", {"className": "btn btn-warning", "type": "button", "tabIndex": -1, "onClick": this.reLoadValidateUrl}, React.createElement("i", {"className": "fa-refresh"}), " 重取")))), React.createElement("div", {"className": "form-action"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-4"}, React.createElement("div", {"className": "checkbox"}, React.createElement("label", null, React.createElement("input", {"type": "checkbox", "tabIndex": -1}), React.createElement("span", null, "記住")))), React.createElement("div", {"className": "col-xs-3 col-xs-offset-1"}, React.createElement("button", {"className": "btn btn-info", "tabIndex": 4, "type": "submit"}, React.createElement("i", {"className": "fa-key"}), " 登錄")), React.createElement("div", {"className": "col-xs-4"}, React.createElement("button", {"tabIndex": -1, "type": "button"}, React.createElement("i", {"className": "fa-question-circle"}), " 忘記密碼")))))));
        };
        GridForm.defaultProps = {};
        return GridForm;
    })(React.Component);
    Login.GridForm = GridForm;
})(Login || (Login = {}));
var dom = document.getElementById('login-box');
ReactDOM.render(React.createElement(Login.GridForm, null), dom);
