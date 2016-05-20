var MemberLogin;
(function (MemberLogin) {
    $("#MLogin").submit(function (event) {
        event.preventDefault();
        var data = {
            "act": $("#m_member_email").val(),
            "pwd": $("#m_member_pwd").val(),
            "validate": $("#m_Mlogin_validate").val()
        };
        $.ajax({
            type: "POST",
            url: gb_approot + 'Base/Login/ajax_MemberLogin',
            data: data,
            dataType: 'json'
        }).done(function (result, textStatus, jqXHRdata) {
            if (result.result) {
                document.location.href = document.referrer;
            }
            else {
                var newDate = new Date();
                $("#m_Mlogin_validate").val("");
                $("#m_member_pwd").val("");
                $("#m_Mlogin_img").attr("src", "/_Code/Ashx/ValidateCode.ashx?vn=MemberLogin&t" + newDate.getTime());
                alert(result.message);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        });
    });
})(MemberLogin || (MemberLogin = {}));
