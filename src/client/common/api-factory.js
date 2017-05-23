const _ = require("lodash");

export const ApiFactory = {
    createApi({headers, onError, urlModifier = (url) => url} = {}) {

        function beforeSend(request) {
            _.forIn(headers, (valueF, key)=> {
                let value = valueF();
                if (value ) {
                    request.setRequestHeader(key, value);
                }
            });
        }
        const xhrWithPayload = (method) => {
            return (url, payload) => {
                return new Promise((resolve, reject)=>{
                    $.ajax({
                        url: urlModifier("/api" + url),
                        data: JSON.stringify(payload),
                        beforeSend: beforeSend,
                        method: method,
                        contentType: "application/json",
                        success: (data)=>{
                            resolve(data);
                        },
                        error: (resp, status, error)=>{
                            reject(resp.responseJSON);
                        }
                    });
                });
            };
        };
        const xhrWithoutPayload = (method) => {
            return (url, options) => {
                return new Promise((resolve, reject)=>{
                    $.ajax({
                        url: urlModifier("/api" + url),
                        method: method,
                        beforeSend: beforeSend,
                        contentType: "application/json",
                        success: (data, status, resp)=>{
                            if (options && options.keepHttpResp) {
                                resolve({
                                    responseJSON: resp.responseJSON,
                                    getResponseHeader: resp.getResponseHeader
                                });
                            } else {
                                resolve(data);
                            }
                        },
                        error: (resp, status, error)=>{
                            reject(resp.responseJSON);
                            onError && onError();
                        }
                    });
                });
            };
        };

        return {
            get: xhrWithoutPayload("GET"),
            delete: xhrWithoutPayload("DELETE"),
            post: xhrWithPayload("POST"),
            put: xhrWithPayload("PUT"),
            postMultipart: (url, data)=>{

                var formData = new FormData();
                _.forIn(data, (value, key)=>{
                    if (value != null) {
                        formData.append(key, value);
                    }
                });

                return new Promise((resolve, reject)=>{
                    $.ajax({
                        url: urlModifier("/api" + url),
                        type: 'POST',
                        beforeSend: beforeSend,
                        data: formData,
                        cache: false,
                        dataType: 'json',
                        processData: false, // Don't process the files
                        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                        success: (data)=>{
                            resolve(data);
                        },
                        error: (resp, status, error)=>{
                            reject(error);
                        }
                    });
                });
            },
            postForm: (url, data)=> {

                return new Promise((resolve, reject)=>{
                    $.ajax({
                        url: urlModifier("/api" + url),
                        data: data,
                        beforeSend: beforeSend,
                        method: "POST",
                        success: (data)=>{
                            resolve(data);
                        },
                        error: (resp, status, error)=>{
                            reject(resp.responseJSON);
                        }
                    });
                });
            }
        };
    }
};