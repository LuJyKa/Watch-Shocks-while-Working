/**
 * Created by rongshenghu on 15-8-5.
 */
var finance = {
    wait: 1000,
    get_href_link: function (code) {
        return "http://finance.sina.com.cn/realstock/company/" + code + "/nc.shtml";
    },
    get_code_url: function (code) {
        return "http://smartbox.gtimg.cn/s3/?t=all&q=" + code + "&cb=zepto_suggest_" + new Date().getTime();
    },
    handle_code: function (code, callback) {
        finance.send_request(finance.get_code_url(code), function (data) {
            var res = data.split('="')[1].split("~");
            if (res[0] == "sz" || res[0] == "sh") {
                callback(res[0] + res[1]);
            }
        });

    },
    get_data_url: function (code) {
        return "http://qt.gtimg.cn/r=121321q=s_" + code;
        // 新浪接口 return "http://hq.sinajs.cn/list=" + code;
    },
    handle_data: function (code, callback) {
        finance.send_request(finance.get_data_url(code), function (data) {
            var res = data.split('="')[1].split("~");
            callback(res);
        });
    },
    send_request: function (url, callback) {
        $.ajax({
            type: "GET",
            url: url,
            async: true,
            dataType: "json",
            success: function (data) {
                if (callback && typeof(callback) === 'function') {
                    callback(data);
                }
            },
            error: function (request, textStatus, errorThrown) {
                if (request.status == 200 && request.statusText == 'OK') {
                    this.success(request.responseText);
                    return;
                }
            }
        });
    }
};