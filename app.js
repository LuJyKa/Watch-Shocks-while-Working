/**
 * Created by rongshenghu on 15-8-5.
 */
var storage = {
    location: window.localStorage,
    set: function (key, value) {
        if (typeof(value) == 'object') {
            value = JSON.stringify(value);
        }
        storage.location.setItem(key, value);
    },
    get_code: function (code) {
        var codes = JSON.parse(storage.location.getItem('code'));
        if (code) {
            storage.set('max_order', 0);
            return codes[code];
        } else {
            return codes ? codes : {};
        }
    },
    get_order: function (order) {
        var orders = JSON.parse(storage.location.getItem('order'));
        if (order) {
            return orders[order];
        } else {
            return orders ? orders : {};
        }
    },
    get_max_order: function () {
        var max = storage.location.getItem('max_order');
        return max ? parseInt(max) : 0;
    },
    set_max_order: function (max_order) {
        return storage.location.setItem('max_order', max_order);
    },
    set_code: function (code) {
        var codes = storage.get_code();
        var max_order = storage.get_max_order() + 1;
        if (!codes[code]) {
            codes[code] = max_order;
            storage.set_max_order(max_order);
            var orders = storage.get_order();
            orders[max_order] = code;
            storage.set('code', codes);
            storage.set('order', orders);
        }
        console.log(storage.location);
    },
    remove_code: function (code) {
        if (code) {
            var codes = storage.get_code();
            if (codes[code]) {
                var orders = storage.get_order();
                delete  orders[codes[code]];
                delete codes[code];
                storage.set('code', codes);
                storage.set('order', orders);
            }
        } else {
            storage.location.clear();
        }
        console.log(storage.location);
    }
};
var listen = {
    init: function () {
        $('#add_item').on('click', function () {
            var value = $('#item').val().trim();
            $('#item').val('');
            panel.add(value);
        });
        $('#clear').on('click', function () {
            panel.clear();
        });
        $("#item_list ul").on('click', '.top', function () {
            var code = $(this).attr('data');
            panel.del(code);
            panel.add(code.substr(2, 6));
        }).on('click', '.del', function () {
            var value = $(this).attr('data');
            panel.del(value);
        });
        $("#tip").on('click', function () {
            $('div.tip').toggle();
        });
        $('#item').on('keyup', function (event) {
            if (event.keyCode == "13") {
                var value = $(this).val().trim();
                $(this).val('');
                panel.add(value);
            }
        });
    }
};
var panel = {
    init: function () {
        var orders = storage.get_order();
        if (orders) {
            $.each(orders, function (key, value) {
                panel.add_item(value);
            });
        }
    },
    add: function (value) {
        finance.handle_code(value, function (code) {
            storage.set_code(code);
            panel.add_item(code);
        });
    },
    del: function (value) {
        storage.remove_code(value);
        $("#item_" + value).remove();
    },
    clear: function () {
        storage.remove_code();
        $("li.item").remove();
    },
    add_item: function (value) {
        // Place a placeholder
        var li = "<li class='item' id='item_" + value + "'></li>";
        var exist = $("#item_" + value);
        if (exist.attr('id')) {
            
        } else {
            $("#last_item").after(li);
        }

        finance.handle_data(value, function (data) {
            var percent = data[5];
            var class_coloer = '';
            if (percent > 0) {
                class_coloer = 'red';
            } else if (percent == 0) {
                class_coloer = 'gray';
            } else {
                class_coloer = 'green';
            }
            var top = "<a href='#' class='top red' data='" + value + "'>Top</a>&nbsp;";
            var link = "<a href='" + finance.get_href_link(value) + "' target='_blank' class='data'>"
                + data[1].substr(0, 1)
                + value.substr(2, 6)
                + "</a>";
            var span_value = "<span class='value' title='" + data[1] + "'>" + link + "</span>&nbsp;";
            var span_start = "<span class='start black'>" + parseFloat(data[3] - data[4]).toFixed(3) + "</span>&nbsp;";
            var span_now = "<span class='now " + class_coloer + "'>" + parseFloat(data[3]).toFixed(3) + "</span>&nbsp;";
            var span_percent = "<span class='percent " + class_coloer + "'>" + percent + "%</span>&nbsp;";
            var del = "&nbsp;<a class='del' data='" + value + "' href='#'>X</a>";
            var li = "<li class='item' id='item_" + value + "'>" + top + span_value + span_start + span_now + span_percent + del + "</li>";
            var exist = $("#item_" + value);
            if (exist.attr('id')) {
                exist.html(top + span_value + span_start + span_now + span_percent + del);
            } else {
                $("#last_item").after(li);
            }
        });
    }
};
$(function () {
    listen.init();
    setTimeout(function () {
        panel.init();
    }, 50);
    setInterval(function () {
        panel.init();
    }, finance.wait);

});