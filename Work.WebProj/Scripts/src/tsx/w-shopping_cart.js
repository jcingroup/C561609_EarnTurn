function addCart(product_no) {
    var data = {
        "product_no": product_no,
        "select_id": $("#p_select_id").val(),
        "qty": $("#p_qty").val()
    };
    $.ajax({
        type: "POST",
        url: gb_approot + 'Products/ajax_addProduct',
        data: data,
        dataType: 'json'
    }).done(function (result, textStatus, jqXHRdata) {
        if (result.result) {
            $('.add-to-cart').fadeIn('slow').delay(1000).fadeOut('slow');
            $('#p_count').text(result.id);
        }
        else {
            alert(result.message);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown);
    });
}
