export const getFetch = async function(type, url, params) {
    // console.log(fetch)
    let opts = {};
    if (type == 'get') {
        opts = {
            method: "GET"
        }
    } else {
        opts = {
            method: "POST",
            body: JSON.stringify(params),
            // body: JSON.stringify({
            //     "x": "113.95599299999998",
            //     "y": "22.56094300001027",
            //     "radius": 500
            // }),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
    }
    let res = await fetch(url, opts);
    let result = res.json();
    return result;

    // let data = await fetch(url, opts).then(function(res) {
    //     res.json().then(function(res) {
    //         console.log(res)
    //         return res;
    //     });
    // }).catch(error => {
    //
    // });
    // return data;
}