var express = require("express")
var app = express()
var path = require("path")
var hbs = require('express-handlebars')
var formidable = require('formidable')
const PORT = process.env.PORT || 3000
var context = []
var id = 1
var icon = ["bmp", "doc", "docx", "exe", "gif", "htm", "html", "jpeg", "jpg", "mp3", "mp4", "pdf", "png", "ppt", "tiff", "txt", "zip", "unknown"]

app.get("/", function (req, res) {
    res.redirect("/upload")
})

app.get("/upload", function (req, res) {
    res.render('upload/upload.hbs')
})
app.get("/filemanager", function (req, res) {
    console.log(context)
    res.render('filemanager/filemanager.hbs', { context })
})
app.get("/info", function (req, res) {
    jeden = context[context.findIndex(({ id }) => id == req.query.id)]
    res.render('info/info.hbs', jeden)
})

app.post('/handleUpload', function (req, res) {
    let form = formidable({});
    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    form.parse(req, function (err, fields, files) {
        console.log(files)
        if (files.imageupload.length > 1) {
            for (let n = 0; n < files.imageupload.length; n++) {
                let format = ""
                var path = ""
                let skr = files.imageupload[n].path.split(".")[1]
                for (let s = 0; s < icon.length; s++) {
                    if (skr == icon[s]) {
                        format = icon[s]
                        break
                    }
                    else {
                        format = "unknown"
                    }
                }

                for (let k = files.imageupload[n].path.split("/").length - 2; k < files.imageupload[n].path.split("/").length; k++) {
                    path += "/" + files.imageupload[n].path.split("/")[k]
                }
                context.push({ id: id, name: files.imageupload[n].name, path: files.imageupload[n].path, size: files.imageupload[n].size, type: files.imageupload[n].type, savedate: new Date().getTime(), download: path, format: format.toUpperCase() })
                id += 1
            }
        } else {
            var path = ""
            let format = ""
            let skr = files.imageupload.path.split(".")[1]
            for (let s = 0; s < icon.length; s++) {
                if (skr == icon[s]) {
                    format = icon[s]
                    break
                }
                else {
                    format = "unknown"
                }
            }
            for (let k = files.imageupload.path.split("/").length - 2; k < files.imageupload.path.split("/").length; k++) {
                path += "/" + files.imageupload.path.split("/")[k]
            }
            context.push({ id: id, name: files.imageupload.name, path: files.imageupload.path, size: files.imageupload.size, type: files.imageupload.type, savedate: new Date().getTime(), download: path, format: format.toUpperCase() })
            id += 1
        }
        res.redirect("/filemanager")
    });

});

app.get("/delete", function (req, res) {
    context.splice(context.findIndex(({ id }) => id == req.query.id), 1)
    res.redirect("/filemanager")
})

app.get("/dellcontext", function (req, res) {
    context = []
    id = 1
    res.redirect("/filemanager")
})

app.set('views', path.join(__dirname, 'adres/'));

app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "adres/partial",
}))
app.set('view engine', 'hbs')
app.use(express.static('static'))
app.listen(PORT, function () {
    console.log("start servera na porcie " + PORT)
})