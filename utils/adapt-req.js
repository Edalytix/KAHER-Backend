module.exports.adaptReq = (req, res) => {
    const body = req.files ? { ...req.body, files: req.files } : req.body;

    return Object.freeze({
        locals: res.locals,
        path: req.path,
        method: req.method,
        body,
        queryParams: req.query,
        urlParams: req.params,
        lang: res.locals.lang
    })
};

