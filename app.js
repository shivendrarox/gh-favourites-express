const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const fileUpload = require('express-fileupload');
const port = 3000
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// enable files upload
app.use(fileUpload());

app.post('/generate-settings', (req, res) => {
    let settingsFromUser=req.body;
    res.set({"Content-Disposition":"attachment; filename=settings.json"});
   res.send(settingsFromUser);
  })

  app.post('/import-settings', (req, res) => {
      console.log(req.files)
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let settingsFromFile = req.files.settingsfile;

            //send response
            res.json(JSON.parse(settingsFromFile.data.toString()))
            
            // res.send({
            //     status: true,
            //     message: 'File is uploaded',
            //     data: {
            //         name: avatar.name,
            //         mimetype: avatar.mimetype,
            //         size: avatar.size
            //     }
            // });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})