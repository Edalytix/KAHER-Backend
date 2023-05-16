/*
  This middleware takes the language from the url
  
*/


const setLanguage = (req, res, next) => {
    if (req.params.hasOwnProperty('language')) {
        res.locals.lang = req.params.language;
    } else {
        res.locals.lang = 'de';
    }
    return next();
}

module.exports = setLanguage;
