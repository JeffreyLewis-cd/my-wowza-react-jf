let baseMethods = {
    localURL: "http://localhost:8087",
    wowzaURL: "http://182.151.49.151",
    wowzaURL_8087: "http://182.151.49.151:8087",
    wowzaURL_8088: "http://182.151.49.151:8088",
    wowzaIP: "182.151.49.151",
};

const headers01 = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
    'Authorization': 'wowza-101',
});


baseMethods.get = (url, header02) => {
    return fetch(url, {
        method: 'GET',
        headers: header02 || headers01
    }).then(response => {
        return handleResponse(url, response);
    }).catch(err => {
        console.error(`Request failed. Url = ${url} . Message = ${err}`);
        return {error: {message: err}};
    })
};

baseMethods.post = (url, data, header02) => {
    return fetch(url, {
        method: 'POST',
        headers: header02 || headers01,
        body: data ? JSON.stringify(data) : null,
        // body: data,
    }).then(response => {
        return handleResponse(url, response);
    }).catch(err => {
        console.error(`Request failed. Url = ${url} . Message = ${err}`);
        return {error: {message: 'Request failed.'}};
    })
};

baseMethods.formPost = (url, data, header02) => {
    return fetch(url, {
        method: 'POST',
        headers: header02 || headers01,
        body: data,
    }).then(response => {
        return handleResponse(url, response);
    }).catch(err => {
        console.error(`Request failed. Url = ${url} . Message = ${err}`);
        return {error: {message: 'Request failed.'}};
    })
};


baseMethods.delete = (url, data, header02) => {
    return fetch(url, {
        method: 'DELETE',
        headers: header02 || headers01,
        body: data ? JSON.stringify(data) : null,
        // body: data,
    }).then(response => {
        return handleResponse(url, response);
    }).catch(err => {
        console.error(`Request failed. Url = ${url} . Message = ${err}`);
        return {error: {message: 'Request failed.'}};
    })
};

baseMethods.put = (url, data, header02) => {
    return fetch(url, {
        method: 'PUT',
        headers: header02 || headers01,
        body: JSON.stringify(data)
    }).then(response => {
        return handleResponse(url, response);
    }).catch(err => {
        console.error(`Request failed. Url = ${url} . Message = ${err}`);
        return {error: {message: 'Request failed.'}};
    })
};

function handleResponse(url, response) {
    if (response.status < 500) {
        return response.json();
    } else {
        console.error(`Request failed. Url = ${url} . Message = ${response.statusText}`);
        return {error: {message: 'Request failed due to server error '}};
    }
}

export default baseMethods;
